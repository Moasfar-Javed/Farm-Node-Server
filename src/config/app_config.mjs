import { config } from "dotenv";

//mount the .env file
config();

const appConfig = {
  // Server configuration
  server: {
    port: process.env.PORT || 3030,
    httpsPort: process.env.HTTPS_PORT || 8000,
  },

  // JWT configuration
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
  },
};

export default appConfig;