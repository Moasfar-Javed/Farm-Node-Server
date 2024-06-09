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

const app = express();

app.use(cors());
app.use(express.json());

const server = createServer(app); // Create the HTTP server

let clients = {};

const baseUrl = "/api/v1/farm";

app.use(baseUrl, userRoutes);
app.use(baseUrl, cropRoutes);
app.use(baseUrl, notificationRoutes);
app.use(baseUrl, hardwareRoutes);
app.use(baseUrl, readingRoutes);
app.use(baseUrl, predictorRoutes);
app.use(baseUrl, irrigationRoutes);

app.post(baseUrl + "/arduino", (req, res) => {
  const { arduino_id, payload } = req.body;
  const client = clients[arduino_id];
  if (client && client.readyState === 1) {
    // WebSocket.OPEN is 1
    client.send(JSON.stringify({ payload }));
    res.status(200).send({ message: "Payload sent successfully" });
  } else {
    res.status(404).send({ message: "Arduino not found or not connected" });
  }
});

export { app, server, clients };
