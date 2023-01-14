const express = require('express');

const { createServer } = require('http');
const { Server } = require('socket.io');

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, { cors: { origin: '*' } });

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
    socket.on('new connection', (req) => {
        console.log('data: ' + req.data + ' id: ' + req.id);
    });
    socket.on('chat message', (msg,userId) => {
        console.log('message: ' + msg);
        io.emit('chat message', msg,userId);
    });

});

httpServer.listen(3001, () => {
    console.log('listening on *:3001');
});