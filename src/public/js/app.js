// window.location.host == localhost:4000
const socket = new WebSocket(`ws://${window.location.host}`);

// 서버가 시작될 때 실행됨
socket.addEventListener("open", () => {
    console.log("connected to Server");
});

// 서버에서 보낸 메시지
socket.addEventListener("message", (message) => {
    console.log("got from th server: ", message.data);
});

// 서버를 종료할 때 실행됨
socket.addEventListener("close", () => {
    console.log("disconnected from Server");
});

// 서버에 보내는 메시지
setTimeout(() => {
    socket.send("hello from the browser!");
}, 10000);