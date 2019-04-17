const express = require('express');
const mysql = require('mysql');
const config = require('../../config/config')
var db = mysql.createPool({
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database
});


module.exports = function () {
    var router = express.Router();
    router.get('/', (req, res) => {

        var username = req.body.username;

        var message = {
            'message': '查询成功,功能尚未开发',
            'username': username
        };

        db.query(`SELECT * FROM users WHERE username='${username}'`, (err, data) => {
            if (err) {
                console.error(err);
                res.status(500).send('database error').end();
            } else {
                if (data.length == 0) {
                    res.status(400).send('no this user').end();
                } else {
                    if (data[0].password == password) {
                        //成功
                        req.session['user_id'] = data[0].ID;
                        res.redirect('/');
                    } else {
                        res.status(400).send('this password is incorrect').end();
                    }
                }
            }


        });
        res.status(500).send(message).end;

    });


    return router;
};
