var HeartBeatService = function(app) {
  this.state = null;
  this.instance = null;
  app.get('/heartBeatService', function (req, res) {
      res.end(HeartBeatService.instance.state.toString());
  });
  app.post('/heartBeatService', function (req, res) {
      res.end(HeartBeatService.instance.state.toString());
  });
  //console.log(1);
}
HeartBeatService.prototype = {
  get state() {
      console.log("get:" + this._value)
      return this._value;
  },
  set state(val) {
      this._value = val;
      console.log("set:" + this._value)
  }
}
HeartBeatService.getInstance=function(app)
{
  if(!this.instance){
      this.instance =new HeartBeatService(app);
  }
  return this.instance;
}
HeartBeatService.create=function(app)
{
  //if(!this.instance){
      this.instance =new HeartBeatService(app);
  //}
  return this.instance;
}
module.exports = HeartBeatService;