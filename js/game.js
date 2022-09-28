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
        
        const tankCanvasX = this.gameXToCanvasX(tank.location.x);
        const tankCanvasY = this.gameYToCanvasY(tank.location.y);
        ctx.translate(tankCanvasX, tankCanvasY);
        ctx.rotate(tank.rotation);
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
        const tankCanvasX = this.gameXToCanvasX(tank.location.x);
        const tankCanvasY = this.gameYToCanvasY(tank.location.y);
        ctx.translate(tankCanvasX, tankCanvasY);
        ctx.rotate(tank.rotation);
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
        const projectileCanvasX = this.gameXToCanvasX(projectile.location.x);
        const projectileCanvasY = this.gameYToCanvasY(projectile.location.y);
        ctx.translate(projectileCanvasX, projectileCanvasY);
        ctx.rotate(projectile.rotation);

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
    constructor(location = { x: 0, y: 0 }, rotation = 0, turretAngle = 0, color = "GREEN", name = "BOB") {
        this.location = location;
        this.turretAngle = turretAngle;
        this.color = color;
        this.width = 35;
        this.height = 25;
        this.rotation = rotation;
        this.speed = 1;
        this.stateTimer = 100;
        this.name = name;
        this.health = 100;
        this.maxHealth = 100;
    }

}

class Projectile {
    constructor(location = { x: 0, y: 0 }, rotation = 0, owner = null) {
        this.location = location;
        this.rotation = rotation;
        this.owner = owner;
        this.color = owner.color;
    }
}

const canvas = document.getElementById('cvs');
const ctx = canvas.getContext('2d');