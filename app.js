const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, { cors: { origin: '*' } });

var onlineCount = 0;
var users = [];

io.on('connection', (socket) => {

    onlineCount++;
    io.emit('onlineCount', onlineCount);

    socket.on('disconnect', () => {
        console.log('user disconnected  ' + socket.name);
        onlineCount--;
        io.emit('onlineCount', onlineCount);
        users = users.filter((item) => item !== socket.name);
        io.emit('new connection', users);
    });

    socket.on('new connection', (req) => {
        socket.name = req.id;
        console.log('data: ' + req.data + ' id: ' + req.id);
        users.push(req.id);
        io.emit('new connection', users);
    });

    socket.on('chat message', (msg, userId) => {
        console.log('message: ' + msg);
        io.emit('chat message', msg, userId);
    });

});

httpServer.listen(3001, () => {
    console.log('listening on *:3001');
});