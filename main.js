var path = require('path');
var url = require('url');
var express = require('express');
var cons = require('consolidate');
var request = require('request');
var cookieParser = require('cookie-parser');

var FeedParser = require('feedparser');
var fs = require('fs');

var app = module.exports = express();

var rootPath = path.dirname(__dirname);
var port = Number(process.env.PORT || 8080);

var flickerFeedEndPoint = 'https://api.flickr.com/services/feeds/photos_public.gne';

app.use(express.static(__dirname + '/app/'));
app.set('views', __dirname + '/app');
app.engine('html', cons.handlebars);
app.set('view engine', 'html');
app.use(cookieParser());


app.get('/', function(req, res) {
    res.render('/app/index.html');
});


app.get('/search/:tags', function(req, res) {
    var potoList = [];

    var tags = req.param("tags");
    var url = flickerFeedEndPoint+'?tags=' + tags;
    var feedparser = new FeedParser();

    searchReq.on('error', function(error) {
       console.error("Unexpected Error thrown "+error);
    });
    searchReq.on('response', function(res) {
        var stream = this;

        if (res.statusCode != 200) return this.emit('error', new Error('Bad status code'));

        stream.pipe(feedparser);
    });

    feedparser.on('error', function(error) {
        console.error("Unexpected Error thrown "+error);
    });
    feedparser.on('readable', function() {
        // This is where the action is!
        var stream = this;
        var meta = this.meta // **NOTE** the "meta" is always available in the context of the feedparser instance
            ,
            item;

        while (item = stream.read()) {
            //    console.log(item);
            var feed = {
                'title': item.title,
                'dis': item.description
            };
            potoList.push(feed);
        }
        // res.send(potoList);
    });

    feedparser.on('end', function() {
        res.send(potoList);
    });

});


app.get('/feeds', function(req, res) {
    var potoList = [];

    var url = flickerFeedEndPoint;

    var req = request(url);
    var feedparser = new FeedParser();

    req.on('error', function(error) {
        // handle any request errors
    });
    req.on('response', function(res) {
        var stream = this;

        if (res.statusCode != 200) return this.emit('error', new Error('Bad status code'));

        stream.pipe(feedparser);
    });

    feedparser.on('error', function(error) {
          console.error("Unexpected Error thrown "+error);
    });
    feedparser.on('readable', function() {
        // This is where the action is!
        var stream = this,
            meta = this.meta ,item;

        while (item = stream.read()) {
            // /  console.log(item);
            var feed = {
                'title': item.title,
                'dis': item.description
            };
            potoList.push(feed);
        }
        // res.send(potoList);
    });

    feedparser.on('end', function() {
        res.send(potoList);
    });

});

app.use(function(req, res) {
    res.redirect('/');
});

app.listen(port, function() {
    console.log('Server listening on port ' + port);
});

