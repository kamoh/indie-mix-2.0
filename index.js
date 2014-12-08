
var app = require('express')(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    allClients = [];

// Supposed to help with css, but not working
// app.use("/css", express.static(__dirname + '/css'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('sign on', function(name){
    allClients.push(name);
    io.emit('someone joined', name);
    socket.name = name;
    updateClientUserList(allClients);
    console.log(name + ' joined the chat');
    console.log('current clients: ' + allClients.toString());
    });
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
    console.log('message: ' + msg);
  });
  socket.on('name change', function(defaultName, newName){
    console.log('=== old client list was: ' + allClients);
    updateServerUserList(defaultName, newName, allClients);
    socket.name = newName;
    console.log('=== new client list is: ' + allClients);
    io.emit('someone name changed', defaultName, newName);
  });
  socket.on('disconnect', function(){
    console.log(socket.name + ' has discon7nected');
    updateServerListUserLeft(socket.name, allClients);
    var leftMsg = userLeftMessage(),
        args = [socket.name, leftMsg];
    io.sockets.emit('user left', args);
    console.log('clinet list after user left: ' + allClients.toString());
  })
  
  // Functions

  function updateServerListUserLeft(name, clientList) {
    for (var i = 0; i < clientList.length; i++) {
      if (name === clientList[i]) {
        console.log("name is: " + name);
        clientList.splice(i, 1);
      };
    }
    updateClientUserList(clientList);
    console.log('client list after update: ' + clientList);
  };

  function updateServerUserList(oldName, newName, clientList) {
    for (var i = 0; i < clientList.length; i++) {
      if (oldName === clientList[i]) {
        clientList[i] = newName;
      };
    }
    updateClientUserList(clientList);
  };

  function updateClientUserList(clientList){
    io.sockets.emit('sync user list', clientList);
    console.log('currnet users: ' + clientList.toString());
  };

  function userLeftMessage() {
    var leftMessages = ['ran out screaming','exploded nicely','evaporated into sierra mist','left to go poop','peaced out','was terminated','kicked the computer and it burst into flames and is now gone forever','went to eat five burritos','went to walk the parrot','left to buy a shoe','left like a doophead','left the room','left the room','left the room','left the room','left the room','left the room','left the room','left the room','left the room','left the room','left the room','left the room','left the room','left the room','left the room','left the room','left the room','left the room'],
      leftMsg = leftMessages[Math.floor(Math.random() * leftMessages.length)];

    return leftMsg;
  }

});

http.listen(process.env.PORT || 3000, function(){
  console.log('listening on *:3000');
});