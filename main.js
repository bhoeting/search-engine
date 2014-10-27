var colors = require('colors');
var Scraper = require('./scraper');
var LinkIndexer = require('./link-indexer');

var scraper = new Scraper();
var indexer = new LinkIndexer();

function transverseTheWeb(index, total) {
  indexer.getNextLink(function(link) {
    scraper.scrape(link.url, function(result, startUrl) {
      if (result !== null) {
        console.log(colors.green('%d') + ' links indexed from ' + colors.yellow('%s'), result.links.length, startUrl);
        indexer.batchIndex(result.links, function() {
          transverseTheWeb(index, total);
        });
      }
    });
  });
}

transverseTheWeb(0, 0);

// indexer.index({
//   url: 'http://www.cnn.com/',
//   text: 'The front page of the internet.'
// }, function() {
//   transverseTheWeb(0, 0);
// });


// process.on('uncaughtException', function (err) {
//   console.log(err);
// });