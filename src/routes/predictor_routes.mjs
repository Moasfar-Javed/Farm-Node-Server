import express from "express";
import PredictorController from "../controllers/predictor_controller.mjs";
import checkRequiredFieldsMiddleware from "../middleware/check_required_fields_middleware.mjs";

const router = express.Router();

const baseRoute = "/predictor";

//api routes
router
  .route(baseRoute + "/result")
  .post(PredictorController.apiHandlePredictionResult);

export default router;
