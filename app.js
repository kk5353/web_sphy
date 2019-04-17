const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const config = require('./config/config');
const path = require('path')
//API接口服务
var server = express();
server.listen(config.API_Port);
console.log('http://127.0.0.1:' + config.API_Port);
server.use('/',express.static('static'));



