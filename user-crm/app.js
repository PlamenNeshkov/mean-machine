var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var config = require('./config');

mongoose.connect(config.database);

var app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers',
                'X-Requested-With, Content-Type, Authorization');
  next();
});

app.use(morgan('dev'));

var apiRoutes = require('./app/routes/api');
app.use('/api', apiRoutes);

app.get('*', function(req, res) {
  var angular = path.join(__dirname, '/public/app/views/index.html');
  res.sendFile(angular);
});

app.listen(config.port);
console.log('Server started on port ' + config.port);
