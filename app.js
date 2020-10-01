// const socket = require('dgram');
const express = require('express');
const app = express();
const port = 3000;

const server = require('http').createServer(app);
const io = require('socket.io')(server);

// Get timestamp

function getNow() {
    const d = new Date();
    const timestampISO = d.toISOString();
    return timestampISO;

 
}


io.set('origins', ['https://socket-client.hasselstigen.me:443', 'https://me-app.hasselstigen.me:443']);

io.on('connection', (socket) => {
    console.log("User connected");
    // socket.username = 'Gäst';
    socket.on('message', (msg) => {
        console.log(msg);
        io.emit('message', {'user': socket.username, 'timestamp': getNow(), 'message': msg});
    });
    socket.on('join', (username) => {
       if (username != null) {
           socket.username = username;
       }
       console.log(socket.username + " joined");
       socket.broadcast.emit('message', {'user': 'Server', 'timestamp': getNow(), 'message': socket.username + " har anslutit till chatten!"})
    })

    socket.on('disconnect', (reason) => {
        // console.log(reason);
        console.log(socket.username);
        socket.broadcast.emit('message', {'user': 'Server', 'timestamp': getNow(), 'message': socket.username + " har lämnat chatten!"})
      });
});

server.listen(port);

console.log("Server is listening on " + port); 