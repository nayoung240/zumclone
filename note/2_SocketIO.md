# 2.0 WebSockets vs SocketIO

## SocketIO
: 실시간, 양방향, event 기반의 통신을 가능하게하는 프레임워크
- WebSocket을 사용한다. WebSocket 연결이 불가능한 경우 HTTP long polling을 사용한다.
- 자동 재연결 ex) wifi가 끊겨도 재연결한다.

<br><br>

# 2.1 SocketIO 설치 후 연결하기

### SocketIO 설치하기
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

<br><br>

# 2.2 SocketIO - 서버 <-> 프론트 양방향 통신

> Socket IO를 이용하면 방에 참가하고  떠나는 것이 매우 간단하다.

### WebSockets
- message라는 이벤트로, 파라미터는 string으로만 전송했어햐 했다. (object의 경우 string으로 변환해야함)

👇👇👇

### SocketIO
- 1. 특정한 이벤트를 emit (=send) 해줄 수 있다.
- 2. object, numbrt, boolean 타입도 파라미터로 전송할 수 있다.
```
socket.emit("enter_room", {payload: input.value}, 5);
```

### 끝날 때 실행되는 function을 보내고 싶으면 꼭 emit함수의 마지막 파라미터로 넣어야 한다.

app.js
```
socket.emit("enter_room", {payload: input.value}, (msg) => {
    console.log(`The Server says: `, msg);
});
```

server.js
> 프론트엔드에서 구현한 함수가 백에서 실행되는게 아니라, 프론트에서 실행되는 것이다.
```
socket.on("enter_room", (roomName, done) => {
    console.log(roomName);
    setTimeout(() => {
        done("server is done!"); // 해당 코드가 실행되면 프론트엔드에서 구현한 함수가 프론트에서 실행된다
    }, 10000);
});
```