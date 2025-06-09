import crypto from "crypto";

class OTPUtils {

  //توليد كود OTP عشوائي آمن مكون من 6 أرقام

  static generateOTP(): string {
    // استخدام crypto module لإنشاء OTP آمن
    const buffer = crypto.randomBytes(3); // 3 بايتس = 6 خانات عشرية
    const otp = parseInt(buffer.toString("hex"), 16) % 1000000;
    return otp.toString().padStart(6, "0");
  }

  //توليد hash آمن لـ OTP للتخزين في قاعدة البيانات

  static generateOTPHash(otp: string): string {
    return crypto.createHash("sha256").update(otp).digest("hex");
  }
  
}

export { OTPUtils };
