import databaseConfig from "../config/database_config.mjs";

let irrigationcon;

export default class IrrigationDAO {
  static async injectDB(conn) {
    if (irrigationcon) {
      return;
    }
    try {
      irrigationcon = conn
        .db(databaseConfig.database.dbName)
        .collection(databaseConfig.collections.irrigationsDatabase);
    } catch (e) {
      console.error(`Unable to establish a collection handle: ${e}`);
    }
  }

  static async addReleaseToDB(reading) {
    try {
      const insertionResult = await irrigationcon.insertOne(reading);
      if (insertionResult && insertionResult.insertedId) {
        return insertionResult.insertedId;
      } else {
        return null;
      }
    } catch (e) {
      console.error(`Unable to add release: ${e}`);
      return null;
    }
  }

  static async getIrrigationByIDFromDB(id) {
    try {
      const irrigation = await irrigationcon.findOne({
        _id: id,
        deleted_on: null,
      });
      return irrigation;
    } catch (e) {
      console.error(`Unable to get crops: ${e}`);
      return null;
    }
  }

  static async updateIrrigationFieldByID(sensorId, fieldsToUpdate) {
    try {
      const irrigation = await irrigationcon.updateMany(
        {
          sensor_id: sensorId,
          deleted_on: null,
        },
        { $set: fieldsToUpdate }
      );

      return irrigation;
    } catch (e) {
      console.error(`Unable to update reading field: ${e}`);
      return null;
    }
  }

  static async toggleWaterOff(sensorId, fieldsToUpdate) {
    try {
      const irrigation = await irrigationcon.updateOne(
        {
          sensor_id: sensorId,
          deleted_on: null,
          water_on: true,
        },
        { $set: fieldsToUpdate }
      );

      return irrigation;
    } catch (e) {
      console.error(`Unable to update irrigation field: ${e}`);
      return null;
    }
  }

  static async getIrrigationListByCrop(cropId) {
    try {
      const irrigations = await irrigationcon
        .find({ crop_id: cropId, deleted_on: null })
        .sort({ created_on: -1 })
        .toArray();
      return irrigations;
    } catch (e) {
      console.error(`Unable to get crops: ${e}`);
      return null;
    }
  }

  static async getIrrigationListBySensor(sensorId) {
    try {
      const irrigations = await irrigationcon
        .find({ sensor_id: sensorId, deleted_on: null })
        .toArray();
      return irrigations;
    } catch (e) {
      console.error(`Unable to get crops: ${e}`);
      return null;
    }
  }
}
