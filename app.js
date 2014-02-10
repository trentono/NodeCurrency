var express = require('express'),
    app = express(),
    http = require('http'),
    server = http.createServer(app),
    io = require('socket.io').listen(server),
    fs = require('fs');

var options = {
    host: 'localhost',
    path: '/trimBatchWeb/dataCurrency',
    //since we are listening on a custom port, we need to specify it by hand
    port: '8080',
    //This is what changes the request to a POST request
    method: 'GET'
};

var currentState = false;

// Use promises you noob
var callback = function(response) {
    var str = ''


    response.on('data', function (chunk) {
        str += chunk;
    });

    response.on('end', function () {
        currentState = (str ==="true");

        if (currentState) {
            updateState();
        }
    });
}

setInterval(function () {
    var req = http.request(options, callback);
    req.end();
}, 200);

app.get('/index.html', function(req, res) {
  fs.readFile('index.html',function (err, data){
    res.writeHead(200, {'Content-Type': 'text/html','Content-Length':data.length});
    res.write(data);
    res.end();
  });
});

app.get('/script.js', function(req, res) {
  fs.readFile('script.js',function (err, data){
    res.writeHead(200, {'Content-Type': 'text/html','Content-Length':data.length});
    res.write(data);
    res.end();
  });
});

app.get('/ng-socket-io.js', function(req, res) {
    fs.readFile('ng-socket-io.js',function (err, data){
        res.writeHead(200, {'Content-Type': 'text/html','Content-Length':data.length});
        res.write(data);
        res.end();
    });
});

var updateState = function () {
    io.sockets.send("currentState: " + currentState);
};

io.sockets.on('connection', function (socket) {

});

server.listen(8000);