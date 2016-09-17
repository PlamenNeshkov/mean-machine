var express = require('express');
var path = require('path');

var app = express();

app.get('/', function(req, res) {
  var index = path.join(__dirname, 'index.html');
  res.sendFile(index);
});

app.route('/login')
  .get(function(req, res) {
    res.send('This is the login form');
  })
  .post(function(req, res) {
    var msg = 'Processing the login form';
    console.log(msg);
    res.send(msg);
  });

var adminRouter = new express.Router();

adminRouter.use(function(req, res, next) {
  console.log(req.method, req.url);
  next();
});

adminRouter.get('/', function(req, res) {
  res.send('I am the dashboard!');
});

adminRouter.get('/users', function(req, res) {
  res.send('I show all the users!');
});

adminRouter.get('/posts', function(req, res) {
  res.send('I show all the posts!');
});

adminRouter.param('name', function(req, res, next, name) {
  // secure validations :>
  console.log('Doing validations on ' + name);
  req.name = name;
  next();
});

adminRouter.get('/users/:name', function(req, res) {
  var name = req.params.name;
  res.send('hello ' + name + '!');
});

app.use('/admin', adminRouter);

app.listen(3000);

console.log('Server listening at port 3000...');
