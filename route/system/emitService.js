const express = require('express');
const static = require('express-static');
const bodyParser = require('body-parser');
const multer = require('multer');
const multerObj = multer({dest: './static/upload'});
const mysql = require('mysql');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const consolidate = require('consolidate');
const expressRoute = require('express-route');

module.exports = function (io) {
    // 分发user模块，比如用户的注册和登录请求业务逻辑将会在/api/user.js中实现

    io.on('connection', function (socket) {
        
        //接收并处理客户端的hi事件
        socket.on('hi', function (data) {
            console.log(data);

            //触发客户端事件c_hi
            socket.join(data.roomId);
            io.sockets.in(data.roomId).emit('c_hi', 'hel000l!');


            socket.emit('c_hi', 'hello too!')
        });

        //断开事件
        socket.on('disconnect', function (data) {
            console.log('断s开', data)
            socket.emit('news', '离开');
            //socket.broadcast用于向整个网络广播(除自己之外)
            //socket.broadcast.emit('c_leave','某某人离开了')
        })


    });

};