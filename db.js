/**
 * Dependencies
 */

var elmongo = require('elmongo');
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

/**
 * Define schema
 */

var LinkSchema = new Schema({
  url: {type: String, unique: true},
  text: {type: String, default: ''},
  indexed: {type: Boolean, default: false},
  occurrences: {type: Number, default: 1}
});

LinkSchema.plugin(elmongo);

/**
 * Create model
 */

var Link = mongoose.model('Link', LinkSchema);

/**
 * Connect
 */

mongoose.connect('mongodb://localhost/links');

module.exports.LinkSchema = LinkSchema;
module.exports.Link = Link;