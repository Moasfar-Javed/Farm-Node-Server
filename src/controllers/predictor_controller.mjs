import PredictorService from "../services/predictor_service.mjs";
import ReadingService from "../services/reading_service.mjs";
import { ObjectId } from "mongodb";

export default class PredictorController {
  static async apiHandlePredictionResult(req, res, next) {
    try {
      const { crop_id } = req.body;
      const cropId = new ObjectId(crop_id);
      const serviceResponse = await PredictorService.requestPrediction(cropId);
      if (typeof serviceResponse === "string") {
        res
          .status(200)
          .json({ success: false, data: {}, message: serviceResponse });
      } else {
        res.status(200).json({
          success: true,
          data: serviceResponse,
          message:
            "Database updated, cron job scheduled and user notified successfully",
        });
      }
    } catch (e) {
      res.status(500).json({ success: false, data: {}, message: e.message });
    }
  }
}
