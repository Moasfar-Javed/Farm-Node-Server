import { config } from "dotenv";

//mount the .env file
config();

const databaseConfig = {
  // Database configuration
  database: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dbName: process.env.DB_NAME,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
  },

  collections: {
    usersDatabase: process.env.USER_DB,
    cropsDatabase: process.env.CROP_DB,
    notificationsDatabase: process.env.NOTIFICATION_DB,
    hardwaresDatabase: process.env.SENSOR_DB,
    readingsDatabase: process.env.READING_DB,
    irrigationsDatabase: process.env.IRRIGATION_DB,
  },
};

export default databaseConfig;