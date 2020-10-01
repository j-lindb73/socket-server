// const socket = require('dgram');
const express = require('express');
const app = express();
const port = 3000;

const server = require('http').createServer(app);
const io = require('socket.io')(server);

// Get timestamp and adjust single-digit elements to 2-digits i needed
function getNow() {
    const today = new Date();

    const date = today.getFullYear()+'/'+(today.getMonth()+1).toString().padStart(2,"0")+'/'+ today.getDate().toString().padStart(2,"0");
    const time = today.getHours().toString().padStart(2,"0") + ":" + today.getMinutes().toString().padStart(2,"0") + ":" + today.getSeconds().toString().padStart(2,"0");
    const dateTime = date +' '+ time;
    return dateTime;
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