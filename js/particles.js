class Particle {
    constructor(
        position = { x: 0, y: 0 },
        velocity = { x: 0, y: 0 },
        gravity = { x: 0, y: 0 },
        lifetime = 500
    ) {
        this.position = position;
        this.velocity = velocity;
        this.gravity = gravity;
        this.lifetime = lifetime;
    }

    setRandomVelocity() {
        let angle = Math.random() * 2 * Math.PI;
        let power = 10 + Math.random() * 10;
        this.velocity.x = power * Math.cos(angle);
        this.velocity.y = power * Math.sin(angle);
    }

    updatePosition() {
        this.velocity.x += this.gravity.x;
        this.velocity.y += this.gravity.y;
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }

    draw(ctx) {

    }

}


class Spark extends Particle {
    constructor(
        position = { x: 0, y: 0 },
        velocity = { x: 0, y: 0 },
        gravity = { x: 0, y: 0 },
        lifetime = 500
    ) {
        super(position, velocity, gravity, lifetime);
        this.color = "#FFFF00";
    }

    setRandomVelocity() {
        let angle = Math.random() * 2 * Math.PI;
        let power = 8 + Math.random() * 10;
        this.velocity.x = power * Math.cos(angle);
        this.velocity.y = power * Math.sin(angle);
    }

    setRandomColor() {

    }

    draw(ctx) {
        ctx.lineWidth = 3;
        ctx.strokeStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(this.position.x, this.position.y);
        ctx.lineTo(this.position.x + this.velocity.x,
            this.position.y + this.velocity.y);
        ctx.stroke();
        this.velocity.x += this.gravity.x;
        this.velocity.y += this.gravity.y;
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }

}

class Smoke extends Particle {
    constructor(position = { x: 0, y: 0 },
        velocity = { x: 0, y: 0 },
        gravity = { x: 0, y: -1 },
        size = 30
    ) {
        this.size = size;
        super(position, velocity, gravity);
    }

    setRandomVelocity() {
        let angle = Math.random() * 2 * Math.PI;
        let power = 8 + Math.random() * 10;
        this.velocity.x = power * Math.cos(angle);
    }

    updatePosition() {
        this.velocity.x *= 0.95;
        this.position.x += this.velocity.x;
        this.position.y += this.gravity.y;
    }

}