var express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    app = express(),
    db = mongoose.connection,
    port = '3000';

    var fMus = [];
    var suggestions = [];

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

   // TO DO: check if user is already following user to be added
   // can't update 'var following' from the callback...
/*
    Users.getFollows(user, function(err, follow) {
      if (err) {
        throw err;
      } else {
          res.json(follow[0].follows);
          console.log(following);
      }
    });
    //console.log(following);
*/

// Check if user is trying to follow themself
  if (selfIndex == -1) {
      // Check if user already follows user to be added
    if (followIndex !== -1) {
      //console.log("You are already following " + toFollow + ".");
    } else {
      Users.addFollow(user, {"follows": toFollow}, {new: true, upsert: true}, function(err, result) {
      res.send("You are now following " + toFollow + ".");
      console.log("You are now following " + toFollow + ".");
      });
    }
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
      uniqueTags = [],
      songSuggest = {"name": []},
      recommendations = {"list": []};

  Users.getRecommends(user, function(err, docs) {
    if (err) {
      throw err;
    }
    listens = docs.music;
    follows = docs.follows;

// GET tags related to listens (docs.music) from user
    Music.getTags(listens, function(err, tags) {
      if (err) {
        throw err;
      }
// Create array from tags
      tags.forEach(function(item,index) {
        listenTags = Array.prototype.concat.apply(listenTags, tags[index].tags);
      });
// Remove duplicate tags
      uniqueTags = listenTags.filter(function(tag, pos, self) {
        return self.indexOf(tag) == pos;
      });
// GET songs that share tags with results of getTags
      Music.getSongs(uniqueTags, function(err, songs) {
        if (err) {
          throw err;
        }
// Object containing songs that share results of getTags
        songs.forEach(function(item, index) {
          songSuggest.name[index] = songs[index].name;
        });
          console.log(listens);
          console.log(songSuggest.name);
// Remove music the user has already listened to
         songSuggest = songSuggest.name;
         recommend = songSuggest.filter(function (a) {
            return listens.indexOf(a) == -1;
          });
// List 5 recommended songs
        for (var i = 0; i < 5; i++) {
          recommendations.list[i] = recommend[i];
        }
          console.log(recommend);
          return res.end(JSON.stringify(recommendations));
      });
    });

    /*
    Users.getFollowsMusic(follows, fMus, function(err, followsMusic) {
      if (err) {
        throw err;
      }
        suggestions = followsMusic.music;
       fMus = Array.prototype.concat.apply(fMus, suggestions);
    return res.end(JSON.stringify(fMus));
      });
      */
  }
  );
});

// Set port for server
app.listen(port);
console.log("Server is running on port " + port);
