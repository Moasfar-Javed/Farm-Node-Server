import express from "express";
import PredictorController from "../controllers/predictor_controller.mjs";
import checkRequiredFieldsMiddleware from "../middleware/check_required_fields_middleware.mjs";

const router = express.Router();

const baseRoute = "/predictor";

//api routes
router.route(baseRoute + "/result").post(
  checkRequiredFieldsMiddleware([
    "crop_id",
    "next_irrigation",
    "release_duration",
    "health_status",
    "optimal_irrigation",
  ]),

  PredictorController.apiHandlePredictionResult
);

export default router;
