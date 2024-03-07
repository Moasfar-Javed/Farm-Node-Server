import HardwareService from "../services/hardware_service.mjs";
import TokenUtil from "../utility/token_util.mjs";

export default class HardwareController {
  static async apiAddSensor(req, res, next) {
    try {
      const serviceResponse = await HardwareService.addSensor();
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

  static async apiAssociateSensor(req, res, next) {
    try {
      let { id, name } = req.query;
      name = decodeURIComponent(name);
      const token = TokenUtil.cleanToken(req.headers["authorization"]);

      const serviceResponse = await HardwareService.associateSensor(
        token,
        id.toUpperCase(),
        name
      );
      if (typeof serviceResponse === "string") {
        res
          .status(200)
          .json({ success: false, data: {}, message: serviceResponse });
      } else {
        res.status(200).json({
          success: true,
          data: serviceResponse,
          message: "Hardware paired successfully",
        });
      }
    } catch (e) {
      res.status(500).json({ success: false, data: {}, message: e.message });
    }
  }

  static async apiDisassociateSensor(req, res, next) {
    try {
      let { id, name } = req.query;
      name = decodeURIComponent(name);
      const token = TokenUtil.cleanToken(req.headers["authorization"]);

      const serviceResponse = await HardwareService.disassociateSensor(
        token,
        id.toUpperCase(),
        name
      );
      if (typeof serviceResponse === "string") {
        res
          .status(200)
          .json({ success: false, data: {}, message: serviceResponse });
      } else {
        res.status(200).json({
          success: true,
          data: serviceResponse,
          message: "Hardware unpaired successfully",
        });
      }
    } catch (e) {
      res.status(500).json({ success: false, data: {}, message: e.message });
    }
  }
}
