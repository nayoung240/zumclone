# 2.0 WebSockets vs SocketIO

### SocketIO
: 실시간, 양방향, event 기반의 통신을 가능하게하는 프레임워크
- WebSocket을 사용한다. WebSocket 연결이 불가능한 경우 HTTP long polling을 사용한다.
- 자동 재연결 ex) wifi가 끊겨도 재연결한다.


### SocketIO 설치 후 연결하기
```
npm i socket.io
```

### 브라우저에 SocketIO 설치되어 있어서 back-end Socket.io와 연결해서 사용 가능하다.
```
script(src="/socket.io/socket.io.js")
```

### http 위에 소켓서버 띄우기
```
const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer);
```

### front 소켓과 연결하기
```
wsServer.on("connection", socket => {
    console.log(socket);
});
```