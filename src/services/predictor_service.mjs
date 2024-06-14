import { ObjectId } from "mongodb";
import CropService from "./crop_service.mjs";
import UserService from "./user_service.mjs";
import NotificationService from "./notification_service.mjs";
import IrrigationService from "./irrigation_service.mjs";
import HardwareService from "./hardware_service.mjs";
import { sendMessageToClient } from "../utility/websocket_utility.mjs";
import axios from "axios";
import WeatherService from "./weather_service.mjs";
import ReadingService from "./reading_service.mjs";

export default class PredictorService {
  static async requestPrediction(id) {
    const cropId = new ObjectId(id);

    const crop = await CropService.getCropById(cropId);

    const [weather, readings] = await Promise.all([
      WeatherService.getWeather(crop.latitude, crop.longitude),
      ReadingService.listReadingsById(cropId),
    ]);

    if (!crop || !weather || !readings) {
      console.log("One or more required data is not available");
      return;
    }

    const params = {
      crop: crop,
      readings: readings,
      weather: weather,
    };
    console.log(params);
    const response = await axios.post(
      "http://43.204.234.34/predictor/predict",
      params
    );
    if (response.status !== 200) {
      console.log(`Predictor Error: ${response.body}`);
    } else {
      console.log(response.data);
      console.log(response.data.data);
      const health = response.data.data.health;
      const releaseDuration = response.data.data.release_duration[0];
      const soilCondition = response.data.data.soil_type;
      await this.handlePrediction(
        cropId,
        releaseDuration,
        health,
        soilCondition
      );
      // return response.data;
    }
  }

  static async handlePrediction(
    cropId,
    releaseDuration,
    healthStatus,
    soilCondition
  ) {
    try {
      const [crop, sensor] = await Promise.all([
        CropService.getCropById(cropId),
        HardwareService.getSensorByCropId(cropId),
      ]);

      if (!crop) {
        return "No crop exists with the specified crop ID";
      }
      const analyzedOn = new Date();
      const updateDocument = {
        last_analyzed_on: analyzedOn,
        crop_health_status: healthStatus,
      };

      const updatedCrop = await CropService.updateCropById(
        cropId,
        updateDocument
      );

      //SENDING THE NOTIFICATION TO USER
      const user = await UserService.getUserByID(crop.user_id);
      const notification = await NotificationService.sendNotification(
        user,
        "open_crop",
        cropId.toString(),
        "Irrigation Update",
        `Your farm will be irrigated soon for ${releaseDuration} minutes. Current health status is ${healthStatus}`
      );

      this.releaseWater(
        user,
        cropId,
        sensor._id,
        releaseDuration,
        soilCondition
      );

      return {};
    } catch (e) {
      return e.message;
    }
  }

  static async releaseWater(
    user,
    cropId,
    sensorId,
    releaseDuration,
    soilCondition
  ) {
    const result = sendMessageToClient(user, sensorId.toString(), {
      duration: releaseDuration,
    });
    if (result) {
      await IrrigationService.addRelease(
        cropId,
        sensorId,
        releaseDuration,
        soilCondition
      );
    } else {
      await delay(2000);
      const resultTwo = sendMessageToClient(user, sensorId.toString(), {
        duration: releaseDuration,
      });
      if (resultTwo) {
        await IrrigationService.addRelease(
          cropId,
          sensorId,
          releaseDuration,
          soilCondition
        );
      } else {
        const notification = await NotificationService.sendNotification(
          user,
          "open_crop",
          cropId.toString(),
          "Hardware Offline",
          `Time for irrigation but your hardware is offline, please check up on your hardware`
        );
      }
    }
  }
}
