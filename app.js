var express = require('express'), app = express(), http = require('http'), server = http.createServer(app), io = require('socket.io').listen(server), fs = require('fs'), resource = require('./resource');

resource.add(app, '/index.html', 'index.html');
resource.add(app, '/script.js', 'script.js');
resource.add(app, '/ng-socket-io.js', 'ng-socket-io.js');

var getBaseRequestOptionsPrototype = function()
{
  var baseRequestOptions = {
    host: 'localhost',
    path: '/trimBatchWeb/dataCurrency',
    port: '8080',
  };
  return baseRequestOptions;
};


// setInterval(function()
// {

// }, 2000);


io.sockets.on('connection', function(socket)
{
  var options = getBaseRequestOptionsPrototype();
  options.path += '/data';
  options.method = 'GET';

  var req = http.request(options, new configurableCallback().callbackFn).end();
});

// An object to configure an http request callback function.
// Will default to simply sending the data back on the sockets.
function configurableCallback(endFn)
{
  this.callbackFn = function(response)
  {
    var data = '';
    response.on('data', function(chunk)
    {
      data += chunk;
    });

    if (endFn === undefined)
    {
      endFn = function()
      {
        if (data)
        {
          io.sockets.send(data);
        }
      };
    }

    response.on('end', endFn);
  }
}

server.listen(8000);