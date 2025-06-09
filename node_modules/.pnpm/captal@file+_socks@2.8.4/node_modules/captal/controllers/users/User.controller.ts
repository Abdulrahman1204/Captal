import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { UserService } from "../../services/users/User.service";

class UserController {
  // ~ Post => /api/captal/user ~ Create New User
  createNewUserCtrl = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      await UserService.createNewUser(req.body);
      res.status(201).json({
        message: "تم إنشاء الحساب بنجاح",
      });
    }
  );

  // ~ PUT => /api/captal/user/:id ~ Update User
  updateUserCtrl = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      await UserService.updateUser(req.body, req.params.id);

      res.status(200).json({
        message: "تم تحديث الحساب بنجاح",
      });
    }
  );

  // ~ DELETE => /api/captal/user/:id ~ Delete User
  deleteUserCtrl = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      await UserService.deleteUser(req.params.id);

      res.status(200).json({
        message: "تم حذف الحساب بنجاح",
      });
    }
  );

  // ~ Get => /api/captal/user ~ GET User
  getUsersCtrl = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const users = await UserService.getUsers();

      res.status(200).json(users);
    }
  );

  // ~ Get => /api/captal/user/:id ~ GET Profile User
  getProfileUserCtrl = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const user = await UserService.getProfileUser(req.params.id);

      res.status(200).json(user);
    }
  );
}

export default new UserController();
