const express = require('express');
const mysql = require('mysql');

const mysql_curd = require('../../libs/mysql_curd');
const config = require('../../config/config')
var db = mysql.createPool({
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database,
    port: config.mysql.port
});
module.exports = function () {
    var router = express.Router();
    router.post('/', (req, res) => {

        var username = req.body.username;
        var password = req.body.password;


        //read delete
        // var data = {
        //   'method': 'delete',
        //   'table': 'users',
        //   'keyword':'id',
        //   'data': 1
        // };

//update
//         var data = {
//             'method': 'update',
//             'table': 'users',
//             'keyword': 'id',
//             'data': {
//                 'keyvalue': '4',
//                 'tablefield': 'location',
//                 'fvalue': 1
//             }
//         };


//insert
        var data = {
            'method': 'insert',
            'table': 'users',
            'username': '1',
            'datas': {
                'age': 34,
                'location': 'dfdfdfdf'
            }
        };






        mysql_curd(data, (result) => {
            if (result) {
                res.status(500).send(result).end();
            }
            console.log(result);

        });


        // res.status(500).send(mysql_curd('read', 'users', 1)).end();

        // db.query(`SELECT * FROM users WHERE username='${username}'`, (err, data) => {
        //   if (err) {
        //     console.error(err);
        //     res.status(500).send('database error').end();
        //   } else {
        //     if (data.length == 0) {
        //       res.status(400).send('no this user').end();
        //     } else {
        //       if (data[0].password == password) {
        //         //成功
        //         req.session['user_id'] = data[0].ID;
        //
        //
        //
        //
        //
        //         // res.status(500).send('登陆成功').end();
        //
        //
        //
        //
        //
        //
        //
        //
        //       } else {
        //         res.status(400).send('账号密码有误').end();
        //       }
        //     }
        //   }
        // });


        // res.status(500).send('路333由').end;

    });


    router.post('/a', (req, res) => {
        var username = req.body.username;
        var password = req.body.password;
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
    });
    return router;
};
