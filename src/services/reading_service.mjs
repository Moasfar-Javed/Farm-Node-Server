import ReadingDAO from "../data/reading_dao.mjs";
import PatternUtil from "../utility/pattern_util.mjs";
import CropService from "./crop_service.mjs";
import NotificationService from "./notification_service.mjs";
import PredictorService from "./predictor_service.mjs";
import HardwareService from "./hardware_service.mjs";
import UserService from "./user_service.mjs";

export default class ReadingService {
  static async connectDatabase(client) {
    try {
      await ReadingDAO.injectDB(client);
    } catch (e) {
      console.error(`Unable to establish a collection handle: ${e}`);
    }
  }

  static async addReading(sensorId, moisture, ph) {
    try {
      const sensor = await HardwareService.getSensorBySensorId(sensorId);

      if (!sensor) {
        return "No sensor exists with the specified sensor ID";
      }

      const createdOn = new Date();
      const deletedOn = null;
      const readingDocument = {
        sensor_id: sensorId,
        crop_id: sensor.crop_id,
        moisture: moisture,
        created_on: createdOn,
        deleted_on: deletedOn,
      };

      const addedReadingId = await ReadingDAO.addReadingToDB(readingDocument);

      //SENDING THE NOTIFICATION TO USER
      const user = await UserService.getUserByID(sensor.user._id);
      const notification = await NotificationService.sendNotification(
        user,
        "open_logs",
        sensor.crop_id.toString(),
        "Hourly Farm Update",
        `Your current pH levels are ${ph} and moisture is ${moisture} wfm`
      );

      const addedReading = await ReadingDAO.getReadingByIDFromDB(
        addedReadingId
      );

      await PredictorService.requestPrediction();

      return { reading: addedReading };
    } catch (e) {
      return e.message;
    }
  }

  static async deleteReadingsForSensor(sensorId) {
    try {
      const [sensor, readings] = await Promise.all([
        HardwareService.getSensorBySensorId(sensorId),
        ReadingDAO.getReadingsListBySensor(sensorId),
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

      const addedReadingId = await ReadingDAO.updateReadingFieldByID(updateDoc);
      return {};
    } catch (e) {
      return e.message;
    }
  }

  static async listReadings(token, cropTitle) {
    try {
      const user = await UserService.getUserFromToken(token);

      const crop = await CropService.getCropByUserIdAndTitle(
        user._id,
        cropTitle
      );

      if (!crop) {
        return "No crop exists for the specified name";
      }

      const readings = await ReadingDAO.getReadingsListByCrop(crop._id);

      const filteredReadings = readings.map((crop) => {
        const filteredReading = PatternUtil.filterParametersFromObject(crop, [
          "_id",
          "sensor_id",
          "crop_id",
        ]);
        return filteredReading;
      });

      return { readings: filteredReadings };
    } catch (e) {
      return e.message;
    }
  }
}
