var LinkIndexer = require('./crawler/link-indexer');
var express = require('express');
var jade = require('jade');
var path = require('path');
var app = express();

app.set('views', path.join( __dirname, 'views'));
app.set('view engine', 'jade');

var indexer = new LinkIndexer();

app.get('/search', function(req, res) {
  var query = req.query.search ? req.query.search : '';
  indexer.search(search, function(results) {
    res.render('index', { results: results });
  });
});

app.listen(3000);
