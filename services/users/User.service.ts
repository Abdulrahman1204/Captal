import { BadRequestError, NotFoundError } from "../../middlewares/handleErrors";
import { IUser } from "../../models/users/dtos";
import {
  User,
  validationCreateUser,
  validationUpdateUser,
} from "../../models/users/User.model";

class UserService {
  // ~ Post => /api/captal/user ~ Create New User
  static async createNewUser(userData: IUser): Promise<IUser> {
    const { error } = validationCreateUser(userData);
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    const existingUser = await User.findOne({ phone: userData.phone });
    if (existingUser) {
      throw new BadRequestError("رقم الهاتف موجود مسبقا");
    }

    const newUser = await User.create({
      firstName: userData.firstName,
      lastName: userData.lastName,
      phone: userData.phone,
      email: userData.email,
      companyName: userData.companyName,
      DateOfCompany: userData.DateOfCompany,
      role: userData.role,
    });

    if (!newUser) {
      throw new BadRequestError("فشل في إضافة مستخدم");
    }

    return newUser;
  }

  // ~ PUT => /api/captal/user/:id ~ Update User
  static async updateUser(userData: IUser, id: string): Promise<IUser> {
    const { error } = validationUpdateUser(userData);
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    const user = await User.findById(id);
    if (!user) {
      throw new NotFoundError("المستخدم غير موجود");
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        $set: {
          firstName: userData.firstName,
          lastName: userData.lastName,
          phone: userData.phone,
          email: userData.email,
          companyName: userData.companyName,
          DateOfCompany: userData.DateOfCompany,
          role: userData.role,
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      throw new BadRequestError("فشل في إضافة التصنيف الفرعي");
    }

    return user;
  }

  // ~ DELETE => /api/captal/user/:id ~ Delete User
  static async deleteUser(id: string): Promise<IUser> {
    const user = await User.findById(id);
    if (!user) {
      throw new NotFoundError("المستخدم غير موجود");
    }

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      throw new BadRequestError("فشل في إضافة التصنيف الفرعي");
    }

    return user;
  }

  // ~ Get => /api/captal/user ~ GET Users
  static async getUsers(role?: string): Promise<IUser[]> {
    const query: any = {};
    
    // If role is provided, add it to the query
    if (role) {
      query.role = role;
    }
    
    const users = await User.find(query).sort({ createdAt: -1 });
    return users;
  }

  // ~ Get => /api/captal/user/:id ~ GET Profile User
  static async getProfileUser(id: string): Promise<IUser> {
    const user = await User.findById(id).sort({ createdAt: -1 });
    if (!user) {
      throw new NotFoundError("المستخدم غير موجود");
    }
    return user;
  }
}

export { UserService };
