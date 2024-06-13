import ReadingService from "../services/reading_service.mjs";
import TokenUtil from "../utility/token_util.mjs";

export default class ReadingController {
  static async apiAddReading(req, res, next) {
    try {
      const { sensor_id, moisture } = req.body;

      const serviceResponse = await ReadingService.addReading(
        sensor_id,
        moisture
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

  static async apiListReading(req, res, next) {
    try {
      let { name } = req.query;
      name = decodeURIComponent(name);
      const token = TokenUtil.cleanToken(req.headers["authorization"]);

      const serviceResponse = await ReadingService.listReadings(token, name);
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

  static async apiReadingsAnalytics(req, res, next) {
    try {
      let { name, filter } = req.query;
      name = decodeURIComponent(name);
      const token = TokenUtil.cleanToken(req.headers["authorization"]);
      const serviceResponse = await ReadingService.getGraphDataForReading(
        token,
        name,
        filter
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
