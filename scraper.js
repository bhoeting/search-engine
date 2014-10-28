/**
 * Dependencies
 */

var request = require('request');
var cheerio = require('cheerio');

/**
 * Export the Scraper
 */

module.exports = Scraper;

/**
 * Scraper Constructor
 */

function Scraper() {

}

/**
 * Return all the urls and text from a webpage
 *
 * @param  {String}   startUrl
 * @param  {Function} callback
 */

Scraper.prototype.scrape = function(url, callback) {
  var data = '';
  request.get(url)
    .on('error', function(err) {
      callback(null, url);
    })
    .on('response', function(response) {
      response.on('data', function(html) {
          data += html;
      });
      response.on('end', function(err) {
        if (response.headers['content-type'].indexOf('text/html') != -1) {
          callback(parseHTML(data.toString('utf-8')), url);
        } else {
          callback(null, url);
        }
      });
    });
};

/**
 * Get all the links and text from an HTML string
 *
 * @param  {String} html
 * @return {Object}
 */

function parseHTML(html) {
  var text = '';
  var links = [];

  var $ = cheerio.load(html);

  // Collect all the links on the page
  $('a').each(function() {
    var link = $(this);
    var url = link.attr('href');
    var linkText = link.text();
    if (url !== undefined && url.indexOf('http') === 0) {
      links.push({url: url, text: linkText, indexed: false});
    }
  });

  // Remove style and script tags with their content
  $('script').remove();
  $('style').remove();

  // Remove html tags & entites but keep their content
  text = ($('html').html())
    .replace(/(<([^>]+)>)/ig, '')
    .replace(/&(?:[a-z\d]+|#\d+|#x[a-f\d]+);/ig, '');

  return {links: links, text: text};
}
