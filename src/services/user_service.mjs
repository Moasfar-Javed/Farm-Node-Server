import UserDAO from "../data/user_dao.mjs";
import TokenUtil from "../utility/token_util.mjs";
import PatternUtil from "../utility/pattern_util.mjs";
import HardwareService from "./hardware_service.mjs";
import CropService from "./crop_service.mjs";

export default class UserService {
  static async connectDatabase(client) {
    try {
      await UserDAO.injectDB(client);
    } catch (e) {
      console.error(`Unable to establish a collection handle: ${e}`);
    }
  }

  static async getOrAddUser(fire_uid, phone_or_email, fcm_token) {
    try {
      let databaseUser = await UserDAO.getUserByFireIDFromDB(fire_uid);
      if (!databaseUser) {
        const createdOn = new Date();
        const deletedOn = null;
        const authToken = TokenUtil.createToken({
          fire_uid: fire_uid,
          phone_or_email: phone_or_email,
          last_signin_on: createdOn,
        });
        const userDocument = {
          fire_uid: fire_uid,
          phone_or_email: phone_or_email,
          role: "farmer",
          auth_token: authToken,
          fcm_token: fcm_token,
          created_on: createdOn,
          deleted_on: deletedOn,
          last_signin_on: createdOn,
        };

        const addedUserId = await UserDAO.addUserToDB(userDocument);

        databaseUser = await UserDAO.getUserByIDFromDB(addedUserId);
      } else {
        const signInOn = new Date();
        const authToken = TokenUtil.createToken({
          fire_uid: fire_uid,
          phone_or_email: phone_or_email,
          last_signin_on: signInOn,
        });

        databaseUser = await UserDAO.updateUserFieldByID(databaseUser._id, {
          fcm_token: fcm_token,
          auth_token: authToken,
          last_signin_on: signInOn,
        });
        databaseUser = await UserDAO.getUserByIDFromDB(databaseUser._id);
      }

      const filteredUsers = PatternUtil.filterParametersFromObject(
        databaseUser,
        ["_id", "fcm_token"]
      );

      return { user: filteredUsers };
    } catch (e) {
      return e.message;
    }
  }

  static async getUserDetails(token) {
    try {
      let databaseUser = await this.getUserFromToken(token);
      if (!databaseUser) {
        return "User with this token does not exists";
      }

      const filteredUsers = PatternUtil.filterParametersFromObject(
        databaseUser,
        ["_id", "fcm_token"]
      );

      return { user: filteredUsers };
    } catch (e) {
      return e.message;
    }
  }

  static async signOutUser(token) {
    try {
      let databaseUser = await UserDAO.getUserByAuthTokenFromDB(token);
      if (!databaseUser) {
        return "No such user found";
      }
      databaseUser = await UserDAO.updateUserFieldByID(databaseUser._id, {
        auth_token: null,
      });

      return {};
    } catch (e) {
      return e.message;
    }
  }

  static async getUserFromToken(authToken) {
    try {
      let databaseUser = await UserDAO.getUserByAuthTokenFromDB(authToken);
      return databaseUser;
    } catch (e) {
      return e.message;
    }
  }

  static async getUserByID(userId) {
    try {
      let databaseUser = await UserDAO.getUserByIDFromDB(userId);
      return databaseUser;
    } catch (e) {
      return e.message;
    }
  }
}
