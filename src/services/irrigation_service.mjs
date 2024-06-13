import IrrigationDAO from "../data/irrigation_dao.mjs";
import PatternUtil from "../utility/pattern_util.mjs";
import CropService from "./crop_service.mjs";
import NotificationService from "./notification_service.mjs";
import UserService from "./user_service.mjs";
import { sendMessageToClient } from "../utility/websocket_utility.mjs";
import HardwareService from "./hardware_service.mjs";

export default class IrrigationService {
  static async connectDatabase(client) {
    try {
      await IrrigationDAO.injectDB(client);
    } catch (e) {
      console.error(`Unable to establish a collection handle: ${e}`);
    }
  }

  static async addRelease(cropId, sensorId, duration, soilCondition) {
    try {
      const crop = await CropService.getCropById(cropId);

      const createdOn = new Date();
      const deletedOn = null;
      const readingDocument = {
        sensor_id: sensorId,
        crop_id: cropId,
        release_duration: duration,
        soil_condition: soilCondition,
        water_on: true,
        manual: false,
        released_on: createdOn,
        created_on: createdOn,
        deleted_on: deletedOn,
      };

      const addedReadingId = await IrrigationDAO.addReleaseToDB(
        readingDocument
      );

      //SENDING THE NOTIFICATION TO USER
      const user = await UserService.getUserByID(crop.user_id);
      const notification = await NotificationService.sendNotification(
        user,
        "open_release",
        cropId.toString(),
        "Water Released",
        `Water for your ${crop.title} has been released and will be turned off automatically after ${duration} minutes`
      );

      const addedReading = await IrrigationDAO.getIrrigationByIDFromDB(
        addedReadingId
      );

      return { irrigation: addedReading };
    } catch (e) {
      return e.message;
    }
  }

  static async addManualRelease(token, cropTitle, duration) {
    try {
      const user = await UserService.getUserFromToken(token);

      const crop = await CropService.getCropByUserIdAndTitle(
        user._id,
        cropTitle
      );

      if (!crop) {
        return "No crop exists for the specified name";
      }

      const sensorId = await HardwareService.getSensorByCropId(crop._id);

      if (!sensorId) {
        return "No hardware associated with this crop/zone";
      }

      const notification = await NotificationService.sendNotification(
        user,
        "open_release",
        crop._id.toString(),
        "Water Release Scheduled",
        `Water for your ${crop.title} will be released shortly and will be turned off automatically after ${duration} minutes`
      );

      const createdOn = new Date();
      const deletedOn = null;
      const readingDocument = {
        sensor_id: sensorId,
        crop_id: crop._id,
        release_duration: duration,
        soil_condition: null,
        water_on: true,
        manual: true,
        released_on: createdOn,
        created_on: createdOn,
        deleted_on: deletedOn,
      };

      const addedReadingId = await IrrigationDAO.addReleaseToDB(
        readingDocument
      );

      const result = sendMessageToClient(sensorId, {
        duration: duration,
      });

      console.log(result);
      console.log(duration);

      const addedReading = await IrrigationDAO.getIrrigationByIDFromDB(
        addedReadingId
      );

      return { irrigation: addedReading };
    } catch (e) {
      return e.message;
    }
  }

  static async deleteIrrigationsForSensor(sensorId) {
    try {
      const [sensor, readings] = await Promise.all([
        HardwareService.getSensorBySensorId(sensorId),
        IrrigationDAO.getIrrigationListBySensor(sensorId),
      ]);

      if (!sensor) {
        return "No sensor exists with the specified sensor ID";
      } else if (!readings || readings.length == 0) {
        return "No readings logged by this hardware yet";
      }

      const deletedOn = new Date();
      const updateDoc = {
        deleted_on: deletedOn,
      };

      const addedReadingId = await IrrigationDAO.updateIrrigationFieldByID(
        updateDoc
      );
      return {};
    } catch (e) {
      return e.message;
    }
  }

  static async listIrrigations(token, cropTitle) {
    try {
      const user = await UserService.getUserFromToken(token);

      const crop = await CropService.getCropByUserIdAndTitle(
        user._id,
        cropTitle
      );

      if (!crop) {
        return "No crop exists for the specified name";
      }

      const irrigations = await IrrigationDAO.getIrrigationListByCrop(crop._id);

      const filteredIrrigations = irrigations.map((crop) => {
        const filteredReading = PatternUtil.filterParametersFromObject(crop, [
          "_id",
          "sensor_id",
          "crop_id",
        ]);
        return filteredReading;
      });

      return { irrigations: filteredIrrigations };
    } catch (e) {
      return e.message;
    }
  }

  static async listIrrigationsByCropId(cropId) {
    try {
      const irrigations = await IrrigationDAO.getIrrigationListByCrop(cropId);

      const filteredIrrigations = irrigations.map((crop) => {
        const filteredReading = PatternUtil.filterParametersFromObject(crop, [
          "_id",
          "sensor_id",
          "crop_id",
        ]);
        return filteredReading;
      });

      return { irrigations: filteredIrrigations };
    } catch (e) {
      return e.message;
    }
  }

  static async toggleWaterOff(sensorId) {
    try {
      const updateCropResponse = await IrrigationDAO.toggleWaterOff(sensorId, {
        water_on: false,
      });

      return true;
    } catch (e) {
      console.log(e.message);
      return false;
    }
  }
}
