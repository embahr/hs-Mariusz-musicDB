var mongoose = require('mongoose');

// Users Schema
var usersSchema = mongoose.Schema({
  user:{
    type: String,
    required: true
  },
  follows:{
    type: Array,
    required: true
  },
  music:{
    type: Array,
    required: true
  },
  create_date:{
    type: Date,
    default: Date.now,
    required: false
  }
});

// Create Users model
var Users = mongoose.model('Users', usersSchema);

// GET current users
module.exports.getUsers = function(callback) {
  Users.find(callback);
};
