// window.location.host == localhost:4000
const socket = new WebSocket(`ws://${window.location.host}`);
const msgList = document.querySelector("ul");
const msgForm = document.querySelector("#msg");
const nickForm = document.querySelector("#nick");

// 서버가 시작될 때 실행됨
socket.addEventListener("open", () => {
    const li = document.createElement("li");
    li.innerText = "connected to Chat Server";
    msgList.append(li);
});

// 서버에서 보낸 메시지
socket.addEventListener("message", (message) => {
    console.log("got from th server: ", message.data);

    const li = document.createElement("li");
    li.innerText = message.data;
    msgList.append(li);
});

// 서버를 종료할 때 실행됨
socket.addEventListener("close", () => {
    const li = document.createElement("li");
    li.innerText = "disconnected from Chat Server";
    msgList.append(li);
});

// 메시지를 json 형식으로 바꾸기
function makeMsg(type, payload) {
    const msg = {type, payload};
    return JSON.stringify(msg);
}

// 서버에 input 값 보내기
function handleSubmit(e) {
    e.preventDefault();
    const input = msgForm.querySelector("input");
    socket.send(makeMsg("new_message", input.value)); 

    const li = document.createElement("li");
    li.innerText = `You: ${input.value}`;
    messageList.append(li);

    input.value = ""; // 초기화
}

function handleNickSubmit(e) {
    e.preventDefault();
    const input = nickForm.querySelector("input");
    socket.send(makeMsg("nickname", input.value)); 
}

msgForm.addEventListener("submit", handleSubmit);
nickForm.addEventListener("submit", handleNickSubmit);
