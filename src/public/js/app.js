const socket = io();

const welcome = document.getElementById("welcome");
const form = document.querySelector("form");
const room = document.getElementById("room");

room.hidden = true;

let roomName = "";

function serverDone(msg) {
    console.log(`The Server says: `, msg);
}

function showRoom() {
    welcome.hidden = true;
    room.hidden = false;

    const h3 = document.querySelector("h3");
    h3.innerText = `Room ${roonName}`;
}

function handleRoomSubmit(event) {
    event.preventDefault();
    const input = form.querySelector("input");

    // room이라는 이벤트롤 emit
    socket.emit("enter_room", input.value, showRoom);
    roomName = input.value;
    input.value = "";
}

form.addEventListener("submit", handleRoomSubmit);