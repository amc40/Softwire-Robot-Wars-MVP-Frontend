
function gameUpdateLoop() {
    for (let tank of players) {
        tank.rotation += 1.5;
        tank.turretAngle -= 2;
        tank.moveForward(tank.speed);
    }
    drawGame({ players: players, projectiles: projectiles });
    setTimeout(gameUpdateLoop, 16.7)
}

function drawGame(gameState) {
    ctx.fillStyle = Colours.GREY;
    ctx.fillRect(0, 0, 640, 480)
    let players = gameState.players || null;
    let projectiles = gameState.projectiles || null;
    for (let player of players) {
        GameRenderer.drawTank(player);
    }
    for (let projectile of projectiles) {
        GameRenderer.drawProjectile(projectile);
    }
}

const GameRenderer = new Renderer(ctx);
let players = [];
let projectiles = [{x: 100, y: 100, rotation: 45, owner: {colour: Colours.GREEN}}];

let player1 = new Tank(undefined, Math.random() * 360, undefined, Colours.RED);
player1.location.x = 50 + Math.random() * 550;
player1.location.y = 50 + Math.random() * 380;
players.push(player1);

let player2 = new Tank(undefined, Math.random() * 360, undefined, Colours.BLUE);
player2.location.x = 50 + Math.random() * 550;
player2.location.y = 50 + Math.random() * 380;
players.push(player2);

gameUpdateLoop();
