const express=require('express');
const mysql=require('mysql');
const jwt=require('jsonwebtoken');
const config=require('../../model/config');
var returnMeaasge=require('../../libs/returnMessage');
var db=mysql.createPool({host: config.mysql.host, user: config.mysql.user, password: config.mysql.password, database: config.mysql.database});
module.exports=function (){
  var router=express.Router();
  router.post('/', (req, res)=>{

    var username=req.body.username;
    var password=req.body.password;



    db.query(`SELECT * FROM users WHERE username='${username}'`, (err, data)=>{
      if(err){
        console.error(err);
        res.status(500).send('database error').end();
      }else{
        if(data.length==0){   //查询无重复名字，可以新增

          db.query(`INSERT INTO users (userName,password) VALUES ('${username}','${password}')`, (err, data)=>
          {
            if(err){
              console.error(err);
              res.status(500).send('新增用户失败，数据库插入不成功').end();
            }

          })

          db.query(`SELECT * FROM users WHERE username='${username}'`, (err, data)=>
          {
            if(err){
              console.error(err);
              res.status(500).send('查询用户失败').end();
            }else {
              // res.status(500).send(data).end();
              //新增用户成功,获取token
              let token = jwt.sign({
                    userid: data.id,
                    username: data.userName,
                  }, config.secret, {
                    expiresIn: config.expires_max,
                  }
              );

              returnMeaasge.result='succeess';
              returnMeaasge.code=0;
              returnMeaasge.data={
                'token':token,
                'userid':data[0].id,
                'username':data[0].userName
              }


              res.status(500).send(returnMeaasge).end();

            }

          })









        }else{

            res.status(400).send('用户名已经被占用').end();

        }
      }
    });



    // res.status(500).send('路333由').end;

  });



  router.post('/a', (req, res)=>{
    var username=req.body.username;
    var password=req.body.password;
    db.query(`SELECT * FROM users WHERE username='${username}'`, (err, data)=>{
      if(err){
        console.error(err);
        res.status(500).send('database error').end();
      }else{
        if(data.length==0){
          res.status(400).send('no this user').end();
        }else{
          if(data[0].password==password){
            //成功
            req.session['user_id']=data[0].ID;
            res.redirect('/');
          }else{
            res.status(400).send('this password is incorrect').end();
          }
        }
      }
    });
  });
  return router;
};
