const socket = io();

const welcome = document.getElementById("welcome");
const room = document.getElementById("room");
const roomnameForm = document.querySelector("#roomname");
const nickForm = document.querySelector("#nick");

room.hidden = true;

let roomName = "";
let userCount = 0;

function serverDone(msg) {
    console.log(`The Server says: `, msg);
}

function handleMessageSubmit(event) {
    event.preventDefault();
    const input = room.querySelector("#msg input");

    socket.emit("new_message", input.value, roomName, () => {
        addMessage(`나: ${input.value}`);
        input.value = "";
    });
}

function handleNicknameSubmit(event) {
    event.preventDefault();
    const input = welcome.querySelector("#nick input");

    // 서버에 닉네임값 보내기
    socket.emit("nickname", input.value);
}

function setRoom(userCount) {
    const h3 = document.querySelector("h3");
    h3.innerText = `Room ${roomName} (${userCount})`;
}

function showRoom() {
    welcome.hidden = true;
    room.hidden = false;

    setRoom();

    const msgForm = room.querySelector("#msg");
    msgForm.addEventListener("submit", handleMessageSubmit);

}

function handleRoomSubmit(event) {
    event.preventDefault();
    const input = welcome.querySelector("#roomname input");

    // room이라는 이벤트롤 emit
    socket.emit("enter_room", input.value, showRoom);
    roomName = input.value;
    input.value = "";
}

function addMessage(message) {
    const ul = room.querySelector("ul");
    const li = document.createElement("li");

    li.innerText = message;
    ul.appendChild(li);
}

roomnameForm.addEventListener("submit", handleRoomSubmit);
nickForm.addEventListener("submit", handleNicknameSubmit);

// 서버에서 받은 이벤트
socket.on("welcome", (msg, count) => {
    userCount = count;
    setRoom();
    addMessage(msg);
});

socket.on("bye", (msg, count) => {
    userCount = count;
    setRoom();
    addMessage(msg);
});

socket.on("new_message", (msg) => {
    addMessage(msg);
});

socket.on("room_change", (rooms) => {
    const roomList = welcome.querySelector("ul");
    roomList.innerHTML = "";

    if(rooms.length === 0) {
        return;
    }

    rooms.forEach((room) => {
        const li = document.createElement("li");
        li.innerText = room;
        roomList.append(li);
    });
});