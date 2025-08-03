import { BadRequestError, NotFoundError } from "../../middlewares/handleErrors";
import { IUser } from "../../models/users/dtos";
import {
  User,
  validationCreateUser,
  validationUpdateUser,
} from "../../models/users/User.model";
import { CloudinaryFiles } from "../../utils/types";

class UserService {
  // ~ Post => /api/captal/user ~ Create New User
  static async createNewUser(
    userData: IUser,
    files?: CloudinaryFiles[]
  ): Promise<IUser> {
    const { error } = validationCreateUser(userData);
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    const existingUser = await User.findOne({ phone: userData.phone });
    if (existingUser) {
      throw new BadRequestError("رقم الهاتف موجود مسبقا");
    }

    const attachments =
      files?.map((file) => ({
        url: file.secure_url || file.path || "",
        publicId: file.public_id || file.filename || null,
      })) || [];

    const newUser = await User.create({
      firstName: userData.firstName,
      lastName: userData.lastName,
      phone: userData.phone,
      email: userData.email,
      companyName: userData.companyName,
      DateOfCompany: userData.DateOfCompany,
      role: userData.role,

      // معلومات المورد
      supplierNumber: userData.supplierNumber,
      supplierName: userData.supplierName,
      entityType: userData.entityType || undefined,
      legalEntity: userData.legalEntity,
      commercialRegistrationNumber: userData.commercialRegistrationNumber,
      taxNumber: userData.taxNumber,
      registrationDate: userData.registrationDate,
      resourceStatus: userData.resourceStatus,
      typeOfTransaction: userData.typeOfTransaction,
      exemptionOption: userData.exemptionOption,
      internationalResource: userData.internationalResource,
      freezeTheAccount: userData.freezeTheAccount,
      currency: userData.currency,
      bankAccountNumber: userData.bankAccountNumber,
      bankName: userData.bankName,
      taxDiscountRate: userData.taxDiscountRate,
      paymentTerms: userData.paymentTerms,
      contractStartDate: userData.contractStartDate,
      contractEndDate: userData.contractEndDate,

      // العنوان
      address1: userData.address1,
      address2: userData.address2,
      city: userData.city,
      region: userData.region,
      postalCode: userData.postalCode,
      country: userData.country,
      countryCode: userData.countryCode,

      // الهوية
      identityNumber: userData.identityNumber,
      nationality: userData.nationality,
      issuingAuthority: userData.issuingAuthority,

      // الاتصالات
      mobile1: userData.mobile1,
      mobile2: userData.mobile2,
      mobile3: userData.mobile3,
      fax: userData.fax,
      emailOfficial: userData.emailOfficial,

      // المسؤول
      supplierRepresentative: userData.supplierRepresentative,

      // إضافات
      contact1: userData.contact1,
      contact2: userData.contact2,
      classification1: userData.classification1,
      classification2: userData.classification2,
      location: userData.location,
      notes: userData.notes,
      attachments: attachments,
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

          // معلومات المورد
          supplierNumber: userData.supplierNumber,
          supplierName: userData.supplierName,
          entityType: userData.entityType,
          legalEntity: userData.legalEntity,
          commercialRegistrationNumber: userData.commercialRegistrationNumber,
          taxNumber: userData.taxNumber,
          registrationDate: userData.registrationDate,
          resourceStatus: userData.resourceStatus,
          typeOfTransaction: userData.typeOfTransaction,
          exemptionOption: userData.exemptionOption,
          internationalResource: userData.internationalResource,
          freezeTheAccount: userData.freezeTheAccount,
          currency: userData.currency,
          bankAccountNumber: userData.bankAccountNumber,
          bankName: userData.bankName,
          taxDiscountRate: userData.taxDiscountRate,
          paymentTerms: userData.paymentTerms,
          contractStartDate: userData.contractStartDate,
          contractEndDate: userData.contractEndDate,

          // العنوان
          address1: userData.address1,
          address2: userData.address2,
          city: userData.city,
          region: userData.region,
          postalCode: userData.postalCode,
          country: userData.country,
          countryCode: userData.countryCode,

          // الهوية
          identityNumber: userData.identityNumber,
          nationality: userData.nationality,
          issuingAuthority: userData.issuingAuthority,

          // الاتصالات
          mobile1: userData.mobile1,
          mobile2: userData.mobile2,
          mobile3: userData.mobile3,
          fax: userData.fax,
          emailOfficial: userData.emailOfficial,

          // المسؤول
          supplierRepresentative: userData.supplierRepresentative,

          // إضافات
          contact1: userData.contact1,
          contact2: userData.contact2,
          classification1: userData.classification1,
          classification2: userData.classification2,
          location: userData.location,
          notes: userData.notes,
          attachments: userData.attachments,
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
