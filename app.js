var express = require('express'),
    app = express(),
    http = require('http'),
    server = http.createServer(app),
    io = require('socket.io').listen(server);

app.get('/', function(req, res) {
    res.send('<!doctype html> \
            <html> \
            <head><meta charset="utf-8"></head> \
            <body> \
                 <center>Welcome to <strong>socket.io</strong></center> \
                 <script src="/socket.io/socket.io.js"></script> \
                 <script> \
                    var socket = io.connect(); \
                    socket.emit("message", "Howdy"); \
                    setInterval(function () { \
                        socket.emit("message", "Ping"); \
                    }, 1000); \
                 </script> \
            </body> \
            </html>');
});

io.sockets.on('connection', function (socket) {
    socket.on('message', function(msg) {
        console.log(msg);
    });
});

server.listen(8000);