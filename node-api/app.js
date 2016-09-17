var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');

var port = process.env.PORT || 3000;
var secret = 'supersecretysecretsecret';
mongoose.connect('mongodb://localhost:27017/node-api');
var User = require('./app/models/user');

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

app.get('/', function(req, res) {
  res.send('Welcome to the homepage!');
});

var apiRouter = new express.Router();

apiRouter.get('/', function(req, res) {
  res.json({message: 'Welcome to the API!'});
});

apiRouter.post('/authenticate', function(req, res) {
  User.findOne({
    username: req.body.username
  }).select('name username password').exec(function(err, user) {
    if (err) {
      throw err;
    }
    if (user) {
      var validPassword = user.comparePassword(req.body.password);
      if (validPassword) {
        var token = jwt.sign({
          name: user.name,
          username: user.username
        }, secret, {
          expiresIn: '24h'
        });

        res.json({
          success: true,
          message: 'Enjoy your token!',
          token: token
        });
      } else {
        res.json({
          success: false,
          message: 'Authentication failed. Wrong password.'
        });
      }
    } else {
      res.json({
        sucess: false,
        message: 'Authentication failed. User not found.'
      });
    }
  });
});

apiRouter.use(function(req, res, next) {
  var token = req.body.token ||
    req.query.token ||
    req.headers['x-access-token'];
  if (token) {
    jwt.verify(token, secret, function(err, decoded) {
      if (err) {
        return res.status(403).json({
          success: false,
          message: 'Failed to authenticate token'
        });
      }
      req.decoded = decoded;
      next();
    });
  } else {
    res.status(403).json({
      success: false,
      message: 'No token provided'
    });
  }
});

apiRouter.route('/users')
  .post(function(req, res) {
    var user = new User();

    user.name = req.body.name;
    user.username = req.body.username;
    user.password = req.body.password;

    user.save(function(err) {
      if (err) {
        if (err.code === 11000) {
          return res.json({
            success: false,
            message: 'A user with that username already exists'
          });
        }
      }
      res.json({message: 'User created!'});
    });
  })
  .get(function(req, res) {
    User.find(function(err, users) {
      if (err) {
        res.send(err);
      }
      res.json(users);
      return users;
    });
  });

apiRouter.route('/users/:user_id')
  .get(function(req, res) {
    User.findById(req.params.user_id, function(err, user) {
      if (err) {
        res.send(err);
      }
      res.json(user);
    });
  })
  .put(function(req, res) {
    User.findById(req.params.user_id, function(err, user) {
      if (err) {
        res.send(err);
      }
      if (req.body.name) {
        user.name = req.body.name;
      }
      if (req.body.username) {
        user.username = req.body.username;
      }
      if (req.body.password) {
        user.password = req.body.password;
      }

      user.save(function(err) {
        if (err) {
          res.send(err);
        }
        res.json({message: 'User updated!'});
      });
    });
  })
  .delete(function(req, res) {
    User.remove({
      _id: req.params.user_id
    }, function(err, user) {
      if (err) {
        res.send(err);
      }
      res.json({message: 'Successfully deleted'});
    });
  });

apiRouter.get('/me', function(req, res) {
  res.send(req.decoded);
});

app.use('/api', apiRouter);

app.listen(port);
console.log('Server started on port ' + port);
