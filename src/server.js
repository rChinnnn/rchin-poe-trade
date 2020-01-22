(
  function () {
    "use strict";
    let express = require('express');
    let app = express();
    const request = require('request');
    const cheerio = require('cheerio');
    const moment = require('moment');
    const bodyParser = require("body-parser");

    // 使用 bodyparser.json() 將 HTTP 請求方法 POST、DELETE、PUT 和 PATCH，放在 HTTP 主體 (body) 發送的參數存放在 req.body
    app.use(bodyParser.urlencoded({
      extended: false
    }));
    app.use(bodyParser.json({
      "limit": "102400kb"
    })); // 提高 post 接收的大小(10MB)

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
      console.log(moment().format('HH:mm:ss'), "Call trade(post) API")
      console.log(req.body.searchJson)

      var options = {
        url: 'https://web.poe.garena.tw/api/trade/search/%E9%8D%8A%E9%AD%94%E8%81%AF%E7%9B%9F',
        method: 'post',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
        },
        json: req.body.searchJson
      }
      request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          console.log(`searchID: ${body.id}, searchTotal: ${body.total}`)
          res.send({id: body.id, total: body.total});
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
