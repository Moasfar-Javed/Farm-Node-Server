import express from "express";
import cors from "cors";
import userRoutes from "./routes/user_routes.mjs";
import cropRoutes from "./routes/crop_routes.mjs";
import notificationRoutes from "./routes/notification_routes.mjs";
import hardwareRoutes from "./routes/hardware_routes.mjs";
import readingRoutes from "./routes/reading_route.mjs";
import predictorRoutes from "./routes/predictor_routes.mjs";
import irrigationRoutes from "./routes/irrigation_routes.mjs";
import { createServer } from "http";
// import { sendMessageToClient } from "./utility/websocket_utility.mjs";

const app = express();

app.use(cors());
app.use(express.json());

const server = createServer(app); 

const baseUrl = "/api/v1/farm";

app.use(baseUrl, userRoutes);
app.use(baseUrl, cropRoutes);
app.use(baseUrl, notificationRoutes);
app.use(baseUrl, hardwareRoutes);
app.use(baseUrl, readingRoutes);
app.use(baseUrl, predictorRoutes);
app.use(baseUrl, irrigationRoutes);

// app.post(baseUrl + "/arduino", (req, res) => {
//   const { arduino_id, payload } = req.body;
//   const result = sendMessageToClient(arduino_id, payload);
//   res.status(result.status).send({ message: result.message });
// });

export { app, server };
