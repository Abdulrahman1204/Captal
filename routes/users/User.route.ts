import { Router } from "express";
import UserController from "../../controllers/users/User.controller";
import verifyToken from "../../middlewares/verifyToken";
import checkRole from "../../middlewares/checkRole";

const router: Router = Router();

// ~ Post => /api/captal/user ~ Create New User + // ~ Get => /api/captal/user ~ GET User
router
  .route("")
  .post(verifyToken, checkRole(["admin"]), UserController.createNewUserCtrl)
  .get(verifyToken, checkRole(["admin"]), UserController.getUsersCtrl);

// ~ PUT => /api/captal/user/:id ~ Update User + // ~ DELETE => /api/captal/user/:id ~ Delete User
router
  .route("/:id")
  .get(verifyToken, UserController.getProfileUserCtrl)
  .put(verifyToken, checkRole(["admin"]), UserController.updateUserCtrl)
  .delete(verifyToken, checkRole(["admin"]), UserController.deleteUserCtrl);

export default router;
