var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var linkSchema = new Schema({
  url: {type: String, unique: true},
  text: String,
  indexed: {type: Boolean, default: false},
  occurrences: {type: Number, default: 1}
});

mongoose.model('Link', linkSchema);
mongoose.connect('mongodb://localhost/links');