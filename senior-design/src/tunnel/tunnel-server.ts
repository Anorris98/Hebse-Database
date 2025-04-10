import express, { json } from "express";
import cors from "cors";
import { createTunnel } from "tunnel-ssh";
import { Server } from "node:net";
import { Client } from "ssh2";

const app = express();
app.use(json());
app.use(cors())

const tunnelOptions = {
  autoClose: false,
  reconnectOnError: true
};

let server: Server;
let client: Client;

/* eslint-disable @typescript-eslint/no-explicit-any */
app.post("/start-tunnel", async (request, result): Promise<any> => {
  if (server && server.listening) {
    return result.json({ status: "Tunnel already active" });
  }

  const forwardOptions = {
    localHost: 'http://localhost',
    localPort: 8000,
    dstHost: request.body.databaseHost,
    dstPort: 8000,
  };

  const sshOptions = {
    username: request.body.sshUser,
    password: request.body.sshKey,
    host: request.body.sshHost,
    port: request.body.sshPort
  };

  [server, client] = await createTunnel(tunnelOptions, {port: 8000}, sshOptions, forwardOptions);

  client.on("error", (error) => {
    console.log("SSH Client Error:", error.message);
  });

  server.on("error", (error) => {
    console.error("Server Error:", error.message);
  });

  server.on("close", () => {
    console.log("Server connection closed.");
  });
  
  return result.json({ status: "Tunnel started" });
});

app.post("/stop-tunnel", async (_request, result): Promise<any> => {
  if (!server || !(server.listening)) {
    return result.json({ status: "No active tunnel to stop" });
  }

  server.close();
  client.destroy();

  return result.json({ status: "Tunnel stopped" });
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Tunnel server running on port ${PORT}`));
