import express from "express";
import http from "http";
// import WebSocket from "ws";
import {Server} from "socket.io";
import {instrument} from "@socket.io/admin-ui";

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
const wsServer = new Server(httpServer, {
    cors: {
        origin: ["https://admin.socket.io"],
        credentials: true
    }
});

instrument(wsServer, {
    auth: false
});

// socket id들을 가져와서 public room과 private room을 구분하기
function publicRooms() {
    const publicRooms = [];

    const {
        sockets: {
            adapter: {sids, rooms}, 
        }, 
    } = wsServer;

    rooms.forEach((_, key) => {
        // socket id와 동일하지 않는 room이면 채팅방이다.
        if(sids.get(key) === undefined) {
            publicRooms.push(key);
        }
    });

    return publicRooms;
}

function countRoom(roomName) {
    return wsServer.sockets.adapter.rooms.get(roomName)?.size;
}

wsServer.on("connection", (socket) => {
    socket["nickname"] = "unknown";

    // 이벤트 리스너
    socket.onAny((event) => {
        console.log(`Socket Event:${event}`);
    })

    // 클라이언트가 방에 들어왔을 때
    socket.on("enter_room", (roomName, done) => {
        socket.join(roomName);
        console.log(socket.rooms); // 기본적으로 User와 서버 사이에 private room이 있다 (socket.id)

        done(); // 해당 코드가 실행되면 프론트엔드에서 구현한 함수가 프론트에서 실행된다

        // 본인 소켓 외의 모든 room에 메시지 보내기
        socket.to(roomName).emit("welcome", `${socket.nickname}님이 들어왔습니다!`, countRoom(roomName));

        // room이 생겼을 때 모든 소켓에 메시지 보내기
        wsServer.sockets.emit("room_change", publicRooms());
    });

    // 클라이언트(소켓)가 서버와 연결이 끊기기 직전에
    socket.on("disconnecting", () => {
        socket.rooms.forEach((room) => {
            socket.to(room).emit("bye", `${socket.nickname}님이 나갔습니다!`, countRoom(room)-1);
        });
    });

    // 클라이언트가 서버와 연결이 끊겼을 때
    socket.on("disconnect", () => {
        // room이 사라졌을 때 모든 소켓에 메시지 보내기
        wsServer.sockets.emit("room_change", publicRooms());
    });

    socket.on("new_message", (msg, roomName, done) => {
        socket.to(roomName).emit("new_message", `${socket.nickname}: ${msg}`);

        done();
    });

    socket.on("nickname", (nick) => {
        socket["nickname"] = nick;
    });

    socket.on("offer", (offer, roomName) => {
        socket.to(roomName).emit("offer", offer);
    });

    socket.on("answer", (answer, roomName) => {
        socket.to(roomName).emit("answer", answer);
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