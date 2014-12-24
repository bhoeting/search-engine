/**
 * Dependencies 
 */

var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var logger = require('./logger');
var Scraper = require('./scraper');
var LinkIndexer = require('./link-indexer');

var scraper = new Scraper();
var indexer = new LinkIndexer();

/**
 * Recursively scrape a webpage and index all of its links
 */

function transverseTheWeb() {
  indexer.getNextLink(function(link) {
    scraper.scrape(link.url, function(result, url, time) {
      if (result !== null) {
        indexer.indexPageContent(url, result.body, result.title);
        logger.logScrapingResult(result, url, time);
        indexer.batchIndex(result.links, function() {
          transverseTheWeb();
          indexer.countLinks(function(count) {
            io.emit('count', { count: count });
          });
        });
      } else {
        transverseTheWeb();
      }
    });
  });
}

server.listen(3001);

io.on('connection', function(socket) {
  transverseTheWeb();
});

// If no links are indexed, start at reddit
// indexer.countLinks(function(count) {
//   if (count <= 0) {
//     indexer.index({
//       url: 'http://www.reddit.com/',
//       title: 'The front page of the internet.'
//     }, function() {
//       transverseTheWeb();
//     });
//   } else {
//     transverseTheWeb();
//   }
// });

