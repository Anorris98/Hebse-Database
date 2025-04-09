import express, { json } from "express";
import cors from "cors";
import { createTunnel } from "tunnel-ssh";

const app = express();
app.use(json());
app.use(cors())

const tunnelOptions = {
  autoClose: true,
  reconnectOnError: true
};

let server: any = undefined;
let client: any = undefined;

app.post("/start-tunnel", async (request, result): Promise<any> => {
  if (server !== undefined) {
    return result.json({ status: "Tunnel already active" });
  }

  let forwardOptions = {
    localHost: 'http://localhost',
    localPort: 8000,
    dstHost: request.body.databaseHost,
    dstPort: 8000,
  };

  let sshOptions = {
    username: request.body.sshUser,
    password: request.body.sshKey,
    host: request.body.sshHost,
    port: request.body.sshPort
  };

  [server, client] = await createTunnel(tunnelOptions, {port: 8000}, sshOptions, forwardOptions);

  return result.json({ status: "Tunnel started" });
});

app.post("/stop-tunnel", async (_request, result): Promise<any> => {
  if (server === undefined) {
    return result.json({ status: "No active tunnel to stop" });
  }

  await server.close();
  await client.end();

  [server, client] = [undefined, undefined]

  return result.json({ status: "Tunnel stopped" });
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Tunnel server running on port ${PORT}`));
