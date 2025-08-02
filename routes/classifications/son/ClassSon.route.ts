import { Router } from "express";
import ClassSonController from "../../../controllers/classifications/son/ClassSon.controller";
import verifyToken from "../../../middlewares/verifyToken";
import checkRole from "../../../middlewares/checkRole";

const router: Router = Router();

// ~ POST => /api/captal/ClassSon ~ Create New Classification Son + // ~ GET => /api/captal/ClassSon ~ Get All Classification Son
router
  .route("")
  .post(
    verifyToken,
    checkRole(["admin", "intering"]),
    ClassSonController.createNewClassSonCtrl
  )
  .get(verifyToken, checkRole(["admin"]), ClassSonController.getClassSon);

// ~ PUT => /api/captal/ClassSon/:id ~ Update Classification Son + // ~ DELETE => /api/captal/ClassSon/:id ~ Delete Classification Son
router
  .route("/:id")
  .put(verifyToken, checkRole(["admin"]), ClassSonController.updateClassSonCtrl)
  .delete(
    verifyToken,
    checkRole(["admin"]),
    ClassSonController.deleteClassSonCtrl
  );

export default router;
