import express from "express";
import UserController from "../controllers/user_controller.mjs";
import checkRequiredFieldsMiddleware from "../middleware/check_required_fields_middleware.mjs";
import checkTokenMiddleware from "../middleware/check_token_middleware.mjs";

const router = express.Router();

const baseRoute = "/user";

//api routes
router
  .route(baseRoute + "/sign-in-or-up")
  .post(
    checkRequiredFieldsMiddleware(["fire_uid", "phone_or_email", "fcm_token"]),
    UserController.apiGetOrCreateUserAccount
  );

router
  .route(baseRoute + "/detail")
  .get(checkTokenMiddleware, UserController.apiGetUserDetail);

router
  .route(baseRoute + "/sign-out")
  .delete(checkTokenMiddleware, UserController.apiSignOutUser);

export default router;
