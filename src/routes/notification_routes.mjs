import express from "express";
import checkRequiredFieldsMiddleware from "../middleware/check_required_fields_middleware.mjs";
import checkTokenMiddleware from "../middleware/check_token_middleware.mjs";
import NotificationController from "../controllers/notification_controller.mjs";

const router = express.Router();

const baseRoute = "/notification";

//api routes
router
  .route(baseRoute + "/send")
  .post(
    checkRequiredFieldsMiddleware(["action", "id", "title", "message"]),
    checkTokenMiddleware,
    NotificationController.apiSendNotification
  );

router
  .route(baseRoute + "/list")
  .get(checkTokenMiddleware, NotificationController.apiListNotifications);

export default router;
