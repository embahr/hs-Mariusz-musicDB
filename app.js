var express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    app = express(),
    db = mongoose.connection,
    port = '3000';

// Middleware
app.use(bodyParser.json());

// Models
Users = require('./models/users');

// Connect node.js to mongodb
mongoose.connect('mongodb://localhost/musicdb');

// Mongoose debugger
mongoose.set('debug', true);

// GET current users
app.get('/users', function(req, res) {
  Users.getUsers(function(err, users) {
    if (err) {
      console.log("Unable to retrieve current list of users...");
    }
    res.json(users);
  });
});

// POST new follow relationship to user
app.post('/follow', function(req, res) {

});

// POST music listened to by user
app.post('/listen', function(req, res) {

});

// GET music recommendations
app.get('/recommendations', function(req, res) {

});

// Set port for server
app.listen(port);
console.log("Server is running on port " + port);
