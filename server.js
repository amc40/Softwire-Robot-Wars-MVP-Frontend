import {Server} from "socket.io";
import express from 'express';
import http from 'http';
import path from 'path';
import {readFileSync} from 'fs';


const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(path.resolve(), 'public')))

// var index = readFileSync('upload.html');

// // Send index.html to all requests
// var app = http.createServer(function(req, res) {
//     res.writeHead(200, {'Content-Type': 'text/html'});
//     res.end(index);
// });

// Socket.io server listens to our app
// var io = new Server(app);

// Send current time to all connected clients
function sendTime() {
    io.emit('time', { time: new Date().toJSON() });
}

// Send current time every 10 secs
setInterval(sendTime, 10000);

// Emit welcome message on connection
io.on('connection', function(socket) {
    console.log("connection")
    // Use socket to communicate with this particular client only, sending it it's own id
    socket.emit('welcome', { message: 'Welcome!', id: socket.id });

    socket.on('i am client', console.log);
});

server.listen(3000);

// app.listen(3000);