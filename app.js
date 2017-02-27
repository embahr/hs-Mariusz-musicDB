var express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    app = express(),
    db = mongoose.connection,
    port = '3000',
    fMus = [],
    recommendations = {"list": []};

// Middleware
app.use(bodyParser.json());

// Models
Music = require('./models/music');
Users = require('./models/users');

// Connect node.js to mongodb
mongoose.connect('mongodb://develop:project@ds145329.mlab.com:45329/musicdb');

// Mongoose debugger
mongoose.set('debug', true);

// GET current users
app.get('/users', function(req, res) {
  Users.getUsers(function(err, users) {
    if (err) {
      console.log("Unable to retrieve current list of users...");
    }
    res.json(users);
    console.log(users);
  });
});

// POST new follow relationship to user
app.post('/follow', function(req, res) {
  var user = req.body.from,
      toFollow = req.body.to,
      selfIndex = toFollow.indexOf(user), //Check to see if user is trying to follow themself
      following = [],
      followIndex = following.indexOf(toFollow);


// Check if user is trying to follow themself
  if (selfIndex == -1) {
      Users.addFollow(user, {"follows": toFollow}, {new: true, upsert: true}, function(err, result) {
      res.send("You are now following " + toFollow + ".");
      console.log("You are now following " + toFollow + ".");
      });
    } else {
   res.send(user + ", you can't follow yourself!");
   console.log(user +", you can't follow yourself!");
  }
});

// GET music listened to by a specific user
app.get('/listen/:user', function(req, res) {
  var user = req.params.user;
  Users.getUserListens(user, function(err, music) {
    if (err) {
      throw err;
    }
    res.json(music[0].music);
    console.log(req.params);
  });
});

// POST music listened to by user
app.post('/listen', function(req, res) {
  var user = req.body.user,
      music = req.body.music;
  Users.addListen(user, {music: music}, {new: true}, function(err, list) {
    if (err) {
      throw err;
    }
    res.json(list.music);
    console.log(user + " has just listened to " + music);
    console.log(list.music);
  });
});

// GET entire music collection
app.get('/music', function(req, res) {
  Music.getMusic(function(err, music) {
    if (err) {
      throw err;
    }
      res.json(music);
      console.log(music);
  });
});

// GET music recommendations
app.get('/recommendations', function(req, res) {
  var user = req.query.user,
      listens = [],
      follows = [],
      listenTags = [],
      songSuggest = [];
  fMus.length = 0;
  songSuggest.length = 0;
  Users.getRecommends(user, function(err, docs) {
    if (err) {
      throw err;
    }
    // Store music user has listened to, and who they follow.
    listens = docs.music;
    follows = docs.follows;
    // If user is following someone, get music follows have listened to.
    if (follows.length !== 0) {
      Users.getFollowsMusic(follows, function(err, followsMusic) {
        if (err) {
          throw err;
        }
        followsMusic.forEach(function(fmItem, fmIndex, arr) {
          fMus = followsMusic[fmIndex].music;
        });
      });
    }
    // Get tags of songs the user and follows have listened to.
    Music.getTags(listens, fMus, function(err, tags) {
      if (err) {throw err;}
        tags.some(function(r, x) {
          listenTags = tags[x].tags;
          // Get songs that match above tags.
          Music.getSongs(listenTags, function(err, songs) {
            if (err) {
              throw err;
            }
            // Put all suggested songs into an array.
            for (var s = 0; s < songs.length; s++) {
              songSuggest = songSuggest.concat(songs[s].name);
            }
            // Filter out songs user has already listened to.
            newMusic = songSuggest.filter(function (el, i, arr) {
              return listens.indexOf(el) === -1;
            });
            // Populate object with 5 suggestions
            for (var i = 0; i < 5; i++) {
              recommendations.list[i] = newMusic[i];
            }
          });
        });
    });
      return res.json(recommendations);
  });
});

// Set port for server
app.listen(port);
console.log("Server is running on port " + port);
