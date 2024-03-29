import UserService from "../services/user_service.mjs";
import TokenUtil from "../utility/token_util.mjs";

export default class UserController {
  static async apiGetOrCreateUserAccount(req, res, next) {
    try {
      const { fire_uid, phone_or_email, fcm_token } = req.body;

      const serviceResponse = await UserService.getOrAddUser(
        fire_uid,
        phone_or_email,
        fcm_token
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

  static async apiGetUserDetail(req, res, next) {
    try {
      const token = TokenUtil.cleanToken(req.headers["authorization"]);
      const serviceResponse = await UserService.getUserDetails(token);
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

  static async apiSignOutUser(req, res, next) {
    try {
      const token = TokenUtil.cleanToken(req.headers["authorization"]);
      const serviceResponse = await UserService.signOutUser(token);
      if (typeof serviceResponse === "string") {
        res
          .status(200)
          .json({ success: false, data: {}, message: serviceResponse });
      } else {
        res.status(200).json({
          success: true,
          data: serviceResponse,
          message: "User signed out successfully",
        });
      }
    } catch (e) {
      res.status(500).json({ success: false, data: {}, message: e.message });
    }
  }
}
