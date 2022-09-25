
const socket = io.connect("ws://localhost:3001");
socket.on('welcome', function (data) {
    console.log("welcome message received")
    // Respond with a message including this clients' id sent from the server

});

function startBattle() {
    socket.emit('startBattle');
    console.log("emit start battle");
    socket.on('gameState', function (data) {
        // console.log(data);
        updateGameStateFromRemote(data);

    });
    window.requestAnimationFrame(animate);
}

function doUpload() {
    userCode = editor.getValue().replace(/\n/g, '');;
    nameInput = document.getElementById("name").value;
    socket.emit('uploadRobot', { name: nameInput, colour: "RED", robotCode: userCode });
}

gameState = { players: [], projectiles: [] };
GameRenderer = new Renderer(ctx);

function updateGameStateFromRemote(data){
    /*
        robots[]
            name
            position[]
            turretAngle

    */
   gameState.players = data.robots;
   for(let player of gameState.players) {
    player.rotation = 0;
    player.location = {x: player.position[0]/100, y: player.position[1]/100}
   }
}

function animate() {
    drawGame(gameState);
    window.requestAnimationFrame(animate);
}

function drawGame(gameState) {
    console.log(gameState);
    ctx.fillStyle = Colours.GREY;
    ctx.fillRect(0, 0, 640, 480)
    let players = gameState.players || null;
    let projectiles = gameState.projectiles || null;
    for (let player of players) {
        GameRenderer.drawTankBody(player);
    }
    for (let projectile of projectiles) {
        GameRenderer.drawProjectile(projectile);
    }
    for (let player of players) {
        GameRenderer.drawTankTurret(player);
    }
}