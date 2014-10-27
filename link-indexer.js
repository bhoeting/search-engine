require('./db');
var mongoose = require('mongoose');

module.exports = LinkIndexer;

/**
 * Constructor
 */

function LinkIndexer() {
  this.Link = mongoose.model('Link');
}

/**
 * Insert a link or update its occurrence
 * @param  {Object} link
 * @return {void}
 */

LinkIndexer.prototype.index = function(link, callback) {
  this.Link.findOneAndUpdate(link, {$inc: {occurrences: 1}, $setOnInsert: {indexed: false}}, {upsert: true}, function() {
    if (callback !== undefined) callback();
  });
};

/**
 * Batch insert links
 * @param  {Array} links
 * @return {void}
 */

LinkIndexer.prototype.batchIndex = function(links, callback) {
  for (var i in links) {
    this.index(links[i]);
  }

  if (callback !== undefined) callback();
};

/**
 * Get the first link that hasn't been indexed
 * @return {Object}
 */

LinkIndexer.prototype.getNextLink = function(callback) {
  this.Link.findOneAndUpdate(
    {indexed: false}, {$set: {indexed: true}}, {new: true}, function(err, link) {
      if (err) {
        console.log(err);
      } else {
        callback(link);
      }
    });
};