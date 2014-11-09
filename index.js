var express = require('express');
var fs = require('fs');
var app = express();
var busboy = require('connect-busboy');

var http = require('http').Server(app);
var io = require('socket.io')(http);


var selected = [];
var connections = 0;

app.use(express.static(__dirname + '/public'));
app.use(busboy());

app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/public/samples/:filename', function(req, res) {
  res.sendFile(__dirname + '/public/samples/' + req.params.filename);
});

app.post('/file-upload', function (req, res) {
  var fstream;
  req.pipe(req.busboy);
  req.busboy.on('file', function (fieldname, file, filename) {
      fstream = fs.createWriteStream(__dirname + '/public/samples/' + filename);
      file.pipe(fstream);
      fstream.on('close', function () {
        res.redirect('back');
      });
  });
});

io.on('connection', function(socket){
  fs.readdir(__dirname + '/public/samples', function(err, files) {
    socket.emit('files', files);
    socket.emit('initial', selected);
  });
  connections++;
  socket.broadcast.emit('newConnection', connections);

  socket.on('disconnect', function() {
    connections--;
    socket.emit('newConnection', connections);
  });
  socket.on('selection', function(msg){
    var index = selected.indexOf(msg);
    if (index != -1){
      selected.splice(index, 1);
    }
    else {
      selected.push(msg);
    }
    socket.broadcast.emit('selection', msg);
  });
  socket.on('newFile', function(msg){
    socket.broadcast.emit('newRow', msg)
  });
});

http.listen(3000, "0.0.0.0", function(){
  console.log('listening on *:3000');
});
