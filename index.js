const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');
const router = express.Router();

let users = [];
let userName = '';

app.use(express.static('public'));

app.use('/', router);

router.get('/:name', function(req, res){
    if (req.url === '/favicon.ico') {
        return false;
    }
    userName = req.params.name;
    res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', function(socket){
    users[socket.id] = userName;   
    
    console.log(`a ${userName} connected`);
    io.emit('name', userName);
    socket.on('chat message', function(msg){
        io.emit('chat message', msg);
      });
      socket.on('is typing', function(name){
        io.emit('is typing', name)
        console.log(name)
      });
      socket.on('disconnect', function(){
        io.emit('close', userName);
        console.log(`${userName} disconnected`);
      });  
  });

http.listen(3000, function(){
  console.log('listening on *:3000');
});