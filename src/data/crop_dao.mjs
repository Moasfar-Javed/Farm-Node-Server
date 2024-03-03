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

  static async getCropsListFromDB(user_id) {
    try {
      const crops = await cropcon.find({ user_id: user_id }).toArray();
      return crops;
    } catch (e) {
      console.error(`Unable to get crops: ${e}`);
      return null;
    }
  }
}
