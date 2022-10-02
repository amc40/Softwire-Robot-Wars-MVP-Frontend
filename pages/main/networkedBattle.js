
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
        updatePlayerHealthBars();
        updatePlayerNames();

    });
    requestAnimationFrame(animate);
}

function doUpload() {
    userCode = editor.getValue().replace(/\n/g, '');;
    nameInput = document.getElementById("name").value;
    socket.emit('uploadRobot', { name: nameInput, color: "RED", robotCode: userCode });
}

gameState = { players: [], projectiles: [] };
GameRenderer = new Renderer(ctx);

function updateGameStateFromRemote(data) {
    /*
        robots[]
            name
            position[]
            turretAngle

    */
    gameState.players = data.robots;
    for (let player of gameState.players) {
        player.rotation = player.angle || 0;
        player.turretRotation = player.turretAngle || 0;
        player.location = { x: player.position[0], y: player.position[1] }
        player.maxHealth = 100;
        player.health = player.hitPoints;
        player.height = 25;
        player.width = 35;
    }
    gameState.players[0].color = Colours.RED;
    gameState.players[1].color = Colours.BLUE;
    gameState.projectiles = data.projectiles;
    gameState.projectiles = gameState.projectiles.map(projectile => ({
        ...projectile,
        location: { x: projectile.position[0], y: projectile.position[1] },
        rotation: Math.atan2(projectile.velocity[1],projectile.velocity[0])
    }));
}

function getGameState() {
    return gameState;
}

function animate() {
    gameState = getGameState();
    drawGame(gameState);
    updatePlayerHealthBars();
    requestAnimationFrame(animate);
}

function updatePlayerNames() {
    for(let i = 0; i < gameState.players.length; i++) {
        document.getElementById('player'+(i+1)+'-name').innerText = gameState.players[i].name;
        document.getElementById('player'+(i+1)+'-health').style.backgroundColor = gameState.players[i].color;
    }
}

function updatePlayerHealthBars() {
    for(let i = 0; i < gameState.players.length; i++) {
        document.getElementById('player'+(i+1)+'-health').style.width = (Math.max(0,(gameState.players[i].health / gameState.players[i].maxHealth))*100)+"%";
    }
}

function drawGame(gameState) {
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