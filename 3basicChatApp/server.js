const express = require("express");
const app = express();
const socketIO = require("socket.io");
const path = require("path");

// server static file index.html  inside public folder
app.use(express.static(path.join(__dirname, "/public")));

// http listner
const server = app.listen(8081, () => {
  console.log("listnint on http://localhost:8081");
});

const io = socketIO(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("connected");

  socket.on("msg", (msg) => {
    io.emit("message", msg);
    console.log(msg);
  });
});
