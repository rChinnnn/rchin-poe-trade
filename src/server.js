(
  function () {
    "use strict";
    let express = require('express');
    let app = express();
    const request = require('request');
    const rp = require('request-promise');
    const cheerio = require('cheerio');
    const moment = require('moment');
    const bodyParser = require("body-parser");

    // 使用 bodyparser.json() 將 HTTP 請求方法 POST、DELETE、PUT 和 PATCH，放在 HTTP 主體 (body) 發送的參數存放在 req.body
    app.use(bodyParser.urlencoded({
      extended: false
    }));
    app.use(bodyParser.json({
      "limit": "102400kb"
    }));

    // API router
    app.get('/', function (req, res) {
      res.send("Hello world! POE Trade is ready!");
    });

    app.post('/tradeTest', function (req, res) {
      console.log(moment().format('HH:mm:ss'), "call tradeTest(post) API")
      console.log(req.body)
      res.send("Congratulations! Trade tool is ready!");
    });

    // post searchJson to garena POE trade API
    app.post('/trade', function (req, res) {
      console.log(moment().format('HH:mm:ss'), "Call trade(post) API", req.body.league)
      console.log(req.body.searchJson)
      req.body.league = encodeURI(req.body.league)
      let fetchID = [] // 儲存得到的 result ID, 10 個 ID 為一組陣列
      let options = {
        url: `https://web.poe.garena.tw/api/trade/search/${req.body.league}`,
        method: 'post',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
        },
        rejectUnauthorized: false,
        requestCert: false,
        agent: false,
        json: req.body.searchJson
      }
      request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          console.log(`searchID: ${body.id}, searchTotal: ${body.total}`)
          body.result.forEach((element, index) => {
            let idx = index <= 9 ? 0 : parseInt((index % 100) / 10)
            if (!Array.isArray(fetchID[idx])) {
              fetchID[idx] = []
            }
            fetchID[idx].push(element)
          });
          res.send({
            id: body.id,
            total: body.total,
            fetchID: fetchID
          });
        } else {
          res.send(error);
          console.log(error)
        }
      });
    });

    let server = app.listen(3031, function () {
      console.log(moment().format('HH:mm:ss'), 'Express server listening on port ' + server.address().port);
    });
    module.exports = app;
  }()
);
