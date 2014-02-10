var express = require('express'), app = express(), http = require('http'), server = http.createServer(app), io = require('socket.io').listen(server), fs = require('fs'), resource = require('./resource');

resource.add(app, '/index.html', 'index.html');
resource.add(app, '/script.js', 'script.js');
resource.add(app, '/ng-socket-io.js', 'ng-socket-io.js');

var getBaseRequestOptionsPrototype = function()
{
  var baseRequestOptions = {
    host: 'localhost',
    path: '/trimBatchWeb/dataCurrency',
    port: '8080'
  };
  return baseRequestOptions;
};

var dataCache = '';
var setDataCache = function(_dataCache_)
{
  console.log("setting cache: " + _dataCache_);
  dataCache = _dataCache_;
}

var options = getBaseRequestOptionsPrototype();
options.path += '/data';
options.method = 'GET';

http.request(options, new configurableCallback(setDataCache).callbackFn).end();

// setInterval(function()
// {

// }, 2000);

io.sockets.on('connection', function(socket)
{
  console.log("connection");
  io.sockets.send(dataCache);
});

// An object to configure an http request callback function.
// Will default to simply sending the data back on the sockets.
function configurableCallback(callOnEnd)
{
  this.callbackFn = function(response)
  {
    var data = '';
    response.on('data', function(chunk)
    {
      data += chunk;
    });

    if (callOnEnd === undefined)
    {
      callOnEnd = function(data)
      {
        io.sockets.send(data);
      }
    }

    response.on('end', function()
    {
      if (data)
      {
        callOnEnd(data);
      }
    });
  }
}

server.listen(8000);