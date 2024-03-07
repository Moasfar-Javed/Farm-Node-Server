import PredictorService from "../services/predictor_service.mjs";
import ReadingService from "../services/reading_service.mjs";

export default class PredictorController {
  static async apiHandlePredictionResult(req, res, next) {
    try {
      const {
        crop_id,
        next_irrigation,
        release_duration,
        health_status,
        optimal_irrigation,
      } = req.body;

      const serviceResponse = await PredictorService.handlePrediction(
        crop_id,
        next_irrigation,
        release_duration,
        health_status,
        optimal_irrigation
      );
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
