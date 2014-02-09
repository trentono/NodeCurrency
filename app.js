var express = require('express'),
    app = express(),
    http = require('http'),
    server = http.createServer(app),
    io = require('socket.io').listen(server),
    fs = require('fs');

var options = {
    host: '10.194.142.32',
    path: '/trimBatchWeb/dataCurrency',
    //since we are listening on a custom port, we need to specify it by hand
    port: '8080',
    //This is what changes the request to a POST request
    method: 'GET'
};

var trueCount = 0,
    falseCount = 0;

// Use promises you noob
var callback = function(response) {
    var str = ''


    response.on('data', function (chunk) {
        str += chunk;
    });

    response.on('end', function () {
        if (str === "true") {
            trueCount++;
        } else {
            falseCount++;
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

io.sockets.on('connection', function (socket) {
    socket.on('message', function(msg) {
        console.log(msg);
    });
});

server.listen(8000);