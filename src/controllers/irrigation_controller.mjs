import IrrigationService from "../services/irrigation_service.mjs";
import TokenUtil from "../utility/token_util.mjs";

export default class IrrigationController {
  static async apiListIrrigations(req, res, next) {
    try {
      let { name } = req.query;
      name = decodeURIComponent(name);
      const token = TokenUtil.cleanToken(req.headers["authorization"]);
      const serviceResponse = await IrrigationService.listIrrigations(
        token,
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
          message: "",
        });
      }
    } catch (e) {
      res.status(500).json({ success: false, data: {}, message: e.message });
    }
  }
}
