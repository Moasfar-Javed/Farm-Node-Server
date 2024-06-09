import { ObjectId } from "mongodb";
import CropService from "./crop_service.mjs";
import UserService from "./user_service.mjs";
import NotificationService from "./notification_service.mjs";
import IrrigationService from "./irrigation_service.mjs";
import HardwareService from "./hardware_service.mjs";

export default class PredictorService {
  static async requestPrediction() {
    //TODO: SEND A REQUEST TO THE PYTHON SERVER TO APPLY PREDICTION
    //(WEATHER DATA + READINGS)
    //http://host/api/v1/predictor/predict
  }

  static async handlePrediction(cropId, releaseDuration, healthStatus) {
    try {
      const cropObjId = new ObjectId(cropId);

      const [crop, sensor] = await Promise.all([
        CropService.getCropById(cropObjId),
        HardwareService.getSensorByCropId(cropObjId),
      ]);

      if (!crop) {
        return "No crop exists with the specified crop ID";
      }

      const updateDocument = {
        crop_health_status: healthStatus,
        release_duration: releaseDuration,
      };

      const updatedCrop = await CropService.updateCropById(
        cropObjId,
        updateDocument
      );

      //SENDING THE NOTIFICATION TO USER
      const user = await UserService.getUserByID(crop.user_id);
      const notification = await NotificationService.sendNotification(
        user,
        "open_crop",
        cropId,
        "Irrigation Update",
        `Your farm will be irrigated soon for ${releaseDuration} minutes. Current health status is ${healthStatus}`
      );

      this.releaseWater(cropObjId, sensor._id, releaseDuration);

      return {};
    } catch (e) {
      return e.message;
    }
  }

  static async releaseWater(cropId, sensorId, releaseDuration) {
    //TODO: SEND THE NOTIFICATION OUT TO THE HARDWARE
    //AND KEEP TRYING AFTER EVERY 5MINS
    //TILL A VALID HANDSHAKE IS ESTABLISHED
    //WHEN THE HANDSHAKE IS ESTABLISHED DO THIS
    await IrrigationService.addRelease(cropId, sensorId, releaseDuration);
  }
}
