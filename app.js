const express = require('express');
const history = require('connect-history-api-fallback');
var server = express();
server.listen(8080);
console.log('http://127.0.0.1:8080'  );
server.use(history({
    verbose: true,
    index: '/'
}));
server.use('/',express.static('static'));



