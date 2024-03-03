import databaseConfig from "../config/database_config.mjs";

let usercon;

export default class UserDAO {
  static async injectDB(conn) {
    if (usercon) {
      return;
    }
    try {
      usercon = conn
        .db(databaseConfig.database.dbName)
        .collection(databaseConfig.collections.usersDatabase);
    } catch (e) {
      console.error(`Unable to establish a collection handle: ${e}`);
    }
  }

  static async addUserToDB(user) {
    try {
      const insertionResult = await usercon.insertOne(user);
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

  static async updateUserFieldByID(id, fieldName, newValue) {
    try {
      const user = await usercon.findOneAndUpdate(
        { _id: id },
        { $set: { [fieldName]: newValue } },
        { new: true }
      );
      return user;
    } catch (e) {
      console.error(`Unable to update user field: ${e}`);
      return null;
    }
  }

  static async getUserByIDFromDB(id) {
    try {
      const user = await usercon.findOne({ _id: id });
      return user;
    } catch (e) {
      console.error(`Unable to get user by ID: ${e}`);
      return null;
    }
  }

  static async getUserByFireIDFromDB(id) {
    try {
      const user = await usercon.findOne({ fire_uid: id });
      return user;
    } catch (e) {
      console.error(`Unable to get user by ID: ${e}`);
      return null;
    }
  }

  static async getUserByAuthTokenFromDB(token) {
    try {
      const user = await usercon.findOne({ auth_token: token });
      return user;
    } catch (e) {
      console.error(`Unable to get user by token: ${e}`);
      return null;
    }
  }
}
