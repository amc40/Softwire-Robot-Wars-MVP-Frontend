const socket = io.connect("ws://localhost:3001");
socket.on("welcome", function (data) {
  console.log("welcome message received");
  // Respond with a message including this clients' id sent from the server
});

function startBattle() {
  socket.emit("startBattle");
  console.log("emit start battle");
  socket.on("gameState", function (data) {
    console.log(data);
  });
}

function doUpload() {
  userCode = editor.getValue().replace(/\n/g, "");
  nameInput = document.getElementById("name").value;
  socket.emit("uploadRobot", {
    name: nameInput,
    colour: "RED",
    robotCode: userCode,
  });
}