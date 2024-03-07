import express from "express";
import checkRequiredFieldsMiddleware from "../middleware/check_required_fields_middleware.mjs";
import checkTokenMiddleware from "../middleware/check_token_middleware.mjs";
import HardwareController from "../controllers/hardware_controller.mjs";

const router = express.Router();

const baseRoute = "/hardware";

//api routes
router.route(baseRoute + "/create").post(HardwareController.apiAddSensor);

router
  .route(baseRoute + "/associate")
  .post(
    checkRequiredFieldsMiddleware(["id", "name"]),
    checkTokenMiddleware,
    HardwareController.apiAssociateSensor
  );

router
  .route(baseRoute + "/disassociate")
  .delete(
    checkRequiredFieldsMiddleware(["id", "name"]),
    checkTokenMiddleware,
    HardwareController.apiDisassociateSensor
  );

export default router;
