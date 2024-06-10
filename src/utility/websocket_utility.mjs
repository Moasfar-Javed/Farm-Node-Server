import { WebSocketServer } from "ws";

const clients = {};

const initializeWebSocketServer = (wsPort) => {
  const wss = new WebSocketServer({ port: wsPort });

  wss.on("connection", (ws, req) => {
    console.log("WebSocket connected");
    ws.on("message", (message) => {
      const data = JSON.parse(message);
      console.log(data.arduino_id);
      clients[data.arduino_id] = ws;
    });
  });

  console.log(`WebSocket server running on port ${wsPort}`);
};

const sendMessageToClient = (arduino_id, payload) => {
  const client = clients[arduino_id];
  if (client && client.readyState === 1) {
    client.send(JSON.stringify({ payload }));
    return { status: 200, message: "Payload sent successfully" };
  } else {
    return { status: 404, message: "Arduino not found or not connected" };
  }
};

export { initializeWebSocketServer, sendMessageToClient, clients };
