const socket = io("http://localhost:8081/");
let nsSocket = "";
socket.on("nameSpaceList", (nsData) => {
  // target namespaces element and push <li>
  const namespaces = document.querySelector(".namespaces");
  namespaces.innerHTML = "";

  nsData.forEach((ns, i) => {
    namespaces.innerHTML += `<li class="namespace"><img  ed="${ns.endpoint}" src="${ns.img}"> </li>`;
  });

  // add event listner on each  <li>
  for (let li of namespaces.childNodes) {
    li.addEventListener("click", (e) => {
      const ed = e.target.getAttribute("ed");
      joinNs(ed);
    });
  }

  joinNs("/wiki");
});
