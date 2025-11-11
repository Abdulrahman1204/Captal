import 'dotenv/config';
import axios from 'axios';

/** ========= Helpers ========= */
function formatSaudiPhone(input: string): string {
  let d = (input || '').replace(/\D+/g, '');
  if (d.startsWith('00966')) d = '966' + d.slice(5);
  if (d.startsWith('05') && d.length === 10) d = '966' + d.slice(1);
  else if (d.startsWith('5') && d.length === 9) d = '966' + d;
  if (!(d.startsWith('9665') && d.length === 12)) {
    throw new Error('❌ أدخل رقم سعودي صحيح بصيغة 9665XXXXXXXX (مثال: 9665XXXXXXXX)');
  }
  return d;
}

function env() {
  const userName = (process.env.MSEGAT_USERNAME ?? '').trim();
  const apiKey   = (process.env.MSEGAT_API_KEY ?? '').trim();
  const sender   = (process.env.MSEGAT_SENDER_ID ?? '').trim();
  const number   = formatSaudiPhone(process.env.TEST_NUMBER ?? '');
  if (!userName || !apiKey) throw new Error('❌ MSEGAT_USERNAME/MSEGAT_API_KEY مفقودة');
  return { userName, apiKey, sender, number };
}

/** ========= 1) Balance ========= */
async function testBalance() {
  const { userName, apiKey } = env();
  const form = new URLSearchParams();
  form.append('userName', userName);
  form.append('apiKey', apiKey);
  form.append('msgEncoding', 'UTF8');

  console.log('🧾 Testing Msegat balance credentials...');
  const { data } = await axios.post('https://www.msegat.com/gw/Credits.php', form, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    timeout: 10000,
  });
  console.log('✅ Balance Response:', data);

  const numericOk =
    typeof data === 'number' || (typeof data === 'string' && /^\d+(\.\d+)?$/.test(data));
  const jsonOk = data?.userBalance !== undefined || data?.code === '1' || data?.code === 'M0000';
  if (numericOk || jsonOk) {
    console.log('✅ اتصال ناجح — بيانات الاعتماد صحيحة.');
    return true;
  }
  console.warn('⚠️ فشل الاستعلام عن الرصيد:', data);
  return false;
}

/** ========= 2) Free OTP via sendsms.php ========= */
async function testFreeOtpViaSendSms() {
  const { userName, apiKey, number } = env();
  const msg = 'رمز التحقق: 1234'; // التزم بالقالب
  const form = new URLSearchParams();
  form.append('userName', userName);
  form.append('apiKey', apiKey);
  form.append('numbers', number);
  form.append('userSender', 'auth-mseg'); // شرط الـ Free OTP
  form.append('msg', msg);
  form.append('msgEncoding', 'UTF8');

  console.log('\n📤 Sending FREE OTP via sendsms.php (auth-mseg)...');
  const { data } = await axios.post('https://www.msegat.com/gw/sendsms.php', form, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    timeout: 10000,
  });
  console.log('📦 sendsms.php Response:', data);
  return data;
}

/** ========= 3) Official OTP via sendOTPCode.php (JSON) ========= */
async function testOfficialOtpApi() {
  const { userName, apiKey, sender, number } = env();
  if (!sender) throw new Error('❌ MSEGAT_SENDER_ID مطلوب لاختبار OTP الرسمي');

  console.log('\n🔐 Sending OTP via sendOTPCode.php (JSON) with your sender...');
  const { data } = await axios.post(
    'https://www.msegat.com/gw/sendOTPCode.php',
    {
      lang: 'Ar', // أو 'En'
      userName,
      number,     // لاحظ: "number" مفرد هنا
      apiKey,
      userSender: sender,
    },
    { headers: { 'Content-Type': 'application/json' }, timeout: 10000 }
  );
  console.log('📦 sendOTPCode.php Response:', data);
  return data;
}

/** ========= Run ========= */
(async () => {
  try {
    const ok = await testBalance();
    if (!ok) return console.error('❌ فشل اختبار بيانات الدخول — لن يتم إرسال SMS.');

    const r1 = await testFreeOtpViaSendSms(); // قد يرجع M0002 عندك
    // إن فشل أو لم يرجع نجاح، نجرب واجهة OTP الرسمية
    if (!(r1?.code === '1' || r1?.code === 'M0000')) {
      const r2 = await testOfficialOtpApi();
      if (r2?.code === '1' || r2?.code === 'M0000') {
        console.log('✅ OTP API نجحت — بإمكانك اعتماد sendOTPCode/verifyOTPCode في مشروعك.');
      } else {
        console.log('⚠️ OTP API لم ترجع نجاح. الاستجابة أعلاه توضّح السبب.');
      }
    } else {
      console.log('✅ Free OTP via sendsms.php نجحت.');
    }
  } catch (e: any) {
    console.error('❌ Error:', e?.response?.data ?? e?.message ?? e);
  }
})();
