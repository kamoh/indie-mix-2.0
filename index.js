
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// Supposed to help with css, but not working
// app.use("/css", express.static(__dirname + '/css'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  socket.on('sign on', function(name){
    io.emit('someone joined', name);
    console.log(name + ' joined the chat');
  });
  socket.on('sync user list', function(listOfNames){
    io.emit('sync user list', listOfNames);
    console.log('syncing user names');
  });
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
    console.log('message: ' + msg);
  });
  console.log('a user connected');
  socket.on('disconnect', function(defaultName){
    io.emit('user left', defaultName);
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