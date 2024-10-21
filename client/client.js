window.addEventListener("load", async () => {
  var socket = io();
  document
    .querySelector(".message-form")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      socket.emit("chat message", document.querySelector("#m").value);
      document.querySelector("#m").value = "";
      return false;
    });
  document.querySelector("#input").addEventListener("keydown", function (e) {
    e.preventDefault();
    if (e.repeat) return;
    socket.volatile.emit("input", {
      type: "keydown",
      code: e.code,
      name: e.key,
    });
    return false;
  });
  document.querySelector("#input").addEventListener("keyup", function (e) {
    e.preventDefault();
    socket.volatile.emit("input", { type: "keyup", code: e.code, name: e.key });
    return false;
  });

  function pushMessage(message, css) {
    if (!css) css = {};
    const msgs = document.querySelector("#messages");
    let li = document.createElement("li");
    li.innerText = message;
    for (const key in css) {
      li.style.setProperty(key, css[key]);
    }
    msgs.appendChild(li);
    msgs.scrollTop = msgs.scrollHeight;
  }
  socket.on("connect", function () {
    pushMessage("you've connected.", { color: "green" });
  });
  socket.on("disconnect", function (reason) {
    pushMessage("📵 you've been disconnected: " + reason + ".", {
      color: "red",
    });
  });
  socket.on("user connected", function (username) {
    pushMessage(username + " connected.");
  });
  socket.on("user disconnected", function (username) {
    pushMessage(username + " disconnected.");
  });
  socket.on("chat message", function (chatMessage) {
    pushMessage(chatMessage.username + ": " + chatMessage.content);
  });
  socket.on("nickname change", function (nicknameChange) {
    pushMessage(
      "user '" +
        nicknameChange.oldName +
        "' changed nickname to '" +
        nicknameChange.newName +
        "'."
    );
  });
});
