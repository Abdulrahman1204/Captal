// services/mssgaty.service.ts
import axios from "axios";

export class MsegatService {
  private static readonly userName = "Captalsaudi";
  private static readonly apiKey = "2C83001818C597FC980855DD61E2B87A";
  private static readonly sender = "CAP TAL";
  private static readonly endpoint = "https://www.msegat.com/gw/sendsms.php";

  private static client = axios.create({
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  /**
   * إرسال SMS عام
   */
  static async sendSMS(phone: string, message: string): Promise<boolean> {
    try {
      const formattedPhone = this.formatPhone(phone);

      const payload = {
        userName: this.userName,
        apiKey: this.apiKey,
        numbers: formattedPhone,
        userSender: this.sender,
        msg: message,
        msgEncoding: "UTF8" as const,
        By: "API",
      };

      console.log("📤 Sending SMS to:", `****${formattedPhone.slice(-4)}`);

      const { data } = await this.client.post(this.endpoint, payload);
      console.log("✅ Msegat Response:", data);

      return data.code === "1" || data.code === "M0000";
    } catch (err: any) {
      console.error("❌ Msegat SMS Error:", err.response?.data || err.message);
      return false;
    }
  }

  /**
   * إرسال تأكيد استلام طلب جديد
   */
  static async sendOrderConfirmation(phone: string): Promise<boolean> {
    const message = `تم استلام طلبك, سنقوم بمراجعة طلبك شكراً لثقتكم`;

    return this.sendSMS(phone, message);
  }

  /**
   * إرسال إشعار تغيير حالة الطلب
   */
  static async sendStatusUpdate(phone: string): Promise<boolean> {
    const message = `تم تغيير حالة طلبك`;

    return this.sendSMS(phone, message);
  }

  /**
   * إرسال رسالة مخصصة حسب حالة الطلب
   */
  static async sendCustomStatusMessage(
    phone: string,
    orderType: string,
    orderName: string,
    newStatus: string
  ): Promise<boolean> {
    const customMessages: { [key: string]: string } = {
      pending: `${orderType} "${orderName}" قيد المراجعة. سنقوم بالتواصل معكم قريباً.`,
      accepted: `مبروك! تم قبول ${orderType} "${orderName}". يمكنكم الآن متابعة الخطوات التالية.`,
      approved: `مبروك! تم قبول ${orderType} "${orderName}". يمكنكم الآن متابعة الخطوات التالية.`,
      "not accepted": `نأسف لإبلاغكم أن ${orderType} "${orderName}" قد تم رفضه. للاستفسار يرجى التواصل مع الدعم.`,
      rejected: `نأسف لإبلاغكم أن ${orderType} "${orderName}" قد تم رفضه. للاستفسار يرجى التواصل مع الدعم.`,
      "an invoice has been issued": `تم إصدار فاتورة ${orderType} "${orderName}". يرجى سداد المبلغ للمتابعة.`,
      shipped: `تم شحن ${orderType} "${orderName}". سيتم التسليم قريباً.`,
      delivered: `تم تسليم ${orderType} "${orderName}" بنجاح. نتمنى لكم التوفيق.`,
      in_progress: `${orderType} "${orderName}" قيد التنفيذ حالياً. سنخطركم بأي تطورات.`,
      completed: `تم الانتهاء من ${orderType} "${orderName}" بنجاح. شكراً لتعاملكم معنا.`,
    };

    const message =
      customMessages[newStatus] ||
      `تم تحديث حالة ${orderType} "${orderName}" إلى "${newStatus}"`;

    return this.sendSMS(phone, message);
  }

  private static formatPhone(phone: string): string {
    const cleanPhone = phone.replace(/\D+/g, "");

    if (cleanPhone.startsWith("05") && cleanPhone.length === 10) {
      return "966" + cleanPhone.substring(1);
    }

    if (cleanPhone.startsWith("5") && cleanPhone.length === 9) {
      return "966" + cleanPhone;
    }

    if (cleanPhone.length !== 12) {
      throw new Error("Invalid Saudi mobile number");
    }

    return cleanPhone;
  }
}
