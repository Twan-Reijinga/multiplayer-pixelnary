Object.defineProperty(exports, '__esModule', { value: true });
const path = require('path');
const express = require('express');
const http = require('http');
const socket_io = require('socket.io');
const { makeid } = require('./utils');

const clientPath = path.join(__dirname, '..', '..', 'client');
const app = express();
const server = http.createServer(app);
const io = new socket_io.Server(server);
const PORT = 3000;
let clientRooms = {};

app.get('/', (req, res) => {
    res.sendFile(clientPath + '/index.html');
});
app.use(express.static(path.join(clientPath, 'assets')));
app.use(express.static(path.join(clientPath, 'css')));
app.use(express.static(path.join(clientPath, 'js')));

io.on('connection', (socket) => {
    console.log(socket.id, 'connected');
    socket.on('disconnect', () => {
        io.to(clientRooms[socket.id]).emit('leavedPlayer', socket.id);
        delete clientRooms[socket.id];
        console.log(socket.id, 'disconnected');
    });

    socket.on('newGame', () => {
        let roomName = makeid(6);
        socket.join(roomName);
        socket.emit('gameCode', roomName);
        clientRooms[socket.id] = roomName;
        console.log(socket.id, 'created', roomName);
    });

    socket.on('joinGame', (roomName) => {
        if (io.sockets.adapter.rooms.has(roomName)) {
            io.to(roomName).emit('joinedPlayer', socket.id);
            socket.join(roomName);
            socket.emit('gameCode', roomName);
            clientRooms[socket.id] = roomName;
            console.log(socket.id, 'joined', roomName);
        } else {
            socket.emit('undefinedGame');
            console.log(socket.id, "can't join", roomName, ': not created');
        }
    });

    socket.on('getPlayers', (roomName) => {
        console.log('get players in ', roomName);
        let players = [];
        for (let key in clientRooms) {
            if (clientRooms[key] == roomName) {
                players.push(key);
            }
        }
        for (let i = 0; i < players.length; i++) {
            socket.emit('joinedPlayer', players[i]);
        }
    });

    socket.on('boardState', (board) => {
        console.log(socket.id, 'changed', board);
        let roomName = clientRooms[socket.id];
        io.to(roomName).emit('boardState', board);
    });
});

server.listen(PORT, () => {
    console.log('listening on port', PORT);
});
