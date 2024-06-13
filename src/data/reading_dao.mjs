import databaseConfig from "../config/database_config.mjs";

let readingcon;

export default class ReadingDAO {
  static async injectDB(conn) {
    if (readingcon) {
      return;
    }
    try {
      readingcon = conn
        .db(databaseConfig.database.dbName)
        .collection(databaseConfig.collections.readingsDatabase);
    } catch (e) {
      console.error(`Unable to establish a collection handle: ${e}`);
    }
  }

  static async addReadingToDB(reading) {
    try {
      const insertionResult = await readingcon.insertOne(reading);
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

  static async getReadingByIDFromDB(id) {
    try {
      const reading = await readingcon.findOne({
        _id: id,
        deleted_on: null,
      });
      return reading;
    } catch (e) {
      console.error(`Unable to get crops: ${e}`);
      return null;
    }
  }

  static async updateReadingFieldByID(sensorId, fieldsToUpdate) {
    try {
      const reading = await readingcon.updateMany(
        {
          sensor_id: sensorId,
          deleted_on: null,
        },
        { $set: fieldsToUpdate }
      );

      return reading;
    } catch (e) {
      console.error(`Unable to update reading field: ${e}`);
      return null;
    }
  }

  static async getReadingsListByCrop(cropId) {
    try {
      const readings = await readingcon
        .find({ crop_id: cropId, deleted_on: null })
        .sort({ created_on: -1 })
        .toArray();
      return readings;
    } catch (e) {
      console.error(`Unable to get crops: ${e}`);
      return null;
    }
  }

  static async getReadingsListBySensor(sensorId) {
    try {
      const readings = await readingcon
        .find({ sensor_id: sensorId, deleted_on: null })
        .toArray();
      return readings;
    } catch (e) {
      console.error(`Unable to get crops: ${e}`);
      return null;
    }
  }
}
