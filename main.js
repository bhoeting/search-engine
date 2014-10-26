var colors = require('colors');
var Scraper = require('./scraper');
var LinkQueue = require('./link-queue');

var links = new LinkQueue();
var scraper = new Scraper();

function transverseTheWeb(index, total) {
  links.next(function(link) {
     scraper.scrape(link.url, function(result, startUrl) {
      if (result !== null) {
        var count = result.links.length;
        total += count;
        console.log('Link index: ' + colors.red(++index) + ' Total links: ' + colors.green.bold(total) + ' ' + colors.cyan.bold(count) + ' links indexed from ' + colors.yellow.italic(startUrl));
        links.queueArray(result.links);
      } else {
        console.log('Ignored ' + colors.red.italic(startUrl));
      }
      transverseTheWeb(index, total);
    });   
  });
}

links.queue({url: 'http://www.reddit.com/', text: 'The front page of the internet.'});
transverseTheWeb(0, 0);