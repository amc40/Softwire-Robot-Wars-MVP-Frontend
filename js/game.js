const Colours = {
    BLACK: '#000',
    RED: '#F00',
    GREEN: '#0F0',
    BLUE: '#89CFF0',
    GREY: '#DDDDDD'
}

class Renderer {
    GAME_MAX_X = 1000
    GAME_MAX_Y = 1000

    constructor(ctx) {
        this.ctx = ctx
    }

    gameXToCanvasX(gameX) {
        const canvasWidth = this.ctx.canvas.width;
        return (gameX / this.GAME_MAX_X) * canvasWidth;
    }

    gameYToCanvasY(gameY) {
        const canvasHeight = this.ctx.canvas.height;
        return (gameY / this.GAME_MAX_Y) * canvasHeight;
    }

    drawTankBody(tank) {
        ctx.save();

        const tankCanvasX = this.gameXToCanvasX(tank.position.x);
        const tankCanvasY = this.gameYToCanvasY(tank.position.y);
        ctx.translate(tankCanvasX, tankCanvasY);
        ctx.rotate(tank.angle);
        //draw tracks
        ctx.beginPath();
        ctx.strokeStyle = Colours.BLACK;
        ctx.fillStyle = Colours.BLACK;
        ctx.rect(-tank.width / 2 + 2, -tank.height / 2 - 2, tank.width - 4, tank.height + 4);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
        //draw body
        ctx.beginPath();
        ctx.strokeStyle = Colours.BLACK;
        ctx.fillStyle = tank.color;
        ctx.rect(-tank.width / 2, -tank.height / 2, tank.width, tank.height);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();

        ctx.restore();
    }
    drawTankTurret(tank) {
        ctx.save();

        ctx.strokeStyle = Colours.BLACK;
        ctx.fillStyle = tank.color;

        //circle
        const tankCanvasX = this.gameXToCanvasX(tank.position.x);
        const tankCanvasY = this.gameYToCanvasY(tank.position.y);
        ctx.translate(tankCanvasX, tankCanvasY);
        ctx.rotate(tank.angle);
        ctx.beginPath();
        ctx.arc(0, 0, 8, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();

        //turret
        ctx.rotate(tank.turretAngle);
        ctx.beginPath();
        ctx.rect(-3, -2, 18, 4);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        ctx.rect(12, -3, 9, 6);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();

        ctx.restore();
    }
    drawProjectile(projectile) {

        ctx.strokeStyle = Colours.BLACK;
        ctx.fillStyle = projectile.owner.color;

        ctx.save();
        const projectileCanvasX = this.gameXToCanvasX(projectile.position.x);
        const projectileCanvasY = this.gameYToCanvasY(projectile.position.y);
        ctx.translate(projectileCanvasX, projectileCanvasY);
        ctx.rotate(projectile.angle);

        //trail
        ctx.globalAlpha = 0.7;
        ctx.beginPath();
        ctx.arc(-3, 0, 3, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
        ctx.globalAlpha = 0.45;
        ctx.beginPath();
        ctx.arc(-6, 0, 3, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
        ctx.globalAlpha = 0.2;
        ctx.beginPath();
        ctx.arc(-9, 0, 3, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
        //circle
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.arc(0, 0, 3, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();

        ctx.restore();

        ctx.globalAlpha = 1;
    }
}

class Tank {
    constructor(position, angle = 0, turretAngle = 0, color = "GREEN", name = "BOB") {
        console.log(position);
        this.position = position;
        this.turretAngle = turretAngle;
        this.color = color;
        this.width = 35;
        this.height = 25;
        this.angle = angle;
        this.speed = 1;
        this.stateTimer = 100;
        this.name = name;
        this.health = 100;
        this.maxHealth = 100;
    }

}

class Projectile {
    constructor(position = { x: 0, y: 0 }, angle = 0, owner = null) {
        this.position = position;
        this.angle = angle;
        this.owner = owner;
        this.color = owner.color;
    }
}


function interpolateGameState(lastGameState, nextGameState) {
    let UPDATE_RATE = getTickRate();
    // we are storing the 2 most recent game states
    // to smooth animations we will assume a fixed update rate and render a weighted average of the positions/rotations of game objects
    // the weighting calculation will be: animationDelta = (timeNow - timeAtMostRecentGameState) / UPDATE_RATE
    const timeNow = new Date().getTime();
    const animationDelta = Math.min((timeNow - nextGameState.timestamp) / UPDATE_RATE, 5); //limit to some arbitrary maximum number of ticks to interpolate for
    let interpolatedGameState = {};
    interpolatedGameState = JSON.parse(JSON.stringify(lastGameState));
    for (let player of interpolatedGameState.players) {
        let name = player.name;
        let playerIndexNextGameState = nextGameState.players.findIndex(player => player.name == name);
        if (playerIndexNextGameState != -1) {
            futurePlayer = nextGameState.players[playerIndexNextGameState];
            player.angle = player.angle + (futurePlayer.angle - player.angle) * animationDelta;
            player.turretAngle = player.turretAngle + (futurePlayer.turretAngle - player.turretAngle) * animationDelta;
            player.position.x = player.position.x + (futurePlayer.position.x - player.position.x) * animationDelta;
            player.position.y = player.position.y + (futurePlayer.position.y - player.position.y) * animationDelta;
            player.health = player.health + (futurePlayer.health - player.health) * animationDelta;
        }
    }
    for (let projectile of interpolatedGameState.projectiles) {
        projectile.position.x = projectile.position.x + projectile.velocity.x * animationDelta;
        projectile.position.y = projectile.position.y + projectile.velocity.y * animationDelta;
    }
    return interpolatedGameState;
}

const canvas = document.getElementById('cvs');
const ctx = canvas.getContext('2d');