import path = require('path');
import express = require('express');
import http = require('http');
import { Server } from 'socket.io';

const clientPath = path.join(__dirname, '..', '..', 'client')
const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = 3000;

app.get('/', (req, res) => {
  res.sendFile(clientPath + '/index.html');
});

app.get('/main.js', (req, res) => {
  res.sendFile(clientPath + '/js/main.js');
})

app.get('/styles.css', (req, res) => {
  res.sendFile(clientPath + '/css/styles.css');
})

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  
  socket.on('client msg', (msg) => {
    console.log(msg)
  })
  socket.emit('server msg', 'hi client');
});

server.listen(PORT, () => {
  console.log('listening on port', PORT);
});