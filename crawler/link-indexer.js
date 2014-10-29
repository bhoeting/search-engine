/**
 * Require the model and mongo connection
 */

require('./db');

/**
 * Dependencies
 */

var mongoose = require('mongoose');

/**
 * Export the LinkIndexer
 */

module.exports = LinkIndexer;

/**
 * LinkIndexer constructor
 */

function LinkIndexer() {
  this.Link = mongoose.model('Link');
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
  this.Link.find({text: new RegExp(query)}, function(err, links) {   
    callback(links);
  });
};