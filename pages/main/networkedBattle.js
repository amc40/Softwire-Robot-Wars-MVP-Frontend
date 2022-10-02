
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

gameStates = [{},{}];
GameRenderer = new Renderer(ctx);

function updateGameStateFromRemote(data) {
    /*
        robots[]
            name
            position[]
            turretAngle

    */
   let newGameState = { players: [], projectiles: [] };
    newGameState.players = data.robots;
    for (let player of newGameState.players) {
        player.rotation = player.angle || 0;
        player.turretRotation = player.turretAngle || 0;
        player.location = player.position;
        player.maxHealth = 100;
        player.health = player.hitPoints;
        player.height = 25;
        player.width = 35;
    }
    newGameState.players[0].color = Colours.RED;
    newGameState.players[1].color = Colours.BLUE;
    newGameState.projectiles = data.projectiles;
    newGameState.projectiles = newGameState.projectiles.map(projectile => ({
        ...projectile,
        location: projectile.position,
        rotation: Math.atan2(projectile.velocity.y,projectile.velocity.x)
    }));
    newGameState.timestamp = new Date().getTime();
    gameStates[0] = gameStates[1];
    gameStates[1] = newGameState;
}

function getGameState() {
    return gameStates[0];
}

function animate() {
    gameState = getGameState();
    if(gameStates[0] != {}){
        gameState = interpolateGameState(gameStates[0],gameStates[1]);
    } 
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
    ctx.fillRect(0, 0, 600, 600)
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