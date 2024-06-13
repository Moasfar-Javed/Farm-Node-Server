import express from "express";
import checkRequiredFieldsMiddleware from "../middleware/check_required_fields_middleware.mjs";
import ReadingController from "../controllers/reading_controller.mjs";
import checkTokenMiddleware from "../middleware/check_token_middleware.mjs";

const router = express.Router();

const baseRoute = "/reading";

//api routes

router.route(baseRoute + "/upload").post(
  checkRequiredFieldsMiddleware(["sensor_id", "moisture"]),

  ReadingController.apiAddReading
);

router
  .route(baseRoute + "/list")
  .get(
    checkRequiredFieldsMiddleware(["name"]),
    checkTokenMiddleware,
    ReadingController.apiListReading
  );

router
  .route(baseRoute + "/analytics")
  .get(
    checkRequiredFieldsMiddleware(["name", "filter"]),
    checkTokenMiddleware,
    ReadingController.apiReadingsAnalytics
  );

export default router;
