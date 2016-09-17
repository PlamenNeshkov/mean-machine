var express = require('express');
var path = require('path');

var app = express();

var publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

app.get('*', function(req, res) {
  var index = path.join(__dirname, 'public/views/index.html');
  res.sendFile(index);
});

app.listen(3000);
console.log('Server started at port 3000');
