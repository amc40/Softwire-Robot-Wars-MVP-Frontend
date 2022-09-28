
function gameUpdateLoop() {
    for (let tank of players) {
        tank.rotation += 1.5;
        tank.turretAngle -= 2;
        tank.moveForward(tank.speed);
        if(!inBounds(tank.location, 50)){
            tank.moveForward(-tank.speed);
        }
        if(Math.random() < 0.05) {
            tank.fireProjectile();
        }
    }
    for (let projectile of projectiles) {
        projectile.location.x += Math.cos(projectile.rotation * Math.PI / 180) * 5;
        projectile.location.y += Math.sin(projectile.rotation * Math.PI / 180) * 5;
    }
    checkProjectileCollisions();
    deleteProjectiles();
    simulatedGameState = { players: players, projectiles: projectiles };
    drawGame(simulatedGameState);
    updatePlayerHealthBars();
    setTimeout(gameUpdateLoop, 16.7)
}

function checkProjectileCollisions() {
    for(let projectile of projectiles) {
        for(let player of players) {
            // if(player)
            if(projectile.owner != player){
                if(checkCollides(projectile, player)){
                    player.health -= 10;
                    projectile.location.x = -1000;
                }
            }
        }
    }
}

function checkCollides(projectile, tank) {
    // just naive distance for now
    let distance = (projectile.location.x-tank.location.x)**2 + (projectile.location.y-tank.location.y)**2
    return distance < 20**2;
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

function deleteProjectiles() {
    projectiles = projectiles.filter(a => inBounds(a.location));
}

function inBounds(obj, buffer=0) {
    return obj.x >= -10 + buffer && obj.x < 650 - buffer && obj.y >= -10 + buffer && obj.y < 490 - buffer
}

Tank.prototype.fireProjectile = function () {
    let projectile = new Projectile(
        {x: this.location.x + Math.cos((this.rotation + this.turretAngle) * Math.PI / 180) * 20,
        y: this.location.y + Math.sin((this.rotation + this.turretAngle) * Math.PI / 180) * 20},
        this.rotation + this.turretAngle,
        this
    );
    projectiles.push(projectile);
};


Tank.prototype.moveForward = function(distance) {
    this.location.x += Math.cos(this.rotation * Math.PI / 180) * distance;
    this.location.y += Math.sin(this.rotation * Math.PI / 180) * distance;
    this.stateTimer--;
    if (this.stateTimer == 0) {
        this.stateTimer = Math.round(Math.random() * 300);
        this.speed = !this.speed;
    }

};

function updatePlayerNames() {
    for(let i = 0; i < players.length; i++) {
        document.getElementById('player'+(i+1)+'-name').innerText = players[i].name;
        document.getElementById('player'+(i+1)+'-health').style.backgroundColor = players[i].color;
    }
}

function updatePlayerHealthBars() {
    for(let i = 0; i < players.length; i++) {
        document.getElementById('player'+(i+1)+'-health').style.width = (Math.max(0,(players[i].health / players[i].maxHealth))*100)+"%";
    }
}

const GameRenderer = new Renderer(ctx);
let players = [];
let projectiles = [];

let player1 = new Tank(undefined, Math.random() * 360, undefined, Colours.RED, "Alice");
player1.location.x = 50 + Math.random() * 550;
player1.location.y = 50 + Math.random() * 380;
players.push(player1);

let player2 = new Tank(undefined, Math.random() * 360, undefined, Colours.BLUE, "Bob");
player2.location.x = 50 + Math.random() * 550;
player2.location.y = 50 + Math.random() * 380;
players.push(player2);


updatePlayerNames();

gameUpdateLoop();
