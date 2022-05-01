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

const handleListen = () => console.log('qqq');
// app.listen(3000, handleListen);

const server = http.createServer(app);
const wss = new WebSocket.Server({server});

server.listen(3000, handleListen);