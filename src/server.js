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

    app.post('/trade', function (req, res) {
      console.log(moment().format('HH:mm:ss'), "call trade(post) API")
      console.log(req.body)
      res.send("post API is ready!");
    });

    let server = app.listen(3031, function () {
      console.log(moment().format('HH:mm:ss'), 'Express server listening on port ' + server.address().port);
    });
    module.exports = app;
  }()
);
