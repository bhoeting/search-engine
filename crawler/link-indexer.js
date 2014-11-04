/**
 * Require the model and mongo connection
 */


/**
 * Dependencies
 */

var mongoose = require('mongoose');
var textSearch = require('mongoose-text-search');

/**
 * Export the LinkIndexer
 */

module.exports = LinkIndexer;

/**
 * LinkIndexer constructor
 */

function LinkIndexer() {
  var LinkSchema = new mongoose.Schema({
    url: {type: String, unique: true},
    text: {type: String, default: ''},
    body: {type: String, default: ''},
    title: {type: String, default: ''},
    indexed: {type: Boolean, default: false},
    occurrences: {type: Number, default: 1}
  });

  LinkSchema.index({text: 'text'});
  LinkSchema.index({body: 'text'});
  LinkSchema.index({title: 'text'});

  LinkSchema.plugin(textSearch);
  this.Link = mongoose.model('Link', LinkSchema);
  mongoose.connect('mongodb://localhost/links');
}

/**
 * Index a link or update its occurrences if it exists
 *
 * @param  {Object} link
 */

LinkIndexer.prototype.index = function(link, callback) {
  this.Link.findOneAndUpdate(link,
    {$inc: {occurrences: 1}, $setOnInsert: {indexed: false}},
      {upsert: true}, function() {
        if (callback !== undefined) callback();
  });
};

/**
 * Index multiple links at once
 *
 * @param  {Array} links
 */

LinkIndexer.prototype.batchIndex = function(links, callback) {
  for (var i in links) {
    this.index(links[i]);
  }

  if (callback !== undefined) callback();
};


/**
 * Update the body and title fields on a link with the matching url
 *
 * @param  {String} url
 * @param  {String} body
 */

LinkIndexer.prototype.indexPageContent = function(url, body, title) {
  this.Link.update({url: url}, {$set: {body: body, title: title}}, function() {});
};

/**
 * Get the first link that hasn't been
 * indexed, mark it as indexed, and 
 * run a callback on the result
 *
 * @param  {Function} callback
 */

LinkIndexer.prototype.getNextLink = function(callback) {
  this.Link.findOneAndUpdate({indexed: false},
    {$set: {indexed: true}}, {new: true}, function(err, link) {
      callback(link);
    });
};

/**
 * Get the amount of links that have been indexed
 * and run a callback on the count
 *
 * @param  {Function} callback
 */

LinkIndexer.prototype.countLinks = function(callback) {
  this.Link.count(function(err, count) {
    callback(count);
  });
};

/**
 * Search to DB for links with text matching a query
 *
 * @param  {String}   query
 * @param  {Function} callback
 */

LinkIndexer.prototype.search = function(query, callback) {
  this.Link.textSearch(query, {filter: {indexed: true}}, function(err, results) {
    if (err) console.log(err);
    callback(results);
  });
};