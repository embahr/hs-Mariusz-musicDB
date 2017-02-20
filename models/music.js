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
  Music.find({ name: {$in: songs}}, {tags: 1, _id: 0}, callback);
//  console.log('***Songs the user has listened to: ' + songs);
};

// GET songs that share tags with results of getTags
module.exports.getSongs = function(tags, tags2, callback) {
  tags.every(function(tagCheck, ch) {
    Music.find({ $or : [
      { $and : [ { tags : {$in: [tags[ch]]} }, { tags : {$in: [tags2[ch]] }} ] },
      { $or : [ { tags : { $in: [tags[ch]]} }, { tags : { $in: [tags2[ch]]}} ] }
    ]} , {name: 1, tags: 1, _id: 0}, callback).sort({ tags: -1});
    console.log(tags);
  });
//console.log('***Tags of the songs the user has listened to: ' + tags);
};
