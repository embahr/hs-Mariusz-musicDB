var mongoose = require('mongoose');

var musicSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  tags: {
    type: Array,
    required: true
  }
});

// Create Musics model
var Musics = module.exports = mongoose.model('Music', musicSchema);

// GET entire music collection
module.exports.getMusic = function(callback) {
  Music.find({}, {name: 1, tags: 1, _id: 0}, callback);
};

// GET tags related to listens (docs.music) from user
module.exports.getTags = function(songs, callback) {
  Music.find({ name: {$in: songs}}, {name: 1, tags: 1, _id: 0}, callback);
  console.log('***Songs the user has listened to: ' + songs);
};

// GET songs that share tags with results of getTags
module.exports.getSongs = function(tags, callback) {
  Music.find({ tags: {$in: tags}}, {name: 1, tags: 1, _id: 0}, callback);
  console.log('***Tags of the songs the user has listened to: ' + tags);
};
