var express = require('express'), app = express(), http = require('http'), server = http.createServer(app), io = require('socket.io').listen(server), fs = require('fs'), resource = require('./resource'), requestUtils = require('./request-utils');

resource.add(app, '/index.html', 'index.html');
resource.add(app, '/script.js', 'script.js');
resource.add(app, '/ng-socket-io.js', 'ng-socket-io.js');

var dataCache = (function()
{
  var _dataCache_ = {};

  var setDataCache = function(data)
  {
    _dataCache_.data = JSON.parse(data);
  }

  var options = requestUtils.getBaseRequestOptions();
  options.path += '/data';
  options.method = 'GET';

  http.request(options, new requestUtils.configurableCallback(setDataCache).callbackFn).end();

  return _dataCache_;

})();

// Randomly update an object
setInterval(function()
{
  var record = Math.floor(Math.random() * 50);
  var body = JSON.stringify(dataCache.data[record]);
  var options = requestUtils.getBaseRequestOptions();
  options.path += '/data/';
  options.method = 'PUT';
  options.headers = {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body)
  };
  var request = http.request(options, new requestUtils.configurableCallback(logger).callbackFn);
  request.end(body);
}, 2000);

// Configure sockets
io.sockets.on('connection', function(socket)
{
  io.sockets.send(dataCache.data);
});

server.listen(8000);