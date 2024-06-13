import express from "express";
import checkRequiredFieldsMiddleware from "../middleware/check_required_fields_middleware.mjs";
import checkTokenMiddleware from "../middleware/check_token_middleware.mjs";
import IrrigationController from "../controllers/irrigation_controller.mjs";

const router = express.Router();

const baseRoute = "/irrigation";

//api routes
router
  .route(baseRoute + "/list")
  .get(
    checkRequiredFieldsMiddleware(["name"]),
    checkTokenMiddleware,
    IrrigationController.apiListIrrigations
  );

router
  .route(baseRoute + "/manual-release")
  .post(
    checkRequiredFieldsMiddleware(["duration"]),
    checkTokenMiddleware,
    IrrigationController.apiReleaseIrrigation
  );

router
  .route(baseRoute + "/analytics")
  .get(
    checkRequiredFieldsMiddleware(["name", "filter"]),
    checkTokenMiddleware,
    IrrigationController.apiIrrigationsAnalytics
  );

export default router;
