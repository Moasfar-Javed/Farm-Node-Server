import CropDAO from "../data/crop_dao.mjs";
import PatternUtil from "../utility/pattern_util.mjs";
import TokenUtil from "../utility/token_util.mjs";
import HardwareService from "./hardware_service.mjs";
import WeatherService from "./weather_service.mjs";

export default class CropService {
  static async connectDatabase(client) {
    try {
      await CropDAO.injectDB(client);
    } catch (e) {
      console.error(`Unable to establish a collection handle: ${e}`);
    }
  }

  static async addCrop(
    user_id,
    title,
    preferred_release_duration,
    preferred_release_time,
    automatic_irrigation,
    maintain_logs
  ) {
    try {
      const existingCrop = await this.getCropByUserIdAndTitle(user_id, title);

      if (existingCrop) {
        return "A crop or zone with this name already exists, please choose another name";
      }
      const createdOn = new Date();
      const deletedOn = null;

      const cropDocument = {
        user_id: user_id,
        title: title,
        preferred_release_duration: preferred_release_duration,
        preferred_release_time: preferred_release_time,
        automatic_irrigation: automatic_irrigation,
        maintain_logs: maintain_logs,
        hardware_paired: false,
        crop_health_status: null,
        next_irrigation: null,
        last_irrigation: null,
        release_duration: null,
        optimal_irrigation_time: null,
        created_on: createdOn,
        deleted_on: deletedOn,
      };

      const addedCropId = await CropDAO.addCropToDB(cropDocument);
      const crop = await CropDAO.getCropByIDFromDB(addedCropId);

      let filteredCrop = PatternUtil.filterParametersFromObject(crop, [
        "_id",
        "user_id",
      ]);

      const sensor = await HardwareService.getSensorByCropId(crop._id);
      let filteredSensor = null;
      if (sensor) {
        filteredSensor = PatternUtil.filterParametersFromObject(sensor, [
          "_id",
          "user_id",
          "crop_id",
        ]);
      }

      filteredCrop.hardware = filteredSensor;

      return { crop: filteredCrop };
    } catch (e) {
      return e.message;
    }
  }

  static async listCropsWithWeather(user_id) {
    try {
      const [crops, weather] = await Promise.all([
        CropDAO.getCropsListFromDB(user_id),
        WeatherService.getWeather(),
      ]);

      const cropsWithSensor = await Promise.all(
        crops.map(async (crop) => {
          const sensor = await HardwareService.getSensorByCropId(crop._id);
          let filteredSensor = null;
          if (sensor) {
            filteredSensor = PatternUtil.filterParametersFromObject(sensor, [
              "_id",
              "user_id",
              "crop_id",
            ]);
          }

          const filteredCrop = PatternUtil.filterParametersFromObject(crop, [
            "_id",
            "user_id",
          ]);
          return { ...filteredCrop, hardware: filteredSensor };
        })
      );

      return { crops: cropsWithSensor, weather };
    } catch (e) {
      return e.message;
    }
  }

  static async listCrops(user_id) {
    try {
      const crops = await CropDAO.getCropsListFromDB(user_id);

      const filteredCrops = crops.map((crop) =>
        PatternUtil.filterParametersFromObject(crop, ["_id", "user_id"])
      );

      return filteredCrops;
    } catch (e) {
      return e.message;
    }
  }

  static async getCropByUserIdAndTitle(user_id, title) {
    try {
      const crop = await CropDAO.getCropByUserIDAndTitleFromDB(user_id, title);
      return crop;
    } catch (e) {
      return e.message;
    }
  }

  static async getCropById(id) {
    try {
      const crop = await CropDAO.getCropByIDFromDB(id);
      return crop;
    } catch (e) {
      return e.message;
    }
  }

  static async deleteCropByUserIdAndTitle(token, title) {
    try {
      const user = await TokenUtil.getDataFromToken(token);
      const existingCrop = await this.getCropByUserIdAndTitle(user._id, title);

      if (!existingCrop) {
        return "You do not have a crop with the specified name";
      }

      const deletedOn = new Date();
      const crop = await CropDAO.updateCropFieldByID(user._id, title, {
        deleted_on: deletedOn,
      });
      return {};
    } catch (e) {
      return e.message;
    }
  }

  static async updateCropByUserIdAndTitle(token, title, updatedFields) {
    try {
      const user = await TokenUtil.getDataFromToken(token);
      const existingCrop = await this.getCropByUserIdAndTitle(user._id, title);

      if (!existingCrop) {
        return "You do not have a crop with the specified name";
      }

      const updateCropResponse = await CropDAO.updateCropFieldByID(
        user._id,
        title,
        updatedFields
      );

      const updatedCrop = await CropDAO.getCropByIDFromDB(
        updateCropResponse._id
      );

      const filteredCrop = PatternUtil.filterParametersFromObject(updatedCrop, [
        "_id",
        "user_id",
      ]);

      const sensor = await HardwareService.getSensorByCropId(crop._id);
      let filteredSensor = null;
      if (sensor) {
        filteredSensor = PatternUtil.filterParametersFromObject(sensor, [
          "_id",
          "user_id",
          "crop_id",
        ]);
      }

      filteredCrop.hardware = filteredSensor;

      return { crop: filteredCrop };
    } catch (e) {
      return e.message;
    }
  }

  static async updateCropById(id, updatedFields) {
    try {
      const updateCropResponse = await CropDAO.updateCropFieldByDocID(
        id,
        updatedFields
      );

      const updatedCrop = await CropDAO.getCropByIDFromDB(
        updateCropResponse._id
      );

      const filteredCrop = PatternUtil.filterParametersFromObject(updatedCrop, [
        "_id",
        "user_id",
      ]);

      return filteredCrop;
    } catch (e) {
      return e.message;
    }
  }
}
