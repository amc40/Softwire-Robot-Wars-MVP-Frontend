
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

let gameStatesContainer = [{ players: [], projectiles: [], gameEvents: [] },{ players: [], projectiles: [], gameEvents: [] }];
GameRenderer = new Renderer(ctx);

function updateGameStateFromRemote(data) {
    /*
        robots[]
            name
            position[]
            turretAngle

    */
   let newGameState = { players: [], projectiles: [], gameEvents: [] };
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
    newGameState.gameEvents = data.gameEvents;
    newGameState.projectiles = data.projectiles;
    newGameState.projectiles = newGameState.projectiles.map(projectile => ({
        ...projectile,
        position: projectile.position,
        angle: Math.atan2(projectile.velocity.y,projectile.velocity.x)
    }));
    newGameState.timestamp = new Date().getTime();
    gameStatesContainer[0] = gameStatesContainer[1];
    gameStatesContainer[1] = newGameState;

    for(let gameEvent of gameStatesContainer[0].gameEvents) {
        console.log(gameEvent);
        if(gameEvent.type == "player_hit_event") {
            console.log("player hit");
            for(i=0;i<50;i++){
                let particle = new Spark({x: GameRenderer.gameXToCanvasX(gameEvent.position.x), y: GameRenderer.gameYToCanvasY(gameEvent.position.y)});
                particle.setRandomVelocity();
                particle.gravity.y = 0.5;
                particles.push(particle);
            }
        }
    }
    
}

function getGameState() {
    return gameStatesContainer[0];
}

function animate() {
    gameState = getGameState();
    if(gameStatesContainer[0].players.length > 0){
        gameState = interpolateGameState(gameStatesContainer[0],gameStatesContainer[1]);
        for(let player of gameState.players) {
            if(player.health/player.maxHealth < 0.5) {
                if(Math.random() < 0.05 + 0.4*(1-(player.health/player.maxHealth)/0.5)){
                    let particle = new Smoke({x: GameRenderer.gameXToCanvasX(player.position.x), y: GameRenderer.gameYToCanvasY(player.position.y)});
                    particle.setRandomVelocity();
                    particles.push(particle);
                }
            } 
        }  
    } 
    drawGame(gameState);
    updatePlayerHealthBars();
    requestAnimationFrame(animate);
}

let TICK_RATE = 200;
let particles = [];

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
    for (let particle of particles) {
        GameRenderer.drawParticle(particle);
        particle.updatePosition();
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