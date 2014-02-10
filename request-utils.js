module.exports = {

  configurableCallback: function(callOnEnd)
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
          console.log("No handler for response data");
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
  },
  getBaseRequestOptions: function()
  {
    var baseRequestOptions = {
      host: 'localhost',
      path: '/trimBatchWeb/dataCurrency',
      port: '8080'
    };
    return baseRequestOptions;
  }

}
