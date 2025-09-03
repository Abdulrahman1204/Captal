import { Router } from "express";
import ClassFatherController from "../../../controllers/classifications/father/ClassFather.controller";
import verifyToken from "../../../middlewares/verifyToken";
import checkRole from "../../../middlewares/checkRole";

const router: Router = Router();

// ~ POST => /api/captal/ClassFather ~ Create New Classification Father + // ~ GET => /api/captal/ClassFather ~ Get All Classification Father
router
  .route("")
  .post(
    verifyToken,
    checkRole(["admin", "intering"]),
    ClassFatherController.createNewClassFatherCtrl
  )
  .get(
    verifyToken,
    checkRole(["admin", "intering"]),
    ClassFatherController.getClassFatherCtrl
  );

// ~ PUT => /api/captal/ClassFather/:id ~ Update Classification Father + // ~ DELETE => /api/captal/ClassFather/:id ~ Delete Classification Father
router
  .route("/:id")
  .put(
    verifyToken,
    checkRole(["admin", "intering"]),
    ClassFatherController.updateClassFatherCtrl
  )
  .delete(
    verifyToken,
    checkRole(["admin", "intering"]),
    ClassFatherController.deleteClassFatherCtrl
  );

export default router;
