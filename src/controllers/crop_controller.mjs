import CropService from "../services/crop_service.mjs";
import TokenUtil from "../utility/token_util.mjs";

export default class CropController {
  static async apiCreateCrop(req, res, next) {
    try {
      const {
        title,
        type,
        preferred_release_time,
        automatic_irrigation,
        maintain_logs,
        latitude,
        longitude,
      } = req.body;

      const token = req.headers["authorization"];

      const user = await TokenUtil.getDataFromToken(token);

      const serviceResponse = await CropService.addCrop(
        user._id,
        title,
        type,
        preferred_release_time,
        automatic_irrigation,
        maintain_logs,
        latitude,
        longitude
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
      const { latitude, longitude } = req.query;

      const user = await TokenUtil.getDataFromToken(token);

      const serviceResponse = await CropService.listCropsWithWeather(
        user._id,
        latitude,
        longitude
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

  static async apiListCropTypes(req, res, next) {
    try {
      const serviceResponse = CropService.listCropTypes();
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
        type,
        preferred_release_time,
        automatic_irrigation,
        maintain_logs,
        ...rest
      } = req.body;

      const updatedFields = Object.fromEntries(
        Object.entries({
          title,
          type,
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

  static async apiCropDetail(req, res, next) {
    try {
      const token = req.headers["authorization"];
      let { name } = req.query;
      name = decodeURIComponent(name);
      const user = await TokenUtil.getDataFromToken(token);

      const serviceResponse = await CropService.getCropDetails(user._id, name);
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
