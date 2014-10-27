/**
 * Dependencies
 */

var colors = require('colors');

/**
 * Log the number of links obtained from
 * a webpage and its respective URL
 *
 * @param {Object} result
 */

var logScrapingResult = function(result, url) {
  console.log(colors.green(result.links.length) +
    ' links scraped from ' + colors.yellow(url));
};

/**
 * Export functions
 */

module.exports.logScrapingResult = logScrapingResult;
