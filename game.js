const Colours = {
    BLACK: '#000',
    RED: '#F00',
    GREEN: '#0F0',
    BLUE: '#00F'
}





class Renderer {
    constructor(ctx) {
        this.ctx = ctx
    }
    drawTank(tank) {
        //draw body
        
        ctx.beginPath();
        ctx.strokeStyle = Colours.BLACK;
        ctx.fillStyle = tank.colour;
        ctx.save();
        ctx.translate(tank.location.x,tank.location.y);
        ctx.rotate(tank.rotation * Math.PI/180);
        ctx.rect(-tank.width/2,-tank.height/2,tank.width,tank.height);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        ctx.arc(0,0,8,0,2*Math.PI);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();

        ctx.restore();
    }
}








class Tank {
    constructor(location={x:0,y:0}, rotation=0, turretAngle=0, colour="GREEN") {
        this.location = location;
        this.turretAngle = turretAngle;
        this.colour = colour;
        this.width = 40;
        this.height = 25;
        this.rotation = rotation;
    }
}


function drawGame(){
    ctx.clearRect(0,0,640,480)
    for(let player of players){
        GameRenderer.drawTank(player);
    }
}

function gameUpdateLoop(){

    for(let tank of players){
        tank.rotation+=0.1;
    }

    drawGame();

    setInterval(gameUpdateLoop, 50)
}

const canvas = document.getElementById('cvs');
const ctx = canvas.getContext('2d');



const GameRenderer = new Renderer(ctx);
let players = [];

let player1 = new Tank(undefined,45,undefined,Colours.RED);
player1.location.x = 50+Math.random()*550;
player1.location.y = 50+Math.random()*380;
players.push(player1);

let player2 = new Tank(undefined,30,undefined,Colours.BLUE);
player2.location.x = 50+Math.random()*550;
player2.location.y = 50+Math.random()*380;
players.push(player2);

gameUpdateLoop();





