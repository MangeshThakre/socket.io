const http = require("http");
const server = http.createServer(http);
const socketIO = require("socket.io");
const io = socketIO(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("connected");

  io.emit("hello", "jello");
});

server.listen(8081, () => {
  console.log("server listning on http://localhost:8081");
});
