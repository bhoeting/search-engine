/**
 * Dependencies
 */

var request = require('request');
var cheerio = require('cheerio');
var urlParser = require('url');
var validator = require('validator');

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
  if (validator.isURL(url)) {
    var data = '';
    var start = new Date();
    request.get(url)
      .on('error', function(err) {
        callback(null, url);
      })
      .on('response', function(response) {
        response.on('data', function(html) {
            data += html;
        });
        response.on('end', function(err) {
          time = new Date() - start;
          if (response !== undefined && response.headers['content-type'].indexOf('text/html') != -1) {
            callback(parseHTML(data.toString('utf-8')), url, time);
          } else {
            callback(null, url);
          }
        });
      });
  } else {
    callback(null, url);
  }
};

/**
 * Get all the links, text, and title from a webpage
 *
 * @param  {String} html
 * @return {Object}
 */

function parseHTML(html) {
  var body, title;
  var links = [];

  var $ = cheerio.load(html);

  // Collect all the links on the page
  $('a').each(function() {
    var link = $(this);
    var url = link.attr('href');
    var linkText = link.text();
    if (url !== undefined) {
      var protocol = urlParser.parse(url).protocol;
      if (protocol == 'http:' || protocol == 'https:') {
        links.push({ url: url, text: linkText });
      }
    }
  });

  // Remove style and script tags with their content
  $('script').remove();
  $('style').remove();

  // Remove html tags & entites but keep their content
  body = ($('html').html());

  if (body !== null) {
    body = body.replace(/(<([^>]+)>)/ig, '');
    body = body.replace(/&(?:[a-z\d]+|#\d+|#x[a-f\d]+);/ig, '');
  }

  title = $('title').text();

  return {
    links: links,
    body: body,
    title: title
  };
}
