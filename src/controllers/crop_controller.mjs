import CropService from "../services/crop_service.mjs";
import TokenUtil from "../utility/token_util.mjs";

export default class CropController {
  static async apiCreateCrop(req, res, next) {
    try {
      const {
        title,
        preferred_release_duration,
        preferred_release_time,
        automatic_irrigation,
        maintain_logs,
      } = req.body;

      const token = req.headers["authorization"];

      const user = await TokenUtil.getDataFromToken(token);

      const serviceResponse = await CropService.addCrop(
        user._id,
        title,
        preferred_release_duration,
        preferred_release_time,
        automatic_irrigation,
        maintain_logs
      );
      if (typeof serviceResponse === "string") {
        res
          .status(200)
          .json({ success: false, data: {}, message: serviceResponse });
      } else {
        res.status(200).json({
          success: true,
          data: serviceResponse,
          message: "",
        });
      }
    } catch (e) {
      res.status(500).json({ success: false, data: {}, message: e.message });
    }
  }

  static async apiListCrops(req, res, next) {
    try {
      const token = req.headers["authorization"];

      const user = await TokenUtil.getDataFromToken(token);

      const serviceResponse = await CropService.listCropsWithWeather(user._id);
      if (typeof serviceResponse === "string") {
        res
          .status(200)
          .json({ success: false, data: {}, message: serviceResponse });
      } else {
        res.status(200).json({
          success: true,
          data: serviceResponse,
          message: "",
        });
      }
    } catch (e) {
      res.status(500).json({ success: false, data: {}, message: e.message });
    }
  }

  static async apiDeleteCrop(req, res, next) {
    try {
      let { name } = req.query;
      name = decodeURIComponent(name);
      const token = req.headers["authorization"];

      const serviceResponse = await CropService.deleteCropByUserIdAndTitle(
        token,
        name
      );
      if (typeof serviceResponse === "string") {
        res
          .status(200)
          .json({ success: false, data: {}, message: serviceResponse });
      } else {
        res.status(200).json({
          success: true,
          data: serviceResponse,
          message: "Crop or zone has been deleted successfully",
        });
      }
    } catch (e) {
      res.status(500).json({ success: false, data: {}, message: e.message });
    }
  }

  static async apiUpdateCrop(req, res, next) {
    try {
      let { name } = req.query;
      name = decodeURIComponent(name);
      const {
        title,
        preferred_release_duration,
        preferred_release_time,
        automatic_irrigation,
        maintain_logs,
        ...rest
      } = req.body;

      const updatedFields = Object.fromEntries(
        Object.entries({
          title,
          preferred_release_duration,
          preferred_release_time,
          automatic_irrigation,
          maintain_logs,
          ...rest,
        }).filter(([_, value]) => value !== undefined && value !== null)
      );

      const token = req.headers["authorization"];

      const serviceResponse = await CropService.updateCropByUserIdAndTitle(
        token,
        name,
        updatedFields
      );
      if (typeof serviceResponse === "string") {
        res
          .status(200)
          .json({ success: false, data: {}, message: serviceResponse });
      } else {
        res.status(200).json({
          success: true,
          data: serviceResponse,
          message: "",
        });
      }
    } catch (e) {
      res.status(500).json({ success: false, data: {}, message: e.message });
    }
  }
}
