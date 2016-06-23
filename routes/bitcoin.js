var express = require('express');
var http = require('http');
var _ = require('underscore');

var router = express.Router();

function formatHistoricalData(historicalData) {
  var formattedHistoricalData = _.map(historicalData, function (value, key) {
    return {
      'date': key,
      'price': value
    }
  });

  // This is a 5 day MA
  var movingAverages = simpleMovingAverage(formattedHistoricalData);
  // console.log(movingAverages);
  var ret = [];
  var index = 0;
  formattedHistoricalData.forEach( function (data, key) {
    var item = null;
    if (key >= 4) {
      item = {
        'date': data.date,
        'price': data.price,
        'sma': movingAverages[index]
      };
      index++;
    } else {
      item = {
        'date': data.date,
        'price': data.price,
      };
    }

    ret.push(item);
  });
  return ret;
}

// Source: http://jsfiddle.net/plmrry/ktLtN/
function simpleMovingAverage(data) {
  var priceData = _.pluck(data, 'price');
  var numberOfPeriods = 5;
  var movingAverage = priceData.map(function(each, index, array) {;
    var to = index + numberOfPeriods - 1;
    var subSeq, sum;
    if (to < priceData.length) {
      subSeq = array.slice(index, to + 1);
      console.log(subSeq);
      sum =  _.reduce(subSeq, function(memo, num){ return memo + num; }, 0);
      console.log(sum);
      return (sum / numberOfPeriods);
      }
      return undefined;
    });

  return movingAverage
}

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
        var historicalData = formatHistoricalData(parsed.bpi);
        // res.send(historicalData);
        res.render('history', {historicalData});
        });
      }
);
});

module.exports = router;
