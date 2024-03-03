import express from "express";
import UserController from "../controllers/user_controller.mjs";
import checkRequiredFieldsMiddleware from "../middleware/check_required_fields_middleware.mjs";

const router = express.Router();

const baseRoute = "/user";

//api routes
router
  .route(baseRoute + "/get-or-create")
  .post(
    checkRequiredFieldsMiddleware(["fire_uid", "phone_or_email", "fcm_token"]),
    UserController.apiGetOrCreateUserAccount
  );

// router
//   .route(baseRoute + "/refresh-fcm-token")
//   .post(
//     checkRequiredFieldsMiddleware(["fcm_token"]),
//     UserController.apiGetOrCreateUserAccount
//   );

export default router;
