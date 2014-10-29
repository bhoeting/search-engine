/**
 * Dependencies
 */

var colors = require('colors');
var sprintf = require('sprintf-js').sprintf;

/**
 * Log the number of links obtained from
 * a webpage and its respective URL
 *
 * @param {Object} result
 */

var logScrapingResult = function(result, url) {
  var spaces, space = '';

  if (url.length > 90) {
    url = url.slice(0, 86);
    url += '...';
  }

  spaces = 4 - (String(result.links.length)).length;
 
  for (var i = 1; i <= spaces; ++i) {
    space += ' ';
  }

  console.log(sprintf('%s%s links scraped from %s',
    space, colors.green(result.links.length),
      colors.italic.yellow(url)));
};

/**
 * Export functions
 */

module.exports.logScrapingResult = logScrapingResult;
