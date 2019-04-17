const msg = document.querySelector("#message")
let ws, _getTimer
// 整个站点只要创建一次websocket链接，不同的数据源进行多次订阅即可
ws = new webSocketFn("ws://127.0.0.1:991")
// 注册异常调用函数，每个订阅要有一个异常处理函数
let webSocketData = () => { ws.webSocketSend('{"event": "getData"}') }
let ajaxData = () => {
   // 接口请求
   console.log(777)
}
let fail = ws.getSocketFile(webSocketData, ajaxData)
ws.errorCallBackFunArr.push(fail)
// 注册成功的回掉，每个订阅对应的要注册一个回掉
ws.successFn['getData'] = (data) => {
   data && (msg.innerHTML = data.dt.num)
 }
let firstSend = () => {
   if (ws.isConnection()) {
       webSocketData()
     } else {
        // 第一次请求可能websocket还没有链接，过200毫秒再试一次
        ajaxData()
        setTimeout(webSocketData, 200) 
     }
}
firstSend()