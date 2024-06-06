import HardwareDAO from "../data/hardware_dao.mjs";
import PatternUtil from "../utility/pattern_util.mjs";
// import SchedulingUtility from "../utility/scheduling_utility.mjs";
import TokenUtil from "../utility/token_util.mjs";
import CropService from "./crop_service.mjs";
import IrrigationService from "./irrigation_service.mjs";
import ReadingService from "./reading_service.mjs";
import UserService from "./user_service.mjs";

export default class HardwareService {
  static async connectDatabase(client) {
    try {
      await HardwareDAO.injectDB(client);
    } catch (e) {
      console.error(`Unable to establish a collection handle: ${e}`);
    }
  }

  static async addSensor() {
    try {
      let sensorId;
      do {
        sensorId = PatternUtil.generateUniqueId(6);
      } while (await HardwareDAO.checkSensorIdExistsInDB(sensorId));

      const createdOn = new Date();
      const deletedOn = null;
      const sensorDocument = {
        user_id: null,
        crop_id: null,
        sensor_id: sensorId,
        created_on: createdOn,
        deleted_on: deletedOn,
      };

      const addedSensorId = await HardwareDAO.addSensorToDB(sensorDocument);

      const databaseSensor = await HardwareDAO.getSensorByDocIDFromDB(
        addedSensorId
      );

      const filteredSensor = PatternUtil.filterParametersFromObject(
        databaseSensor,
        ["_id", "user_id", "crop_id"]
      );

      return { hardware: filteredSensor };
    } catch (e) {
      return e.message;
    }
  }

  static async associateSensor(token, sensorId, cropTitle) {
    try {
      const user = await UserService.getUserFromToken(token);

      let [databaseSensor, crop] = await Promise.all([
        HardwareDAO.getSensorBySensorIDFromDB(sensorId),
        CropService.getCropByUserIdAndTitle(user._id, cropTitle),
      ]);

      if (!databaseSensor) {
        return "Please enter a valid sensor ID, no such sensor exists";
      } else if (!crop) {
        return "No crop exists by this name for this user";
      } else if (databaseSensor.crop_id) {
        return "This hardware is already paired with another crop/zone. Please unpair to proceed";
      }

      const sensorDocument = {
        user_id: user._id,
        crop_id: crop._id,
      };

      await HardwareDAO.updateSensorFieldByID(sensorId, sensorDocument);

      // SchedulingUtility.scheduleTask(crop._id.toString(), "11:00", () => {
      //   console.log("Task emitted");
      // });

      databaseSensor = await HardwareDAO.getSensorBySensorIDFromDB(sensorId);

      const filteredSensors = PatternUtil.filterParametersFromObject(
        databaseSensor,
        ["_id", "user_id", "crop_id"]
      );

      return { hardware: filteredSensors };
    } catch (e) {
      return e.message;
    }
  }

  static async getSensorByCropId(cropId) {
    try {
      const sensor = await HardwareDAO.getSensorByCropID(cropId);

      return sensor;
    } catch (e) {
      return e.message;
    }
  }

  static async getSensorBySensorId(sensorId) {
    try {
      const sensor = await HardwareDAO.getSensorBySensorIDFromDB(sensorId);

      return sensor;
    } catch (e) {
      return e.message;
    }
  }

  static async disassociateSensor(token, sensorId, cropTitle) {
    try {
      const user = await UserService.getUserFromToken(token);

      let [databaseSensor, crop] = await Promise.all([
        HardwareDAO.getSensorBySensorIDFromDB(sensorId),
        CropService.getCropByUserIdAndTitle(user._id, cropTitle),
      ]);

      if (!databaseSensor) {
        return "Please enter a valid sensor ID, no such sensor exists";
      } else if (!crop) {
        return "No crop exists by this name for this user";
      } else if (!databaseSensor.crop_id) {
        return "This hardware is already unpaired";
      } else if (databaseSensor.crop_id.toString() !== crop._id.toString()) {
        return "This hardware is not paired to this crop/zone, please select the appropriate one to unpair";
      }

      const sensorDocument = {
        user_id: null,
        crop_id: null,
      };

      await Promise.all([
        IrrigationService.deleteIrrigationsForSensor(sensorId),
        ReadingService.deleteReadingsForSensor(sensorId),
        HardwareDAO.updateSensorFieldByID(sensorId, sensorDocument),
      ]);

      databaseSensor = await HardwareDAO.getSensorBySensorIDFromDB(sensorId);

      const filteredSensors = PatternUtil.filterParametersFromObject(
        databaseSensor,
        ["_id", "user_id", "crop_id"]
      );

      return { hardware: filteredSensors };
    } catch (e) {
      return e.message;
    }
  }
}
