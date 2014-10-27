var colors = require('colors');
var Scraper = require('./scraper');
var LinkIndexer = require('./link-indexer');

var scraper = new Scraper();
var indexer = new LinkIndexer();

function transverseTheWeb(index, total) {
  indexer.getNextLink(function(link) {
     scraper.scrape(link.url, function(result, startUrl) {
      if (result !== null) {
        var count = result.links.length;
        total += count;
        console.log('Link index: ' + colors.red(++index) + ' Total links: ' + colors.green.bold(total) + ' ' + colors.cyan.bold(count) + ' links indexed from ' + colors.yellow.italic(startUrl));
        indexer.batchIndex(result.links);
      }
      transverseTheWeb(index, total);
    });   
  });
}

indexer.index({
  url: 'http://www.reddit.com/',
  text: 'The front page of the internet.'
}, function() {
  transverseTheWeb(0, 0);
});


// process.on('uncaughtException', function (err) {
//   console.log(err);
// });