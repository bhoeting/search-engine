var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var linkSchema = new Schema({
  url: {type: String, unique: true},
  body: {type: String, default: ''},
  text: {type: String, default: ''},
  title: {type: String, default: ''},
  indexed: {type: Boolean, default: false},
  occurrences: {type: Number, default: 1}
});

mongoose.model('Link', linkSchema);
mongoose.connect('mongodb://localhost/links');