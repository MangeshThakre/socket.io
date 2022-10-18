// display rooms of perticular namespace "/ "
function joinNs(ed) {
  if (nsSocket) {
    nsSocket.close();
    document
      .querySelector("#user-input")
      .removeEventListener("submit", submitEventCB);
  }
  nsSocket = io(ed);

  nsSocket.on("roomData", (response) => {
    const roomListEle = document.querySelector(".room-list");
    const roomsArr = response;
    roomListEle.innerHTML = "";
    roomsArr.forEach((room, i) => {
      roomListEle.innerHTML += `<li><span class="glyphicon glyphicon-globe" ></span>${room.roomTitle}</li>`;
    });

    //    add event listnor on each room <li>
    for (let li of roomListEle.childNodes) {
      li.addEventListener("click", (e) => {
        const room = e.target.textContent;
        joinRoom(room, nsSocket);
      });
    }

    // join default room
    joinRoom(roomsArr[0].roomTitle, nsSocket);
  });

  const form = document.querySelector("#user-input");
  form.addEventListener("submit", submitEventCB);
}

function submitEventCB(event) {
  event.preventDefault();
  const message = event.target[0].value;
  nsSocket.emit("newMessageToServer", message);
  event.target[0].value = "";
}

function createMessageEle(msgObj) {
  return `<li>
  <div class="user-image">
<img src=${msgObj.avatar} />
</div>
<div class="user-message">
<div class="user-name-time">${msgObj.userName}<span>${msgObj.date}</span></div>
<div class="message-text">
  ${msgObj.msg}
</div>
</div>
  </li>`;
}
