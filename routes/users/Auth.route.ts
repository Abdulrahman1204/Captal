import { Router } from "express";
import AuthController from "../../controllers/users/Auth.controller";

const router: Router = Router();

// ~ Post => /api/captal/auth/send-otp ~ Send Otp To User
router.route('/send-otp').post(AuthController.sendOtpUserCtrl);

// ~ Post => /api/captal/auth/verify-otp/:id ~ Verfy Otp For User
router.route('/verify-otp/:id').post(AuthController.verifyOTPCtrl)

export default router;
