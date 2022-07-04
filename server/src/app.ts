import path = require('path');
import express = require('express');
import http = require('http');
import { Server } from 'socket.io';
const { makeid } = require('./utils');


const clientPath = path.join(__dirname, '..', '..', 'client');
const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = 3000;
let clientRooms = {}

app.get('/', (req, res) => {
  res.sendFile(clientPath + '/index.html');
});

app.use(express.static(path.join(clientPath, 'js')));
app.use(express.static(path.join(clientPath, 'assets')));

app.get('/styles.css', (req, res) => {
  res.sendFile(clientPath + '/css/styles.css');
})

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('newGame', () => {
    let roomName = makeid(6);
    clientRooms[socket.id] = roomName;
    console.log(roomName);
    socket.emit('gameCode', roomName);
    socket.join(roomName);
  })

  socket.on('joinGame', (roomName) => {
    console.log(io.sockets.adapter.rooms);
    socket.join(roomName);
  })

  socket.on('boardState', (board) => {
    console.log(board);
  })
});

server.listen(PORT, () => {
  console.log('listening on port', PORT);
});