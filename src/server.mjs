import express from "express";
import cors from "cors";
import userRoutes from "./routes/user_routes.mjs";
import cropRoutes from "./routes/crop_routes.mjs";
import notificationRoutes from "./routes/notification_routes.mjs";

const app = express();

app.use(cors());
app.use(express.json());

const baseUrl = "/api/v1";

app.use(baseUrl, userRoutes);
app.use(baseUrl, cropRoutes);
app.use(baseUrl, notificationRoutes);

// app.use("*", (req, res) => res.status(404).json({ Error: "Not Found" }));

export default app;
