function joinRoom(room, nsSocket) {
  const currentRoomEle = document.querySelector(".curr-room-text");
  const messagesEle = document.querySelector("#messages");

  // update current room name
  currentRoomEle.textContent = room;

  nsSocket.emit("joinRoom", room, (responseCB) => {
    const totalClientJoined = responseCB.count;
    const { history } = responseCB.currentRoomData;

    // display all message
    messagesEle.innerHTML = "";
    displayAllMessage(history, messagesEle);
    console.log(history);
  });

  nsSocket.on("membersInRoom", (count) => {
    // display count of total count user in the room
    const totalCountEle = document.querySelector(".curr-room-num-users");
    totalCountEle.innerHTML =
      count +
      ` <span class="glyphicon glyphicon-user"></span
     ></span>`;
  });

  nsSocket.on("currentRoomMsg", (msgObj) => {
    messagesEle.innerHTML += createMessageEle(msgObj);
  });
}

function displayAllMessage(history, messagesEle) {
  history.forEach((msgObj) => {
    messagesEle.innerHTML += createMessageEle(msgObj);
  });
}
