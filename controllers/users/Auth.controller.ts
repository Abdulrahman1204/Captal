import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { AuthService } from "../../services/users/Auth.service";
import { User } from "../../models/users/User.model";
import { NotFoundError } from "../../middlewares/handleErrors";

class AuthController {
  // ~ Post => /api/captal/auth/send-otp ~ Send Otp To User
  sendOtpUserCtrl = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const user = await AuthService.sendOtpUser(req.body);

      res.status(200).json({
        message: "تم إرسال كود التحقق بنجاح",
        user: user._id,
        otp: user.otp,
      });
    }
  );

  // ~ Post => /api/captal/auth/verify-otp/:id ~ Verfy Otp For User
  verifyOTPCtrl = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const token = await AuthService.verifyOtpUser(req.body, req.params.id);

      const user = await User.findById(req.params.id);
      if (!user) {
        throw new NotFoundError("المستخدم غير موجود");
      }

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 30 * 1000,
      });

      res.status(200).json({
        message: "تم تسجيل الدخول بنجاح",
        user: {
          _id: user._id,
          phone: user.phone,
          role: user.role,
        },
        token,
      });
    }
  );
}

export default new AuthController();
