class Particle {
    constructor(
        position = { x: 0, y: 0 },
        velocity = { x: 0, y: 0 },
        gravity = { x: 0, y: 0 }
    ) {
        this.position = position;
        this.velocity = velocity;
        this.gravity = gravity;
    }

    setRandomVelocity() {
        let angle = Math.random() * 2 * Math.PI;
    }

    draw(ctx) {

    }

}

class Smoke extends Particle {
    constructor(position = { x: 0, y: 0 },
        velocity = { x: 0, y: 0 },
        gravity = { x: 0, y: -1 },
        size = 30
        ) {
            this.size = size;
            super(position, vlocity, gravity);
        }
}