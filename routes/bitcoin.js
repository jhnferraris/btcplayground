var express = require('express');
var http = require('http');
var _ = require('underscore');

var router = express.Router();

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
