const mysql = require('mysql');
const config = require('../config/config');
var db = mysql.createPool({
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database,
    port: config.mysql.port
});

module.exports = function (data, callback) {

    var result = {
        'error_code': -1,
        'data': ''
    };
    switch (data.method) {

        case 'insert': {

            console.log("data.length");


            data2 = data;

            // var tableName=data.table;
            // var


            delete data2.table;
            delete data2.data;
            delete data2.method;
            let sqlwhere = '';

            for (var i in data2) {
                if ((typeof value) == "string") {
                    sqlwhere = 'where ' + i + '=`' + data2[i] + '`';
                } else {
                    sqlwhere = 'where ' + i + '=' + data2[i];
                }
            }


            console.log(sqlwhere);
            console.log(data);

            var nums = Object.keys(data.data).length;
            var key = '';
            var value = '';

            for (var i in data.data) {
                console.log(data.data[i] + i);

                key = key + ',' + i;
                value = value + ',' + data.data[i];

            }


            console.log(key + value);

            if ((typeof data.data.fvalue) == "string") {
                var sql = `insert   into ${data.table}  ${data.data.tablefield}='${data.data.fvalue}' where ${data.keyword} =${data.data.keyvalue}`;
            } else {
                var sql = `UPDATE ${data.table}  set  ${data.data.tablefield}=${data.data.fvalue}  where ${data.keyword} =${data.data.keyvalue}`;
            }


            console.log(sql);
            db.query(sql, (err, data) => {
                if (err) {
                    console.error(err);
                    callback(err);
                } else {

                    if (data.length == 0) {
                        return ('数据不存在');
                    } else {
                        console.log(data);
                        result.error_code = 0;
                        result.data = data;
                        callback(result);
                    }
                }

            });
            break;

            //  return "create1";
        }


        case 'update': {

            if ((typeof data.data.fvalue) == "string") {
                var sql = `UPDATE ${data.table}  set  ${data.data.tablefield}='${data.data.fvalue}'  where ${data.keyword} =${data.data.keyvalue}`;
            } else {
                var sql = `UPDATE ${data.table}  set  ${data.data.tablefield}=${data.data.fvalue}  where ${data.keyword} =${data.data.keyvalue}`;
            }


            console.log(sql);
            db.query(sql, (err, data) => {
                if (err) {
                    console.error(err);
                    callback(err);
                } else {

                    if (data.length == 0) {
                        return ('数据不存在');
                    } else {
                        console.log(data);
                        result.error_code = 0;
                        result.data = data;
                        callback(result);
                    }
                }

            });
            break;

            //  return "create1";
        }


        case 'read': {
            var sql = `SELECT * FROM  ${data.table}   WHERE  ${data.keyword} =${data.data}`;
            console.log(sql);
            db.query(sql, (err, data) => {
                if (err) {
                    console.error(err);
                    callback(err);
                } else {

                    if (data.length == 0) {
                        return ('数据不存在');
                    } else {
                        console.log(data);
                        result.data = data;
                        callback(result);
                    }
                }

            });
            break;

            //  return "create1";
        }

        case 'delete': {
            {
                var sql = `delete from  ${data.table}   WHERE  ${data.keyword} =${data.data}`;
                console.log(sql);
                db.query(sql, (err, data) => {
                    if (err) {
                        console.error(err);
                        callback(err);
                    } else {

                        if (data.length == 0) {
                            return ('数据不存在');
                        } else {
                            console.log(data);
                            result.error_code = 0;
                            result.data = data;
                            callback(result);
                        }
                    }

                });
                break;

                //  return "create1";
            }
        }


    }


};






