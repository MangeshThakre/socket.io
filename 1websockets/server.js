const http = require("http");
const webSocket = require("ws");
const server = http.createServer(http);

const webSocketServer = new webSocket.Server({ server });

webSocketServer.on("headers", (haders) => {
  console.log(haders);
});

webSocketServer.on("connection", () => {
  console.log("connected");
});

server.listen(8081, () => {
  console.log("listning on http://localhost:8081");
});
