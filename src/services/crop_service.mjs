import CropDAO from "../data/crop_dao.mjs";
import PatternUtil from "../utility/pattern_util.mjs";
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
        created_on: createdOn,
        deleted_on: deletedOn,
      };

      const addedCropId = await CropDAO.addCropToDB(cropDocument);
      const crop = await CropDAO.getCropByIDFromDB(addedCropId);

      const filteredCrop = PatternUtil.filterParametersFromObject(crop, [
        "_id",
        "user_id",
      ]);

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

      const filteredCrops = crops.map((crop) =>
        PatternUtil.filterParametersFromObject(crop, ["_id", "user_id"])
      );

      return { crops: filteredCrops, weather: weather };
    } catch (e) {
      return e.message;
    }
  }
}
