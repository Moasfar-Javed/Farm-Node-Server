import databaseConfig from "../config/database_config.mjs";

let sensorcon;

export default class HardwareDAO {
  static async injectDB(conn) {
    if (sensorcon) {
      return;
    }
    try {
      sensorcon = conn
        .db(databaseConfig.database.dbName)
        .collection(databaseConfig.collections.hardwaresDatabase);
    } catch (e) {
      console.error(`Unable to establish a collection handle: ${e}`);
    }
  }

  static async addSensorToDB(sensor) {
    try {
      const insertionResult = await sensorcon.insertOne(sensor);
      if (insertionResult && insertionResult.insertedId) {
        return insertionResult.insertedId;
      } else {
        return null;
      }
    } catch (e) {
      console.error(`Unable to add User: ${e}`);
      return null;
    }
  }

  static async getSensorByCropID(cropId) {
    try {
      const sensors = await sensorcon.findOne({
        crop_id: cropId,
        deleted_on: null,
      });
      return sensors;
    } catch (e) {
      console.error(`Unable to get crops: ${e}`);
      return null;
    }
  }

  static async getSensorBySensorIDFromDB(sensorId) {
    try {
      const sensors = await sensorcon.findOne({
        sensor_id: sensorId,
        deleted_on: null,
      });
      return sensors;
    } catch (e) {
      console.error(`Unable to get crops: ${e}`);
      return null;
    }
  }

  static async getSensorByDocIDFromDB(id) {
    try {
      const sensor = await sensorcon.findOne({ _id: id, deleted_on: null });
      return sensor;
    } catch (e) {
      console.error(`Unable to get user by ID: ${e}`);
      return null;
    }
  }

  static async getSensorBySensorAndUserIDFromDB(sensorId, userId) {
    try {
      const user = await sensorcon.findOne({
        sensor_id: sensorId,
        user_id: userId,
        deleted_on: null,
      });
      return user;
    } catch (e) {
      console.error(`Unable to get user by sensor ID and userID: ${e}`);
      return null;
    }
  }

  static async updateSensorFieldByID(sensorId, fieldsToUpdate) {
    try {
      const crop = await sensorcon.findOneAndUpdate(
        {
          sensor_id: sensorId,
          deleted_on: null,
        },
        { $set: fieldsToUpdate },
        { new: true }
      );

      return crop;
    } catch (e) {
      console.error(`Unable to update crop field: ${e}`);
      return null;
    }
  }

  static async checkSensorIdExistsInDB(sensorId) {
    try {
      const sensor = await sensorcon.findOne({ sensor_id: sensorId });

      return sensor !== null;
    } catch (error) {
      console.error("Error checking sensor ID in database:", error);
      throw error;
    }
  }
}
