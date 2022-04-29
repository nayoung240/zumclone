import express from "express";

const app = express();

// views 설정
app.set("view engine", "pug");
app.set("views", __dirname + "/views");

// url/public 경로로 가게되면 public 폴더를 보여주기
app.use("/public", express.static(__dirname + "/public"));

// views render
app.get("/", (req, res) => res.render("home"));

const handleListen = () => console.log('qqq');
app.listen(3000, handleListen);