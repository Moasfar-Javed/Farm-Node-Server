import { WebSocketServer } from "ws";
import IrrigationService from "../services/irrigation_service.mjs";
import NotificationService from "../services/notification_service.mjs";

const clients = {};

const initializeWebSocketServer = (wsPort) => {
  const wss = new WebSocketServer({ port: wsPort });

  wss.on("connection", (ws, req) => {
    console.log("WebSocket connected");

    ws.on("message", async (message) => {
      try {
        const data = JSON.parse(message);
        console.log(data);

        clients[data.arduino_id] = ws;
        console.log(`Client with arduino_id ${data.arduino_id} connected.`);
      } catch (error) {
        console.log("Error parsing message:", error);
      }
    });
  });

  console.log("WebSocket server running");
};

const sendMessageToClient = (user, arduino_id, payload) => {
  const client = clients[arduino_id];
  if (client && client.readyState === 1) {
    client.send(JSON.stringify({ payload }));
    setTimeout(async () => {
      await IrrigationService.toggleWaterOff(arduino_id);
      console.log(user);
      if (user) {
        const notification = await NotificationService.sendNotification(
          user,
          "open_release_off",
          "",
          "Water Turned Off",
          `Water for is turned off, Irrigation lasted ${payload.duration} minutes`
        );
      }
      console.log(notification);
      console.log(
        `Client with arduino_id ${arduino_id} has water_on set to off.`
      );
    }, payload.duration * 60000);
    return true;
  } else {
    return false;
  }
};

export { initializeWebSocketServer, sendMessageToClient, clients };
