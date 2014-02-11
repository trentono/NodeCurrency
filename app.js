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

// Randomly swap the data values of two objects and save.
setInterval(function()
{
  var recordOne = Math.floor(Math.random() * 50);
  var recordTwo = Math.floor(Math.random() * 50);

  var tempData = dataCache.data[recordOne].data;
  dataCache.data[recordOne].data = dataCache.data[recordTwo].data;
  dataCache.data[recordTwo].data = tempData;

  var recordOneBody = JSON.stringify(dataCache.data[recordOne]);
  var recordTwoBody = JSON.stringify(dataCache.data[recordTwo]);

  var options = requestUtils.getBaseRequestOptions();
  options.path += '/data/';
  options.method = 'PUT';
  options.headers = {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(recordOneBody)
  };

  http.request(options, new requestUtils.configurableCallback().callbackFn).end(recordOneBody);

  options.headers['Content-Length'] = Buffer.byteLength(recordTwoBody);
  http.request(options, new requestUtils.configurableCallback().callbackFn).end(recordTwoBody);

}, 2000);

// Check for updates to the data
setInterval(function()
{

  var dataObjectArray = [];

  for (key in dataCache.data)
  {
    dataObjectArray.push(dataCache.data[key]);
  }

  var body = JSON.stringify(dataObjectArray);

  var options = requestUtils.getBaseRequestOptions();
  options.path += '/operations/checkDataCurrency/';
  options.method = 'POST';
  options.headers = {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body)
  };

  var logger = function(data)
  {
    console.log('Dirty Ids: ' + data)
  };

  http.request(options, new requestUtils.configurableCallback(logger).callbackFn).end(body);

}, 5000);

// Configure sockets
io.sockets.on('connection', function(socket)
{
  io.sockets.send(dataCache.data);
});

server.listen(8000);