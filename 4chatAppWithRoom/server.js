const express = require("express");
const path = require("path");
const app = express();
const socketIO = require("socket.io");
app.use("/", express.static(path.join(__dirname, "/public")));

const server = app.listen(8081, () => console.log("http://localhost:8081"));
const io = socketIO(server);

// for / namespace
io.of("/").on("connection", (socket) => {
  console.log("connected");
  io.emit("send", "connected to server");
  socket.join("level1");
  socket.to("level1").emit("level1", "connected to levelone");
  //   io.of("/").to("level1").emit("level1", "connected to levelone");
});

// for /admin namespace
io.of("/admin").on("connection", (sockte) => {
  console.log("connected to admin");
});
