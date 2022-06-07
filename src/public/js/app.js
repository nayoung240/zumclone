const socket = io();
const myFace = document.getElementById("myFace");
const muteBtn = document.getElementById("mute");
const cameraBtn = document.getElementById("camera");
const camerasSelect = document.getElementById("cameras");
const call = document.getElementById("call");

call.hidden = true;

let myStream;
let muted = false;
let camera = false;
let roomName;
let myPeerConnection;

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

// welcome form (join a room)

const welcome = document.getElementById("welcome");
const welcomeForm = welcome.querySelector("form");

async function initCall() {
    welcome.hidden = true;
    call.hidden = false;
    await getMedia();
    makeConnection();
}

async function handleWelcomeSubmit(event) {
    event.preventDefault();
    const input = welcomeForm.querySelector("input");

    // web socket들의 속도는 media를 가져오거나, 연결을 만드는 속도보다 빠르다
    await initCall();

    socket.emit("enter_room", input.value);
    roomName = input.value;
    input.value = "";
}

welcomeForm.addEventListener("submit", handleWelcomeSubmit);

// socket code

// peer A에서 실행되는 코드
socket.on("welcome", async(msg) => {
    // peer A는 offer를 생성한다.
    const offer = await myPeerConnection.createOffer();
    myPeerConnection.setLocalDescription(offer);

    // peer B로 offer를 보낸다.
    socket.emit("offer", offer, roomName);
})

// peer B에서 실행되는 코드
socket.on("offer", async(offer) => {
    myPeerConnection.setRemoteDescription(offer);

    const answer = await myPeerConnection.createAnswer();
    myPeerConnection.setLocalDescription(answer);

    // peer A로 answer를 보낸다.
    socket.emit("answer", answer, roomName);
})

// peer A에서 실행되는 코드
socket.on("answer", async(answer) => {
    myPeerConnection.setRemoteDescription(answer);
})

socket.on("ice", async(ice) => {
    myPeerConnection.addIceCandidate(ice);
})

// RTC code

function makeConnection() {
    myPeerConnection = new RTCPeerConnection();
    myPeerConnection.addEventListener("icecandidate", handleIce);
    myPeerConnection.addEventListener("addstream", handleAddStream);

    myStream.getTracks().forEach(track => myPeerConnection.addTrack(track, myStream))
}

function handleIce(data) {
    // 상대 peer로 candidate를 보낸다.
    socket.emit("ice", data.candidate, roomName);
}

function handleAddStream(data) {
    const peerFace = document.getElementById("peerFace");
    // 상대 peer의 stream: data.stream, 내 peer의 stream: myStream
    peerFace.srcObject = data.stream;
}