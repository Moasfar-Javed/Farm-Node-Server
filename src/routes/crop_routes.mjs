import express from "express";
import checkRequiredFieldsMiddleware from "../middleware/check_required_fields_middleware.mjs";
import CropController from "../controllers/crop_controller.mjs";
import checkTokenMiddleware from "../middleware/check_token_middleware.mjs";

const router = express.Router();

const baseRoute = "/crop";

//api routes
router
  .route(baseRoute + "/create")
  .post(
    checkRequiredFieldsMiddleware([
      "title",
      "preferred_release_duration",
      "preferred_release_time",
      "automatic_irrigation",
      "maintain_logs",
    ]),
    checkTokenMiddleware,
    CropController.apiCreateCrop
  );

router
  .route(baseRoute + "/list")
  .get(checkTokenMiddleware, CropController.apiListCrops);

router
  .route(baseRoute + "/types")
  .get(checkTokenMiddleware, CropController.apiListCropTypes);

router
  .route(baseRoute + "/remove")
  .delete(
    checkRequiredFieldsMiddleware(["name"]),
    checkTokenMiddleware,
    CropController.apiDeleteCrop
  );

router
  .route(baseRoute + "/update")
  .put(
    checkRequiredFieldsMiddleware(
      ["name"],
      [
        "title",
        "preferred_release_duration",
        "preferred_release_time",
        "automatic_irrigation",
        "maintain_logs",
      ]
    ),
    checkTokenMiddleware,
    CropController.apiUpdateCrop
  );

export default router;
