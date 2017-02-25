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
module.exports.getTags = function(songs, fSongs, callback) {
  Music.find({$or : [{ name: {$in: songs}}, { name: {$in: fSongs}}]}, {tags: 1, _id: 0}, callback);
//  console.log('***Songs the user has listened to: ' + songs);
};

// GET songs that share tags with results of getTags
module.exports.getSongs = function(tags, callback) {
  // Search DB for songs that contain both tags, then songs that contain either tag.
    Music.find({ $or : [
      { $and : [ { tags : {$in: [tags[0]]} }, { tags : {$in: [tags[1]] }} ] },
      { $or : [ { tags : { $in: [tags[0]]} }, { tags : { $in: [tags[1]]}} ] }
    ]} , {name: 1, tags: 1, _id: 0}, callback).sort({ tags: -1});
// console.log('***Tags of the songs the user has listened to: ' + tags);
};
