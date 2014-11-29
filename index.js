
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// Supposed to help with css, but not working
// app.use("/css", express.static(__dirname + '/css'));

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
  socket.on('name change', function(defaultName, newName){
    io.emit('name change', defaultName, newName);
    console.log('roll call updated');
  });
});

http.listen(process.env.PORT || 3000, function(){
  console.log('listening on *:3000');
});