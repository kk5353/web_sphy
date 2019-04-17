const express = require('express');
var server = express();
server.listen(8080);
console.log('http://127.0.0.1:8080'  );
server.use('/',express.static('static'));



