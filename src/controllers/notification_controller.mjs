import NotificationService from "../services/notification_service.mjs";
import TokenUtil from "../utility/token_util.mjs";

export default class NotificationController {
  static async apiSendNotification(req, res, next) {
    try {
      const { action, id, title, message } = req.body;

      const token = TokenUtil.cleanToken(req.headers["authorization"]);

      const serviceResponse = await NotificationService.sendNotification(
        token,

        action,
        id,
        title,
        message
      );
      if (typeof serviceResponse === "string") {
        res
          .status(200)
          .json({ success: false, data: {}, message: serviceResponse });
      } else {
        res.status(200).json({
          success: true,
          data: serviceResponse,
          message: "Notification sent to the device",
        });
      }
    } catch (e) {
      res.status(500).json({ success: false, data: {}, message: e.message });
    }
  }

  static async apiListNotifications(req, res, next) {
    try {
      const token = TokenUtil.cleanToken(req.headers["authorization"]);

      const serviceResponse = await NotificationService.listNotifications(
        token
      );
      if (typeof serviceResponse === "string") {
        res
          .status(200)
          .json({ success: false, data: {}, message: serviceResponse });
      } else {
        res.status(200).json({
          success: true,
          data: serviceResponse,
          message: "",
        });
      }
    } catch (e) {
      res.status(500).json({ success: false, data: {}, message: e.message });
    }
  }
}
