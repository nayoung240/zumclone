import express from "express";
import http from "http";
import WebSocket from "ws";

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

const server = http.createServer(app);
const wss = new WebSocket.Server({server});

// 연결된 클라이언트 저장 ex) 다른 브라우저들
const sockets = [];

// 브라우저 새로고침 시 작동
wss.on("connection", (socket) => {
    console.log("connected to Browser");

    sockets.push(socket);

    // 브라우저를 종료할 때 실행
    socket.on("close", () => console.log("disconnected from Browser"))

    // 브라우저에서 보낸 메시지
    socket.on("message", (message) => {
        // 연결된 모든 클라이언트에 메시지 보내기
        sockets.forEach(aSocket => aSocket.send(message.toString()));;
    });
});

server.listen(5000, () => console.log('listening'));