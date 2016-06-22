var express = require('express');
var btcstats = require('btc-stats');
var http = require('http');
var _ = require('underscore');

var router = express.Router();

// Just show a ticker
router.get('/', function(req, res, next) {
  //if this line isn't specified, it runs the avg function across all exchanges, not just these 3
  btcstats.exchanges(["bitfinex", "bitstamp", "okcoin"]);

  //Example print the average price across 3 exchanges (bitfinex, bitstamp, okcoin)
  btcstats.avg(function(error, resp) {
  	if (!error) {
      res.send(`Average price ${resp.price} across bitfinex, bitstamp and okcoin.`);
  	}
  });
});

router.get('/bitcoin', function(req, res, next) {
  http.get({
    host: 'api.coindesk.com',
    path: '/v1/bpi/historical/close.json'
    },
    function(response) {
      // Continuously update stream with data
      var body = '';
      response.on('data', function(d) { body += d; });
      response.on('end', function() {
        // Data reception is done, do whatever with it!
        var parsed = JSON.parse(body);
        var historicalData = _.map(parsed.bpi, function (value, key) {
          return {
            'date': key,
            'price': value
          }
        });
        historicalData.reverse()
        // res.send(historicalData);
        res.render('history', {historicalData});
        });
      }
);
});

module.exports = router;
