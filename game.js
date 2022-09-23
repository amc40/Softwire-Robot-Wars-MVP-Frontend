const Colours = {
    BLACK: '#000',
    RED: '#F00',
    GREEN: '#0F0',
    BLUE: '#89CFF0',
    GREY: '#DDDDDD'
}

class Renderer {
    constructor(ctx) {
        this.ctx = ctx
    }
    drawTankBody(tank) {
        ctx.save();

        ctx.translate(tank.location.x, tank.location.y);
        ctx.rotate(tank.rotation * Math.PI / 180);
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
        ctx.fillStyle = tank.colour;
        ctx.rect(-tank.width / 2, -tank.height / 2, tank.width, tank.height);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();

        ctx.restore();
    }
    drawTankTurret(tank) {
        ctx.save();

        ctx.strokeStyle = Colours.BLACK;
        ctx.fillStyle = tank.colour;

        //circle
        ctx.translate(tank.location.x, tank.location.y);
        ctx.rotate(tank.rotation * Math.PI / 180);
        ctx.beginPath();
        ctx.arc(0, 0, 8, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();

        //turret
        ctx.rotate(tank.turretAngle * Math.PI / 180);
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
        // x
        // y
        // xVel
        // yVel
        // rotation
        // owner
        ctx.strokeStyle = Colours.BLACK;
        ctx.fillStyle = projectile.owner.colour;

        ctx.save();

        ctx.translate(projectile.x, projectile.y);
        ctx.rotate(projectile.rotation * Math.PI / 180);

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
    constructor(location = { x: 0, y: 0 }, rotation = 0, turretAngle = 0, colour = "GREEN") {
        this.location = location;
        this.turretAngle = turretAngle;
        this.colour = colour;
        this.width = 35;
        this.height = 25;
        this.rotation = rotation;
        this.speed = 1;
        this.stateTimer = 100;
    }

}

const canvas = document.getElementById('cvs');
const ctx = canvas.getContext('2d');