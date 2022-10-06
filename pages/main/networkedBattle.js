
const socket = io.connect("ws://localhost:3001");
socket.on('welcome', function (data) {
    console.log("welcome message received")
    // Respond with a message including this clients' id sent from the server

});

socket.on('battleInfo', function (data) {
    generateHealthBars(data);
});

function startBattle() {
    socket.emit('startBattle');
    console.log("emit start battle");
    socket.on('gameState', function (data) {
        updateGameStateFromRemote(data);
        updatePlayerHealthBars();
        updateTickRate(data);
    });
    requestAnimationFrame(animate);
}

function doUpload() {
    userCode = editor.getValue().replace(/\n/g, '');;
    nameInput = document.getElementById("name").value;
    socket.emit('uploadRobot', { name: nameInput, color: "RED", robotCode: userCode });
}

let gameStatesContainer = [{ players: [], projectiles: [] },{ players: [], projectiles: [] }];
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
        player.angle = player.angle || 0;
        player.turretAngle = player.turretAngle || 0;
        player.position = player.position;
        player.maxHealth = 100;
        player.health = player.hitPoints;
        player.height = 25;
        player.width = 35;
        player.color = Colours[player.color.toUpperCase()];
    }

    newGameState.projectiles = data.projectiles;
    newGameState.projectiles = newGameState.projectiles.map(projectile => ({
        ...projectile,
        position: projectile.position,
        angle: Math.atan2(projectile.velocity.y,projectile.velocity.x)
    }));
    newGameState.timestamp = new Date().getTime();
    gameStatesContainer[0] = gameStatesContainer[1];
    gameStatesContainer[1] = newGameState;
}

function getGameState() {
    return gameStatesContainer[0];
}

function animate() {
    gameState = getGameState();
    if(gameStatesContainer[0].players.length > 0){
        gameState = interpolateGameState(gameStatesContainer[0],gameStatesContainer[1]);
    } 
    drawGame(gameState);
    updatePlayerHealthBars();
    requestAnimationFrame(animate);
}

let TICK_RATE = 200;

function getTickRate() {
    return TICK_RATE;
}

function updateTickRate(data) {
    TICK_RATE = data.tickRate;
}

function updatePlayerHealthBars() {
    for(let i = 0; i < gameState.players.length; i++) {
        document.getElementById('player'+(i+1)+'-health').style.width = (Math.max(0,(gameState.players[i].health / gameState.players[i].maxHealth))*100)+"%";
    }
}

function drawGame(gameState) {
    ctx.fillStyle = Colours.GREY;
    ctx.fillRect(0, 0, 600, 600);
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

function generateHealthBars(data) {
    let robots = data.participatingRobots;
    for(let [index,robot] of robots.entries()) {
        element = document.getElementById("healthBarsList");
        element.innerHTML += `
        <li>
          Player ${index+1} (<span id="player${index+1}-name"></span>)<br />
          <div class="health-background">
            <div id="player${index+1}-health" class="health-foreground">&nbsp;</div>
          </div>
        </li>
        <br />
        `;
        document.getElementById('player'+(index+1)+'-health').style.backgroundColor = robot.color;
        document.getElementById('player'+(index+1)+'-name').innerText = robot.name;
    }
}