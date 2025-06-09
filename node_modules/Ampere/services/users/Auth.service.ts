import { BadRequestError, NotFoundError } from "../../middlewares/handleErrors";
import {
  User,
  validationSendOtp,
  validationOtp,
} from "../../models/users/User.model";
import { IOtp, IUser } from "../../models/users/dtos";
import { OTPUtils } from "../../utils/generateOtp";
import { generateJWT } from "../../utils/generateToken";

class AuthService {
  // ~ Post => /api/captal/auth/send-otp ~ Send Otp To User
  static async sendOtpUser(userData: IUser): Promise<IUser> {
    const { error } = validationSendOtp(userData);
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    const phone = userData.phone;

    const user = await User.findOne({ phone });
    if (!user) {
      throw new NotFoundError("رقم الهاتف غير مسجل لدينا");
    }

    const otp = OTPUtils.generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = otp;
    user.expiresAt = expiresAt;
    await user.save();

    return user;
  }

  // ~ Post => /api/captal/auth/verify-otp/:id ~ Verfy Otp For User
  static async verifyOtpUser(otpData: IOtp, id: string): Promise<string> {
    const { error } = validationOtp(otpData);
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    const otp = otpData.otp;

    const user = await User.findById(id).select("+otp +expiresAt");
    if (!user || user.otp !== otp) {
      throw new BadRequestError("كود التحقق غير صحيح");
    }

    if (new Date(user.expiresAt) < new Date()) {
      throw new BadRequestError("انتهت صلاحية الكود");
    }

    await User.findByIdAndUpdate(user._id, {
      $unset: { otp: 1, expiresAt: 1 },
    });

    const token = generateJWT({
      id: user._id.toString(),
      role: user.role,
    });

    return token;
  }
}

export { AuthService };
