const { Socket } = require("engine.io");
const e = require("express");
const express = require("express");
const app = express();
const path = require("path");
const socketIO = require("socket.io");

// servering the public on "/"
app.use("/", express.static(path.join(__dirname, "/public")));

// create server using express on 8081 port
const server = app.listen(8081, () =>
  console.log("listning on http://localhost:8081")
);

// run socket on server
const io = socketIO(server);
const namespaceData = require("./data/Npmespaces");

// connectote the sockte on default namespace ("/") or io.of("/").on()
io.on("connection", (socket) => {
  console.log("connected");
  //   send list of namespace to own socket
  const nsData = namespaceData.reduce((acc, e, i) => {
    acc[i] = { img: e.img, endpoint: e.endpoint };
    return acc;
  }, []);

  socket.emit("nameSpaceList", nsData);

  // room data send
  socket.on("endpoint", (ed, callback) => {
    const roomsArr = namespaceData.find((e) => e.endpoint === ed).rooms;
    callback(roomsArr);
  });
});

// socket base on namespaces
namespaceData.forEach((namespace) => {
  io.of(namespace.endpoint).on("connection", (socket) => {
    socket.emit("roomData", namespace.rooms);

    socket.on("joinRoom", (roomToJoin, callback) => {
      // leave the room
      const currentRoom = Array.from(socket.rooms.keys())[1];
      // console.log(currentRoom, socket.rooms);
      socket.leave(currentRoom);
      roomCount(namespace, roomToJoin);
      // join new room
      socket.join(roomToJoin);
      // member who joined the perticular room
      roomCount(namespace, roomToJoin);

      const currentRoomData = namespace.rooms.find(
        (room) => room.roomTitle === roomToJoin
      );
      const count = io.of(namespace.endpoint).sockets.size;
      callback({ count, currentRoomData });
    });

    //  new message to server
    socket.on("newMessageToServer", (message) => {
      const currentRoom = Array.from(socket.rooms.keys())[1];
      // socket.rooms return set object , get the key from object and converted to array
      const messageObj = {
        date: Date.now(),
        msg: message,
        userName: "mangesh",
        avatar: "https://via.placeholder.com/30",
      };

      // store the message data to perticular their respective room history
      const currentRoomData = namespace.rooms.find(
        (room) => room.roomTitle === currentRoom
      );
      currentRoomData.addMessage(messageObj);
      // console.log("currentRoomData", currentRoomData);

      // emit the newmessage to all persnet the perticular namespace-room  for eg namespace(/wiki) room (New Artical)
      io.of(namespace.endpoint)
        .to(currentRoom)
        .emit("currentRoomMsg", messageObj);
    });

    //  leave room
    // socket.on("leaveRoom", (endpoint) => {
    //   const currentRoom = Array.from(socket.rooms.keys())[1];
    //   console.log(currentRoom);
    // });
  });
});

function roomCount(namespace, roomToJoin) {
  const count = io.of(namespace.endpoint).sockets.size;
  io.of(namespace.endpoint).in(roomToJoin).emit("membersInRoom", count);
}
