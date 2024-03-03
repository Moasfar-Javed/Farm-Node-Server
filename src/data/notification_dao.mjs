import databaseConfig from "../config/database_config.mjs";

let notifcon;

export default class NotificationDAO {
  static async injectDB(conn) {
    if (notifcon) {
      return;
    }
    try {
      notifcon = conn
        .db(databaseConfig.database.dbName)
        .collection(databaseConfig.collections.notificationsDatabase);
    } catch (e) {
      console.error(`Unable to establish a collection handle: ${e}`);
    }
  }

  static async addNotificationToDB(notif) {
    try {
      const insertionResult = await notifcon.insertOne(notif);
      if (insertionResult && insertionResult.insertedId) {
        return insertionResult.insertedId;
      } else {
        return null;
      }
    } catch (e) {
      console.error(`Unable to add notif: ${e}`);
      return null;
    }
  }

  static async getNotificationByIDFromDB(id) {
    try {
      const notif = await notifcon.findOne({ _id: id });
      return notif;
    } catch (e) {
      console.error(`Unable to get user by ID: ${e}`);
      return null;
    }
  }

  static async getNotificationsListByUser(user_id) {
    try {
      const notifs = await notifcon.find({ user_id: user_id }).toArray();
      return notifs;
    } catch (e) {
      console.error(`Unable to get crops: ${e}`);
      return null;
    }
  }
}
