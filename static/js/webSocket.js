class WebSocketClass {
    constructor(wsUrl) {
        this.successFn = {}  // 成功的回掉函数
        this.wsUrl = wsUrl    // 请求的url
        this.errorCallBackFunArr = [] // 当推送异常时执行的数组
        this.isConnection = false // 判断是否支持weosocket
        this.isErrorCallBack = false
        this.lockReconnect = false // 避免重复连接
        this.ping = null
        this.sendObj = {}
        this.heartCheck()
        this.createWebSocket()
    }

    createWebSocket() {
        try {
            this.webSocket = new WebSocket(this.wsUrl)
            this.initEventHandle()
        } catch (e) {
            this.errorCallBackData()
            this.reconnect(this.wsUrl)
        }
    }

    initEventHandle() {
        this.webSocket.onclose = () => {
            this.errorCallBackData()
            this.reconnect(this.wsUrl)
        }
        this.webSocket.onerror = () => {
            this.errorCallBackData()
            this.reconnect(this.wsUrl)
        }
        this.webSocket.onopen = () => {
            this.isConnection = true
            this.isErrorCallBack = false
            clearInterval(this.ping)
            this.ping = setInterval(() => {
                this.send('{"event": "ping","type":"start","id":"d"}')
            }, 10000)
            // 心跳检测重置
            this.heartCheck.start()
        }
        this.webSocket.onmessage = data => {
            // 如果获取到消息，心跳检测重置
            // 拿到任何消息都说明当前连接是正常的
            this.heartCheck.start()
            this.decodeData(data)
        }
    }

    send(cmd) {
        // 只有当  webSocket.readyState 为 OPEN才发送订阅
        // readyState属性返回实例对象的当前状态，共有四种。
        // CONNECTING：值为0，表示正在连接。
        // OPEN：值为1，表示连接成功，可以通信了。
        // CLOSING：值为2，表示连接正在关闭。
        // CLOSED：值为3，表示连接已经关闭，或者打开连接失败。
        if (!cmd) {
            return
        }
        // this.sendObj[cmd] && (delete clearTimeout(this.sendObj[cmd]))
        if (this.webSocket.readyState === 1) { // 只有当链接打开时才进行订阅
            this.webSocket.send(cmd)
        }
        //  else if (this.webSocket.readyState === 0) { // 如果链接处于正在链接中，则进行延时订阅
        //    this.sendObj[cmd] = setTimeout(() => {
        //       this.send(cmd)
        //   }, 50)
        // }

    }

    reconnect(url) {
        if (this.lockReconnect) {
            return
        }
        this.lockReconnect = true
        // 没连接上会一直重连，设置延迟避免请求过多
        setTimeout(() => {
            this.createWebSocket(url)
            this.lockReconnect = false
        }, 2000)
    }

    errorCallBackData() {
        this.isConnection = false
        if (!this.isErrorCallBack && this.errorCallBackFunArr.length) {
            this.isErrorCallBack = true
            for (let i = 0, len = this.errorCallBackFunArr.length; i < len; i++) {
                if ((typeof this.errorCallBackFunArr[i]) === 'function') {
                    this.errorCallBackFunArr[i]()
                }
            }
        }
    }

    decodeData(data) {
        if (data.data instanceof Blob) {
            let blob = data.data
            // js中的blob没有没有直接读出其数据的方法，通过FileReader来读取相关数据
            let reader = new FileReader()
            reader.readAsArrayBuffer(blob)
            // 当读取操作成功完成时调用.
            reader.onload = (evt) => {
                if (evt.target.readyState === FileReader.DONE) {
                    let result = new Uint8Array(evt.target.result)
                    // 如果后端进行压缩数据处理（zlib），那么要引入解析zlib的js
                    result = (new window.Zlib.RawInflate(result)).decompress()
                    let strResult = ''
                    let length = result.length
                    for (let i = 0; i < length; i++) {
                        strResult += String.fromCharCode(result[i])
                    }
                    this.callBackData(JSON.parse(strResult))
                }
            }
            return
        }
        let d = JSON.parse(data.data)
        // 如果后端需要等待，则返回code：10010，过一段时间后重新订阅
        if (d.code === '10010') {
            let dt = {}
            Object.assign(dt, d)
            delete dt.code
            delete dt.msg
            setTimeout(() => {
                this.send(JSON.stringify(dt))
            }, 2000)
            return
        }
        this.callBackData(JSON.parse(data.data))
    }

    callBackData(data) {
        if (data instanceof Array) {
            for (let i = 0; i < data.length; i++) {
                this.doCallback(data[i])
            }
        } else if (data instanceof Object) {
            if (data.hasOwnProperty('event') && data.event === 'pong') {
                return
            }
            data.payload && (data.payload = JSON.parse(data.payload))
            this.doCallback(data)
        }
    }

    doCallback(data) {
        if (data.event) {
            let fn = this.successFn[data.event]
            if (typeof fn === 'function') {
                fn(data)
            }
        }
    }

    // 心跳检测
    heartCheck() {
        let that = this
        this.heartCheck = {
            timeout: 1000, // 10秒
            timeoutObj: null,
            serverTimeoutObj: null,
            reset: function () {
                clearTimeout(this.timeoutObj)
                clearTimeout(this.serverTimeoutObj)
            },
            start: function () {
                this.reset()
                let self = this
                this.timeoutObj = setTimeout(function () {
                    // 这里发送一个心跳，后端收到后，返回一个心跳消息
                    // onmessage拿到返回的心跳就说明连接正常
                    that.send('{"event": "ping","id":"f"}')
                    self.serverTimeoutObj = setTimeout(function () { // 如果超过一定时间还没重置，说明后端主动断开了
                        // 如果onclose会执行reconnect，我们执行ws.close()就行了.如果直接执行reconnect 会触发onclose导致重连两次
                        that.webSocket.close()
                    }, self.timeout)
                }, this.timeout)
            }
        }
    }
}

function webSocketFn(url) {
    let wb = new WebSocketClass(url)
    return {
        webSocketSend: wb.send.bind(wb),
        errorCallBackFunArr: wb.errorCallBackFunArr,
        successFn: wb.successFn,
        isConnection: function () {
            return wb.isConnection
        },
        getSocketFile(webSocketData, ajaxData) {
            let socketFail = (isFirst) => {
                if (this.isConnection()) {
                    webSocketData()
                } else {
                    ajaxData()
                    setTimeout(socketFail, 2000)
                }
            }
            return socketFail
        }
    }
}