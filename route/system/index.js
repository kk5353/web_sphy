var returnMeaasge = require('../../libs/returnMessage');
const express = require('express');
const common = require('../../libs/common');

module.exports = function () {
    var router = express.Router();
    //检查登录状态
    router.use((req, res, next) => {
        if (!req.session['user_id'] && req.url != '/login') { //没有登录
            //res.redirect('/user/login');


            // var token=JSON.stringify(req.body);
            //
            // returnMeaasge.data=token;
            //
            // res.status(500).send('returnMeaasge').end;


            next();
        } else {
            next();
        }
    });


    router.get('/test', (req, res) => {

        res.status(500).send('测试接口').end;
    });


    router.use('/getStructure', require('./getStructure')());
    router.use('/heartbeat', require('./heartbeat')());
    router.use('/receiveStructure', require('./receiveStructure')());
    router.use('/voiceToText', require('./voiceToText')());
    router.use('/textToSpeech', require('./textToSpeech')());


    return router;
};
