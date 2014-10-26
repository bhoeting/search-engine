module.exports = LinkQueue;

var LinkIndexer = require('./link-indexer');

/**
 * LinkQueue constructor
 */

function LinkQueue() {
  this.links = [];
  this.indexer = new LinkIndexer();
}

/**
 * Add an item or array of items to the queue
 * @param  {Object} link
 * @return {Number}
 */

LinkQueue.prototype.queue = function(link) {
  this.indexer.index(link);
  return this.links.push(link);
};

/**
 * Add an array of items the queue
 * @param  {Array}  links
 * @return {void}
 */

LinkQueue.prototype.queueArray = function(links) {
  for (var i in links) {
    this.links.push(links[i]);
    this.indexer.index(links[i]);
  }
};

/**
 * Remove the next item in the queue and call a function with it
 * @param  {Function} callback
 * @return {void}
 */

LinkQueue.prototype.next = function(callback) {
  var link = this.links.shift();
  callback(link);
};