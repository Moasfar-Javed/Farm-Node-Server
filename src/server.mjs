import express from "express";
import cors from "cors";
import userRoutes from "./routes/user_routes.mjs";
import cropRoutes from "./routes/crop_routes.mjs";
import notificationRoutes from "./routes/notification_routes.mjs";
import hardwareRoutes from "./routes/hardware_routes.mjs";
import readingRoutes from "./routes/reading_route.mjs";
import predictorRoutes from "./routes/predictor_routes.mjs";
import irrigationRoutes from "./routes/irrigation_routes.mjs";

const app = express();

app.use(cors());
app.use(express.json());

const baseUrl = "/api/v1/farm";

app.use(baseUrl, userRoutes);
app.use(baseUrl, cropRoutes);
app.use(baseUrl, notificationRoutes);
app.use(baseUrl, hardwareRoutes);
app.use(baseUrl, readingRoutes);
app.use(baseUrl, predictorRoutes);
app.use(baseUrl, irrigationRoutes);

app.use("*", (req, res) =>
  res.status(404).json({
    success: false,
    data: {
      status: 404,
      error: "Not Found",
    },
    message:
      "The request made can not reach the server because either the URI is incorrect or the resource have been moved to another place. Please contact the system administrator for more information",
  })
);

export default app;
