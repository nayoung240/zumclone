const socket = io();
const myFace = document.getElementById("myFace");
const muteBtn = document.getElementById("mute");
const cameraBtn = document.getElementById("camera");
const camerasSelect = document.getElementById("cameras");

let myStream;
let muted = false;
let camera = false;

async function getCameras() {
    try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cameras = devices.filter((device) => {
            device.kind === "videoinput"
        });

        cameras.forEach(camera => {
            const option = document.createElement("option");
            option.value = camera.deviceId;
            option.innerText = camera.label;
            camerasSelect.appendChild(option)
        })
    } catch (e) {
        console.log(e);
    }
}

async function getMedia() {
    try{
        myStream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true
        });

        myFace.srcObject = myStream;

        await getCameras;
    } catch (e) {
        console.log(e);
    }
}

getMedia();

function handleMuteBtn() {
    myStream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
    });

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
    myStream.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
    });

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