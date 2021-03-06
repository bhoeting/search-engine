/**
 * Dependencies
 */

var LinkIndexer = require('./crawler/link-indexer');  
var express = require('express');
var jade = require('jade');
var path = require('path');
var app = express();

var indexer = new LinkIndexer();

/**
 * Configure view engine
 */

app.set('views', path.join( __dirname, 'views'));
app.set('view engine', 'jade');

/**
 * Configure static serving
 */

app.use(express.static(__dirname + '/public'));
app.use('/bower',  express.static(__dirname + '/bower_components'));

/**
 * Render the index with search results
 */

app.get('/search', function(req, res) {
  var search = req.query.search ? req.query.search : '';

  indexer.search(search, function(result) {
    var time = result.stats.timeMicros;
    var results = result.results;
    var numResults = result.stats.nscanned;

    res.render('results', {
      results: results, numResults: numResults, time: time, query: search
    });
  });
});

/**
 * Render the index page
 */

app.get('/', function(req, res) {
  indexer.countLinks(function(count) {
    res.render('index', { numLinks: count });
  });
});

/**
 * Start server
 */

app.listen(3000, function() {
  console.log('Server started on port 3000.');
});
