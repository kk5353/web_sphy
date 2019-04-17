const bodyParser = require('body-parser');
const http = require('http');
module.exports = function (server) {



    var app = server;
    app.get('/nodeReq', function (req, res, next) {
        var data = {
            age: 20,
            name: "cici",
            like: "shopping"

        };
        data = require('querystring').stringify(data); //数据以url param格式发送
        data = JSON.stringify(data); //数据以json格式发送
        console.log(data);
        var opt = {
            method: "get",
            host: "www.baidu.com",
            port: 80,
            path: "/",
            headers: {
                //"Content-Type": "application/x-www-form-urlencoded", //for url parameter
                "Content-Type": "application/json", // for json data
                "Content-Length": data.length
            }

        };

        var req = http.request(opt, function (apacheRes) {//建立连接 和 响应回调
            if (apacheRes.statusCode == 200) {
                apacheRes.setEncoding('utf8');
                var body = "";
                apacheRes.on('data', function (recData) { body += recData; });
                apacheRes.on('end', function () { res.send(body); /*发送收到的响应*/ });

            } else {
                res.send(500, "error");

            }

        });
        req.write(data + "\n"); //发送请求
        req.end(); //请求发送完毕

    });
}


    //status(500).send('新增用户失败，数据库插入不成功').end();
    //
    // var data = {
    //     address: 'test@test.com',
    //     subject: "test"
    // };
    //
    // data = require('querystring').stringify(data);
    // console.log(data);
    // var opt = {
    //     method: "POST",
    //     host: "localhost",
    //     port: 8080,
    //     path: "/v1/sendEmail",
    //     headers: {
    //         "Content-Type": 'application/x-www-form-urlencoded',
    //         "Content-Length": data.length
    //     }
    // };
    //
    // var req = http.request(opt, function (serverFeedback) {
    //     if (serverFeedback.statusCode == 200) {
    //         var body = "";
    //         serverFeedback.on('data', function (data) { body += data; })
    //                       .on('end', function () { res.send(200, body); });
    //     }
    //     else {
    //         res.send(500, "error");
    //     }
    // });
    // req.write(data + "\n");
    // req.end();

