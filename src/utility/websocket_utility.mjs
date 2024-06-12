import { WebSocketServer } from "ws";
import IrrigationService from "../services/irrigation_service.mjs";

const clients = {};

const initializeWebSocketServer = (wsPort) => {
  const wss = new WebSocketServer({ port: wsPort });

  wss.on("connection", (ws, req) => {
    console.log("WebSocket connected");
    // ws.on("message", (message) => {
    //   const data = JSON.parse(message);
    //   console.log(data.arduino_id);
    //   clients[data.arduino_id] = ws;
    // });
    ws.on("message", async (message) => {
      try {
        const data = JSON.parse(message);
        console.log(data.arduino_id);
        if (!clients[data.arduino_id]) {
          clients[data.arduino_id] = ws;
          console.log(`Client with arduino_id ${data.arduino_id} added.`);
        } else if (data.hasOwnProperty("water_on") && data.water_on === false) {
          await IrrigationService.toggleWaterOff(data.arduino_id);
          console.log(
            `Client with arduino_id ${data.arduino_id} has water_on set to off.`
          );
        }
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    });
  });

  console.log("WebSocket server running");
};

const sendMessageToClient = (arduino_id, payload) => {
  const client = clients[arduino_id];
  if (client && client.readyState === 1) {
    client.send(JSON.stringify({ payload }));
    return true;
  } else {
    return false;
  }
};

export { initializeWebSocketServer, sendMessageToClient, clients };
