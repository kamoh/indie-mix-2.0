
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
    updateClientUserList(allClients);
    console.log(name + ' joined the chat');
    console.log('current clients: ' + allClients.toString());
    });
  // socket.on('sync user list', function(listOfNames){
  //   io.emit('sync user list', listOfNames);
  //   console.log('syncing user names');
  // });
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
    console.log('message: ' + msg);
  });
  socket.on('name change', function(defaultName, newName){
    // io.emit('name change', defaultName, newName);
    updateServerUserList(defaultName, newName, allClients);
    console.log('roll call updated');
  });
  socket.on('disconnect', function(name){
    io.emit('user left', name);
    console.log(this.name + ' disconnected');
  });
  
  // Functions

  function updateServerUserList(oldName, newName, clientList) {
    console.log('started server user list function');
    console.log('client list: ' + clientList.toString());
    for (var i = 0; i < clientList.length; i++) {
      console.log('in for looop');
      console.log('oldname: '+ oldName)
      console.log('newname: '+ newName)
      if (oldName === clientList[i]) {
        clientList[i] = newName;
        console.log('oldname: '+ oldName)
        console.log('newname: '+ newName)
        console.log('clientList: '+ clientList)
      };
    }
    updateClientUserList(clientList);
  };

  function updateClientUserList(clientList){
    io.sockets.emit('sync user list', clientList);
    console.log('currnet users: ' + clientList.toString());
  };

});

http.listen(process.env.PORT || 3000, function(){
  console.log('listening on *:3000');
});