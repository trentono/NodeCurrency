var fs = require('fs');

module.exports = {

  add: function(app, path, file)
  {
    app.get(path, function(req, res)
    {
      fs.readFile(file, function(err, data)
      {
        res.writeHead(200, {
          'Content-Type': 'text/html',
          'Content-Length': data.length
        });
        res.write(data);
        res.end();
      });
    });
  }

}
