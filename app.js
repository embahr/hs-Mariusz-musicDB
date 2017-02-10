var express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    app = express(),
    db = mongoose.connection,
    port = '3000';

Users = require('./models/users');


// Connect node.js to mongodb
mongoose.connect('mongodb://localhost/hs-mariusz-musicdb');


// Mongoose debugger
mongoose.set('debug', true);









// Set port for server
app.listen(port);
console.log("Server is running on port " + port);
