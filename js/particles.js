class Particle {
    constructor(
        position = { x: 0, y: 0 },
        velocity = { x: 0, y: 0 },
        gravity = { x: 0, y: 0 },
        age = 0
    ) {
        this.position = position;
        this.velocity = velocity;
        this.gravity = gravity;
        this.age = age;
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
        age = 0
    ) {
        super(position, velocity, gravity, age);
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
    }

}

class Smoke extends Particle {
    constructor(position = { x: 0, y: 0 },
        velocity = { x: 0, y: 0 },
        gravity = { x: 0, y: -1 },
        size = 30
    ) {
        super(position, velocity, gravity);
        this.size = size+Math.random()*15;
        this.color = "#FF0000";
    }

    setRandomVelocity() {
        let angle = Math.random() * 2 * Math.PI;
        let power = 0.1 + Math.random() * 1;
        this.velocity.x = power * Math.cos(angle);
    }

    updatePosition() {
        this.velocity.x *= 0.96;
        this.position.x += this.velocity.x;
        this.position.y += this.gravity.y;
    }

    draw(ctx) {
        ctx.globalAlpha = 1-(Math.min(this.age, 200)/200);
        ctx.drawImage(smokeImg, this.position.x-this.size/2, this.position.y-this.size/2,this.size,this.size);
        ctx.globalAlpha = 1;
        this.age++;
    }


}



let smokeImg = new Image();
smokeImg.src = "../../images/Smoke10.png";