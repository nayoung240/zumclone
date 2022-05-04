// window.location.host == localhost:4000
const socket = new WebSocket(`ws://${window.location.host}`);
const msgList = document.querySelector("ul");
const msgForm = document.querySelector("form");

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

// 서버에 input 값 보내기
function handleSubmit(e) {
    e.preventDefault();
    const input = msgForm.querySelector("input");
    socket.send(input.value); 
    input.value = ""; // 초기화
}

msgForm.addEventListener("submit", handleSubmit);