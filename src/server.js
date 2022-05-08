import express from "express";
import http from "http";
// import WebSocket from "ws";
import SocketIO from "socket.io";

const app = express();

// views 설정
app.set("view engine", "pug");
app.set("views", __dirname + "/views");

// url/public 경로로 가게되면 public 폴더를 보여주기
app.use("/public", express.static(__dirname + "/public"));

// views render
app.get("/", (req, res) => res.render("home"));

// 유저가 어떤 경로로 들어와도 홈(/)으로 보내기
app.get("/*", (req, res) => res.redirect("/"));

const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer);

wsServer.on("connection", (socket) => {
    // 이벤트 리스너
    socket.onAny((event) => {
        console.log(`Socket Event:${event}`);
    })

    socket.on("enter_room", (roomName, done) => {
        socket.join(roomName);
        console.log(socket.rooms); // 기본적으로 User와 서버 사이에 private room이 있다 (socket.id)

        done(); // 해당 코드가 실행되면 프론트엔드에서 구현한 함수가 프론트에서 실행된다
    });
});

// Websocket 구현
/*
const wss = new WebSocket.Server({httpServer});

// 연결된 클라이언트 저장 ex) 다른 브라우저들
const sockets = [];

// 브라우저 새로고침 시 작동
wss.on("connection", (socket) => {
    console.log("connected to Browser");

    sockets.push(socket);

    socket["nickname"] = "Unknown";

    // 브라우저를 종료할 때 실행
    socket.on("close", () => console.log("disconnected from Browser"))

    // 브라우저에서 보낸 메시지
    socket.on("message", (msg) => {
        const message = JSON.parse(msg);

        switch(message.type) {
            case "new_message":
                // 연결된 모든 클라이언트에 메시지 보내기
                sockets.forEach(aSocket => aSocket.send(`${socket.nickname}: ${message.payload}`));;
                break;
            case "nickname":
                socket["nickname"] = message.payload;
                break;
        }
    });
});
*/

httpServer.listen(4000, () => console.log('listening'));