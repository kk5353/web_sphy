/**
 * Created by iwang on 2017/1/15.
 */
//express使用的是@4版本的。
var express = require('express');
//form表单需要的中间件。
var mutipart = require('connect-multiparty');

var mutipartMiddeware = mutipart();
// var server = express();
//下面会修改临时文件的储存位置，如过没有会默认储存别的地方，这里不在详细描述,这个修改临时文件储存的位置 我在百度里查找了三四个小时才找到这个方法，不得不说nodejs真难学。
//所以在这里留下我的学习记录，以备以后翻阅。
module.exports = function (server) {


    server.use(mutipart({ uploadDir: './static/upload' }));
    //设置http服务监听的端口号。
    // server.set('port', process.env.PORT || 3060);
    // server.listen(server.get('port'), function () {
    //     console.log("Express started on http://localhost:" + server.get('port'));
    // });
    //浏览器访问localhost会输出一个html文件
    server.get('/file/upload', function (req, res) {
        res.type('text/html');
        res.sendfile('static/upload.html')

    });
    //这里就是接受form表单请求的接口路径，请求方式为post。
    server.post('/upload', mutipartMiddeware, function (req, res) {
        //这里打印可以看到接收到文件的信息。
        console.log(req.files);

        var result = req.files.myfile;

        /*//do something
        * 成功接受到浏览器传来的文件。我们可以在这里写对文件的一系列操作。例如重命名，修改文件储存路径 。等等。 * */
        //给浏览器返回一个成功提示。
        res.send(result);
    });
}