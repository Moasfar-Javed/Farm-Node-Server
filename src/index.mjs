import { server, clients } from "./server.mjs";
import { MongoClient } from "mongodb";
import appConfig from "./config/app_config.mjs";
import databaseConfig from "./config/database_config.mjs";
import UserService from "./services/user_service.mjs";
import CropService from "./services/crop_service.mjs";
import FirebaseUtility from "./utility/fcm_utility.mjs";
import NotificationService from "./services/notification_service.mjs";
import HardwareService from "./services/hardware_service.mjs";
import ReadingService from "./services/reading_service.mjs";
import IrrigationService from "./services/irrigation_service.mjs";
import { WebSocketServer } from "ws";

const port = appConfig.server.port;
const wsPort = 8080; // Set the WebSocket server port here
const username = encodeURIComponent(databaseConfig.database.username);
const password = encodeURIComponent(databaseConfig.database.password);
const uri = `mongodb://${username}:${password}@${databaseConfig.database.host}:${databaseConfig.database.port}/${databaseConfig.database.dbName}`;

MongoClient.connect(uri, {
  maxPoolSize: 50,
  wtimeoutMS: 2500,
})
  .catch((err) => {
    console.error(err.stack);
    process.exit(1);
  })
  .then(async (client) => {
    await UserService.connectDatabase(client);
    await CropService.connectDatabase(client);
    await NotificationService.connectDatabase(client);
    await HardwareService.connectDatabase(client);
    await ReadingService.connectDatabase(client);
    await IrrigationService.connectDatabase(client);
    FirebaseUtility.initializeApp();

    server.listen(port, () => {
      console.log(`HTTP server running on port ${port}`);
    });

    const wss = new WebSocketServer({ port: wsPort });

    wss.on("connection", (ws, req) => {
      console.log("ws connected");
      console.log(req);
      ws.on("message", (message) => {
        const data = JSON.parse(message);
        console.log(data.arduino_id);
        clients[data.arduino_id] = ws;
      });
    });

    console.log(`WebSocket server running on port ${wsPort}`);
  });
