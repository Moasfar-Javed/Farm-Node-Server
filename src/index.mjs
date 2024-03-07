import app from "./server.mjs";
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

// Uncomment to enable https

// import fs from "fs";
// import https from "https";

// const key = fs.readFileSync("private.key");
// const cert = fs.readFileSync("certificate.crt");
// const ca = fs.readFileSync("ca_bundle.crt");

// const cred = {
//   key,
//   cert,
//   ca,
// };

const port = appConfig.server.port;
//const httpPort = appConfig.server.httpsPort;
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
    // const httpsServer = https.createServer(cred, app);
    // httpsServer.listen(port, () => {
    //   console.log(`https server listening`);
    // });
    app.listen(port, () => {
      console.log(`http server running => ${port}`);
    });
  });