/**
 * Dependencies
 */

var colors = require('colors');
var sprintf = require('sprintf-js').sprintf;

/**
 * Constants
 */

var MAX_URL_LEN = 70;

/**
 * Log the number of links obtained from
 * a webpage and its respective URL
 *
 * @param {Object} result
 */

var logScrapingResult = function(result, url, time) {

  var strUrl = trimUrl(String(url));
  var strTime = numberWithSpaces(String(time) + 'ms', 7);
  var strNumLinks = numberWithSpaces(String(result.links.length), 4);

  console.log(sprintf('%s %s links scraped from %s',
    colors.italic.cyan(strTime), colors.green(strNumLinks),
      colors.italic.yellow(strUrl)));
};

/**
 * Get a string of spaces
 *
 * @param  {String} str 
 * @param  {Number} maxLength
 * @return {String}
 */

function numberWithSpaces(str, maxLength) {
  var numSpaces = maxLength - str.length;
  var spaces = '';
 
  for (var i = 1; i <= numSpaces; ++i) spaces += ' ';

  return str + spaces;
}

/**
 * Trim the url to MAX_URL_LEN and add an ellipsis
 *
 * @param  {String} url
 * @return {String}
 */

function trimUrl(url) {
  var trimmedUrl = url;

  if (url.length > MAX_URL_LEN) {
    trimmedUrl = trimmedUrl.slice(0, MAX_URL_LEN);
    trimmedUrl += '...';
  }

  return trimmedUrl;
}

/**
 * Export functions
 */

module.exports.logScrapingResult = logScrapingResult;
