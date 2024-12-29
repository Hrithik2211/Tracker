const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const socketio = require('socket.io');
const server = http.createServer(app);
const io = socketio(server);
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

// to establish the connection of socket.io
io.on('connection', (socket) => {
  // after getting connected location is send with emitted data of that user with id 
  socket.on('send-location', function (data) {
    // data emitted to the res and sent to client
    io.emit('receive-location', { id: socket.id, ...data });
  });
  // to disconnect when tab is closed
  socket.on("disconnect", function () {
    io.emit("user-disconnected",socket.id)
  })
});
app.get('/', (req, res) => {
  res.render('index');
});

server.listen(3000);
