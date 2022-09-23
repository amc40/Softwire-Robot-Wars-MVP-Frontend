
function gameUpdateLoop() {
    for (let tank of players) {
        tank.rotation += 1.5;
        tank.turretAngle -= 2;
        tank.moveForward(tank.speed);
        if(Math.random() < 0.02) {
            tank.fireProjectile();
        }
    }
    for (let projectile of projectiles) {
        projectile.x += Math.cos(projectile.rotation * Math.PI / 180) * 5;
        projectile.y += Math.sin(projectile.rotation * Math.PI / 180) * 5;
    }
    deleteProjectiles();
    drawGame({ players: players, projectiles: projectiles });
    setTimeout(gameUpdateLoop, 16.7)
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
    projectiles = projectiles.filter(a => inBounds(a));
}

function inBounds(obj) {
    return obj.x >= -10 && obj.x < 650 && obj.y >= -10 && obj.y < 490
}

Tank.prototype.fireProjectile = function () {
    let projectile = {
        x: this.location.x + Math.cos((this.rotation + this.turretAngle) * Math.PI / 180) * 20,
        y: this.location.y + Math.sin((this.rotation + this.turretAngle) * Math.PI / 180) * 20,
        rotation: this.rotation + this.turretAngle,
        owner: this
    };
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

const GameRenderer = new Renderer(ctx);
let players = [];
let projectiles = [];

let player1 = new Tank(undefined, Math.random() * 360, undefined, Colours.RED);
player1.location.x = 50 + Math.random() * 550;
player1.location.y = 50 + Math.random() * 380;
players.push(player1);

let player2 = new Tank(undefined, Math.random() * 360, undefined, Colours.BLUE);
player2.location.x = 50 + Math.random() * 550;
player2.location.y = 50 + Math.random() * 380;
players.push(player2);

gameUpdateLoop();
