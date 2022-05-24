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
        const currentCamera = myStream.getVideoTracks()[0]; // 현재 카메라 정보

        cameras.forEach(camera => {
            const option = document.createElement("option");
            option.value = camera.deviceId;
            option.innerText = camera.label;

            if(currentCamera.label == camera.label) {
                option.selected = true;
            }

            camerasSelect.appendChild(option)
        })
    } catch (e) {
        console.log(e);
    }
}

async function getMedia(deviceId) {
    const initialConstrains = {
        audio: true,
        video: { facingMode: "user" }
    };

    const cameraConstrains = {
        audio: true,
        video: { deviceId: { exact: deviceId } }
    };

    try{
        myStream = await navigator.mediaDevices.getUserMedia(
            deviceId ? cameraConstrains : initialConstrains
        );

        myFace.srcObject = myStream;

        if(!deviceId) {
            await getCameras;
        }
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

async function handleCameraChange() {
    await getMedia(camerasSelect.value);
}

muteBtn.addEventListener("click", handleMuteBtn);
cameraBtn.addEventListener("click", handleCameraBtn);
camerasSelect.addEventListener("input", handleCameraChange);