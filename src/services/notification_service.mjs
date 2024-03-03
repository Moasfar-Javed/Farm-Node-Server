import NotificationDAO from "../data/notification_dao.mjs";
import FirebaseUtility from "../utility/fcm_utility.mjs";
import PatternUtil from "../utility/pattern_util.mjs";
import UserService from "./user_service.mjs";
import { ObjectId } from "mongodb";

export default class NotificationService {
  static async connectDatabase(client) {
    try {
      await NotificationDAO.injectDB(client);
    } catch (e) {
      console.error(`Unable to establish a collection handle: ${e}`);
    }
  }

  static async sendNotification(token, action, id, title, message) {
    try {
      const user = await UserService.getUserFromToken(token);

      const fcmResponse = await FirebaseUtility.sendNotification(
        user.fcm_token,
        id,
        action,
        title,
        message
      );

      const sentOn = new Date();

      const notifDocument = {
        user_id: new ObjectId(user._id),
        payload: {
          id: id,
          action: action,
          title: title,
          message: message,
        },
        sent_on: sentOn,
        fcm_response: fcmResponse,
      };

      const notificationId = await NotificationDAO.addNotificationToDB(
        notifDocument
      );

      const notification = await NotificationDAO.getNotificationByIDFromDB(
        notificationId
      );

      const filteredUsers = PatternUtil.filterParametersFromObject(
        notification,
        ["_id", "fcm_token"]
      );

      return { notification: filteredUsers };
    } catch (e) {
      return e.message;
    }
  }

  static async listNotifications(token) {
    try {
      const user = await UserService.getUserFromToken(token);

      const notifications = await NotificationDAO.getNotificationsListByUser(
        user._id
      );

      const filteredNotifications = notifications.map((crop) => {
        const filteredNotification = PatternUtil.filterParametersFromObject(
          crop,
          ["_id", "user_id", "fcm_response"]
        );
        return filteredNotification;
      });

      return { notifications: filteredNotifications };
    } catch (e) {
      return e.message;
    }
  }
}
