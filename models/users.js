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

// GET user's follows
module.exports.getFollows = function(user, callback) {
  var query = { user: user };
      Users.find(query, {follows: 1, _id: 0}, callback);
};

// POST new follow relationship to user
module.exports.addFollow = function(user, follow, options, callback) {
  var from = { user: user },
      to = {
        $addToSet: { follows: follow.follows  }
      };
  Users.findOneAndUpdate(from, to, options, callback);
};

// GET music listened to by user
module.exports.getUserListens = function(user, callback) {
  var query = { user: user };
      Users.find(query, {music: 1, _id: 0}, callback);
};

// POST music listened to by user
module.exports.addListen = function(user, hear, options, callback) {
  var query = { user: user },
      lis = {
        $addToSet: { music: hear.music }
      };
    Users.findOneAndUpdate(query, lis, options, callback);
};

module.exports.getRecommends = function(user, callback) {
  var query = { user: user };
// Check if user exists in DB
  Users.findOne({user: { $in: user }}, {user: 1, _id: 0}, function(err, userExists) {
    if (userExists !== null) {
      Users.findOne(query, {music: 1, follows: 1, _id: 0}, callback);
    } else {
        console.log("Sorry, user " + user + " doesn't exist");
      }
  });
};

/*
module.exports.getFollowsMusic = function(user, callback) {
  var query = user;
  query.forEach(function(item, index) {
    console.log(item, index, query);
    Users.findOne({user: item}, {music: 1, _id: 0}, callback);
});
};
*/

module.exports.getFollowsMusic = function(user, tunes, callback) {
  var query = user;
  query.forEach(function(item, index) {
  //  console.log(item, index, query);
    Users.findOneAndUpdate({user: item}, { $addToSet: { reco: tunes.music}}, callback);
  //  console.log(tunes);
});
};
