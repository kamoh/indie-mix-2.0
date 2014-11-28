var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// Supposed to help with css, but not working
// app.use("/css", express.static(__dirname + '/css'));

console.log(__dirname);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
    console.log('message: ' + msg);
  });
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});