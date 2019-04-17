const express=require('express');
const mysql=require('mysql');
var db=mysql.createPool({host: 'localhost', user: 'root', password: 'root', database: 'web'});
module.exports=function (){
  var router=express.Router();
  router.get('/', (req, res)=>{
    res.status(500).send('路333由').end;

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
