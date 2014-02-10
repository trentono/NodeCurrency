var express = require('express'), app = express(), http = require('http'), server = http.createServer(app), io = require('socket.io').listen(server), fs = require('fs'), resource = require('./resource'), requestUtils = require('./request-utils');

resource.add(app, '/index.html', 'index.html');
resource.add(app, '/script.js', 'script.js');
resource.add(app, '/ng-socket-io.js', 'ng-socket-io.js');

var dataCache = (function()
{
  var _dataCache_ = {};

  var setDataCache = function(data)
  {
    _dataCache_.data = data;
  }

  var options = requestUtils.getBaseRequestOptions();
  options.path += '/data';
  options.method = 'GET';

  http.request(options, new requestUtils.configurableCallback(setDataCache).callbackFn).end();

  return eval(_dataCache_);

})();

// setInterval(function()
// {

// }, 2000);

io.sockets.on('connection', function(socket)
{
  io.sockets.send(dataCache.data);
});

server.listen(8000);