const http = require('http');
const path = require('path');
const express = require('express');
const socketio = require('socket.io');
const parseArgs = require('minimist');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const args = parseArgs(process.argv.slice(2));
const { name = 'chat', port = '3000'} = args;

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
    console.log('Client Connected');
    
    socket.username = "Anonymous";

    socket.on('change_username', (data) => {
        socket.username = data.username;
    });

    socket.on('message', (data) => {
        io.sockets.emit('message', {message : data.message, username : socket.username});
    });

    socket.on('disconnect', () => {
        console.log('Client Disconnected');
    });
});

server.listen(+port, '0.0.0.0', (err) => {
  if (err) {
    console.log(err.stack);
    return;
  }

  console.log(`> ${name} @ http://127.0.0.1:${port}`);
});
