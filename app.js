var express = require('express'), app = express(), http = require('http'), server = http.createServer(app), io = require('socket.io').listen(server), fs = require('fs'), extend = require('util')._extend, resource = require('./resource'), requestUtils = require('./request-utils');

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
// Note that we are extending dataCache objects, so the cache remains
// intentionally out of sync with the server
setInterval(function()
{
  var dataObjectOne = extend({}, dataCache.data[Math.floor(Math.random() * 50)]);
  var dataObjectTwo = extend({}, dataCache.data[Math.floor(Math.random() * 50)]);

  var tempData = dataObjectOne.data;
  dataObjectOne.data = dataObjectTwo.data;
  dataObjectTwo.data = tempData;

  var dataObjectOneBody = JSON.stringify(dataObjectOne);
  var dataObjectTwoBody = JSON.stringify(dataObjectTwo);

  var options = requestUtils.getBaseRequestOptions();
  options.path += '/data/';
  options.method = 'PUT';
  options.headers = {
    'Content-Type': 'application/json'
  };

  options.headers['Content-Length'] = Buffer.byteLength(dataObjectOneBody);
  http.request(options, new requestUtils.configurableCallback().callbackFn).end(dataObjectOneBody);

  options.headers['Content-Length'] = Buffer.byteLength(dataObjectTwoBody);
  http.request(options, new requestUtils.configurableCallback().callbackFn).end(dataObjectTwoBody);

}, 2000);

// Poll for updates to the data
setInterval(function()
{

  var dataObjectArray = [];

  for (var key in dataCache.data)
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

  // Define callback function to reload data
  var updateRecords = function(data)
  {
    var dataArray = JSON.parse(data);

    var updateCacheAndNotify = function(data)
    {
      var dataObject = JSON.parse(data);
      dataCache.data[dataObject.id] = dataObject;
      io.sockets.emit('dataCacheUpdate', dataObject);
    }

    for ( var i = 0; i < dataArray.length; i++)
    {
      var options = requestUtils.getBaseRequestOptions();
      options.method = 'GET';
      options.path += "/data/" + dataArray[i];
      http.request(options, new requestUtils.configurableCallback(updateCacheAndNotify).callbackFn).end();
    }
  };

  http.request(options, new requestUtils.configurableCallback(updateRecords).callbackFn).end(body);

}, 5000);

// Pass the current dataCache to each client on connect.
io.sockets.on('connection', function(socket)
{
  io.sockets.emit('init', dataCache.data);
});

server.listen(8000);