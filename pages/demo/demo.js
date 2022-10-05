
function gameUpdateLoop() {
    for (let tank of players) {
        tank.angle += 1 * Math.PI/180;
        tank.turretAngle -= 2 * Math.PI/180;
        tank.moveForward(tank.speed);
        if(!inBounds(tank.position, 50)){
            tank.moveForward(-tank.speed);
        }
        if(Math.random() < 0.05) {
            tank.fireProjectile();
        }
    }
    for (let projectile of projectiles) {
        projectile.position.x += Math.cos(projectile.angle) * 5;
        projectile.position.y += Math.sin(projectile.angle) * 5;
    }
    checkProjectileCollisions();
    projectiles = filterInBounds(projectiles);
    particles = filterInBounds(particles);
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
                    projectile.position.x = -1000;
                    for(i=0;i<50;i++){
                        let particle = new Spark({x: player.position.x, y: player.position.y});
                        particle.setRandomVelocity();
                        particle.gravity.y = 0.5;
                        particles.push(particle);
                    }
                }
            }
        }
    }
}

function checkCollides(projectile, tank) {
    // just naive distance for now
    let distance = (projectile.position.x-tank.position.x)**2 + (projectile.position.y-tank.position.y)**2
    return distance < 20**2;
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
    for (let particle of particles) {
        GameRenderer.drawParticle(particle);
    }
}

function filterInBounds(objects) {
    return objects.filter(a => inBounds(a.position));
}

function inBounds(obj, buffer=0) {
    return obj.x >= -10 + buffer && obj.x < 610 - buffer && obj.y >= -10 + buffer && obj.y < 610 - buffer
}

Tank.prototype.fireProjectile = function () {
    let projectile = new Projectile(
        {x: this.position.x + Math.cos((this.angle + this.turretAngle)) * 20,
        y: this.position.y + Math.sin((this.angle + this.turretAngle)) * 20},
        this.angle + this.turretAngle,
        this
    );
    projectiles.push(projectile);
};


Tank.prototype.moveForward = function(distance) {
    this.position.x += Math.cos(this.angle) * distance;
    this.position.y += Math.sin(this.angle) * distance;
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
GameRenderer.gameXToCanvasX = (a) => a;
GameRenderer.gameYToCanvasY = (a) => a;
let players = [];
let projectiles = [];
let particles = [];

let player1 = new Tank( new Object({x: 50 + Math.random() * 550, y: 50 + Math.random() * 400}), Math.random() * 360, undefined, Colours.RED, "Alice");
players.push(player1);

let player2 = new Tank(new Object({x: 50 + Math.random() * 550, y: 50 + Math.random() * 400}), Math.random() * 360, undefined, Colours.BLUE, "Bob");
players.push(player2);

updatePlayerNames();

gameUpdateLoop();


