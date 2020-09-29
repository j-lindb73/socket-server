// const socket = require('dgram');
const express = require('express');
const app = express();
const port = 3000;

const server = require('http').createServer(app);
const io = require('socket.io')(server);

io.on('connection', function (socket) {
    console.log("User connected");

    socket.on('chat message', function(message) {
        io.emit('chat message', message);
    });
});

server.listen(port);

console.log("Server is listening on " + port);