import databaseConfig from "../config/database_config.mjs";

let cropcon;

export default class CropDAO {
  static async injectDB(conn) {
    if (cropcon) {
      return;
    }
    try {
      cropcon = conn
        .db(databaseConfig.database.dbName)
        .collection(databaseConfig.collections.cropsDatabase);
    } catch (e) {
      console.error(`Unable to establish a collection handle: ${e}`);
    }
  }

  static async addCropToDB(user) {
    try {
      const insertionResult = await cropcon.insertOne(user);
      if (insertionResult && insertionResult.insertedId) {
        return insertionResult.insertedId;
      } else {
        return null;
      }
    } catch (e) {
      console.error(`Unable to add Crop: ${e}`);
      return null;
    }
  }

  static async getCropByIDFromDB(id) {
    try {
      const user = await cropcon.findOne({ _id: id });
      return user;
    } catch (e) {
      console.error(`Unable to get user by ID: ${e}`);
      return null;
    }
  }

  static async getCropsListFromDB(userId) {
    try {
      const crops = await cropcon
        .find({ user_id: userId, deleted_on: null })
        .toArray();
      return crops;
    } catch (e) {
      console.error(`Unable to get crops: ${e}`);
      return null;
    }
  }

  static async getCropByUserIDAndTitleFromDB(userId, title) {
    try {
      const user = await cropcon.findOne({
        user_id: userId,
        title: title,
        deleted_on: null,
      });
      return user;
    } catch (e) {
      console.error(`Unable to get crop by ID: ${e}`);
      return null;
    }
  }

  static async updateCropFieldByID(userId, title, fieldsToUpdate) {
    try {
      const crop = await cropcon.findOneAndUpdate(
        { user_id: userId, title: title, deleted_on: null },
        { $set: fieldsToUpdate },
        { new: true }
      );

      return crop;
    } catch (e) {
      console.error(`Unable to update crop field: ${e}`);
      return null;
    }
  }
  static async updateCropFieldByDocID(id, fieldsToUpdate) {
    try {
      const crop = await cropcon.findOneAndUpdate(
        { _id: id, deleted_on: null },
        { $set: fieldsToUpdate },
        { new: true }
      );

      return crop;
    } catch (e) {
      console.error(`Unable to update crop field: ${e}`);
      return null;
    }
  }
}
