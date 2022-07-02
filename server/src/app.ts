import path = require('path');
const clientPath = path.join(__dirname, '..', '..', 'client')
import express = require('express');
const app = express();
import http = require('http');
const server = http.createServer(app);
import { Server } from 'socket.io';
const io = new Server(server);

app.get('/', (req: any, res: any) => {
  res.sendFile(clientPath + '/index.html');
});

app.get('/main.js', (req: any, res: any) => {
  res.sendFile(clientPath + '/main.js');
})

app.get('/styles.css', (req: any, res: any) => {
  res.sendFile(clientPath + '/styles.css');
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

server.listen(3000, () => {
  console.log('listening on *:3000');
});