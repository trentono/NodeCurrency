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

      response.on('end', function()
      {
        if (data && (typeof callOnEnd === 'function'))
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
