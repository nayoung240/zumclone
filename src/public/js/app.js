const socket = io();

const welcome = document.getElementById("welcome");
const form = document.querySelector("form");

function serverDone(msg) {
    console.log(`The Server says: `, msg);
}

function handleRoomSubmit(event) {
    event.preventDefault();
    const input = form.querySelector("input");

    // room이라는 이벤트롤 emit
    socket.emit("enter_room", input.value, serverDone);
    input.value = "";
}

form.addEventListener("submit", handleRoomSubmit);