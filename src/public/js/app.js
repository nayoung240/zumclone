const socket = io();
const myFace = document.getElementById("myFace");
const muteBtn = document.getElementById("mute");
const cameraBtn = document.getElementById("camera");

let myStream;
let muted = false;
let camera = false;

async function getMedia() {
    try{
        myStream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true
        });

        myFace.srcObject = myStream;
    } catch (e) {
        console.log(e);
    }
}

getMedia();

function handleMuteBtn() {
    if(muted) {
        muteBtn.innerText = "음성 OFF";
        muted = false;
    }
    else {
        muteBtn.innerText = "음성 ON";
        muted = true;
    }
}

function handleCameraBtn() {
    if(camera) {
        cameraBtn.innerText = "카메라 OFF";
        camera = false;
    }
    else {
        cameraBtn.innerText = "카메라 ON";
        camera = true;
    }
}

muteBtn.addEventListener("click", handleMuteBtn);
cameraBtn.addEventListener("click", handleCameraBtn);