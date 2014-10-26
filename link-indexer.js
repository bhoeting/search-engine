require('./db');
var mongoose = require('mongoose');
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));

module.exports = LinkIndexer;

/**
 * Constructor
 */

function LinkIndexer() {
  this.Link = mongoose.model('Link');
}

/**
 * Insert a link
 * @param  {Object} link
 * @return {void}
 */

LinkIndexer.prototype.index = function(link) {
  this.Link.collection.update({url: link.url}, {$inc: {occurances: 1}}, function() {});
  new this.Link(link).save(function() {});
};


/**
 * Batch insert links
 * @param  {Array} links
 * @return {void}
 */

LinkIndexer.prototype.indexBatch = function(links) {
  this.Link.collection.insert(links, function(err) {
    if (err) console.log(err);
  });
};