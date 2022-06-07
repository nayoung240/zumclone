# 3.0~3.2 User Video, Audio

### mediaDevices.getUserMedia(constraints)
: 사용자에게 미디어 입력 장치 사용 권한을 요청하며, 사용자가 수락하면 요청한 미디어 종류의 트랙을 포함한 MediaStream을 반환한다.

- 미디어 타입에 true 가 지정된 경우 각 타입에 맞는 장치가 사용 준비된 상태여야 한다. (준비되지 않으면 오류를 반환한다.)
```
myStream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true
});
```
- 특정 디바이스를 지정할 수 있다.
```
myStream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: { deviceId: myDeviceId }
});
```

### mediaDevices.enumerateDevices()
: 유저의 모든 장치를 조회한다.

### mediaStream.getAudioTracks()
: 스트림의 오디오오 트랙을 나타내는 객체 시퀀스를 반환

### mediaStream.getVideoTracks()
: 스트림의 비디오 트랙을 나타내는 객체 시퀀스를 반환

<br><br>

# 3.3~3.4 WebRTC (Web Real-Time Communication)

- 실시간 커뮤니케이션
- peer-to-peer: 브라우저에서 브라우저로 직접 영상, 오디오, 텍스트를 전달하는 것 
- peer to peer가 아닌 채팅을 주고받을 때 모든 영상, 오디오, 텍스트를 서버에 업로드하고 서버에서 받아서 보여주게 되는 경우 비용이 많이 든다.
- But, 브라우저에게 다른 브라우저가 어디에 있는 서버인지(offer) 알려주는 서버는 필요하다.

<br>

## signaling process
![message](./img/3_4webrtc.PNG)

- Peer A: 원래 있던 사용자 (새로운 사용자가 방에 참여하면 알림을 받게 되는 사용자)
- Peer B: 새로운 사용자
- socket.io를 통해 통신한다.

<br>

# 3.5 Offers (peer A)

### makeConnection
0. peerConnection을 각 브라우저에 만들기 / peer-to-peer 연결 안에다가 영상과 오디오 스트림을 넣기 
    - getUserMedia()
    - addStream() // 사용하지는 않고 getTracks()로 개별적으로 넣어준다.
```
myPeerConnection = new RTCPeerConnection();
myStream.getTracks().forEach(track => myPeerConnection.addTrack(track, myStream))
```

### welcome
1. offer 생성 후 연결 구성하기
    - createOffer()
    - setLocalDescription()
```
// peer A는 offer를 생성한다.
const offer = await myPeerConnection.createOffer();
myPeerConnection.setLocalDescription(offer);

// peer B로 offer를 보낸다.
socket.emit("offer", offer, roomName);
```

<br><br>

# 3.6 Answers (peer B)

### offer
2. offer를 받고 peer A의 description을 세팅하기
    - setRemoteDescription()
    - getUserMedia()
    - addStream()
3. answer를 생성하기
    - createAnswer()
    - setLocalDescription()
```
myPeerConnection.setRemoteDescription(offer);

const answer = await myPeerConnection.createAnswer();
myPeerConnection.setLocalDescription(answer);

// peer A로 answer를 보낸다.
socket.emit("answer", answer, roomName);
```

### answer
4. 받은 answer로 remoteDescription 세팅하기
```
myPeerConnection.setRemoteDescription(answer);
```

<br>

> 각 브라우저는 localDescription과 remoteDescription을 갖게된다.

<br><br>

# 3.7 IceCandidate

### Internet Connectivity Establishment: 브라우저가 서로 소통할 수 있게 해주는 방법

5. peer A에서 icecandidate 이벤트 실행 -> candidate 전달
6. peer B에서 candidate 추가 -> icecandidate 이벤트 실행 -> candidate 전달
    - addIceCandidate()
7. peer A에서 candidate 추가
    - addIceCandidate()
```
myPeerConnection.addEventListener("icecandidate", handleIce);

// 상대 peer로 candidate를 보낸다.
socket.emit("ice", data.candidate, roomName);

myPeerConnection.addIceCandidate(ice);
```

8. addstream 이벤트 등록
myPeerConnection.addEventListener("addstream", handleAddStream);
```
myPeerConnection.addEventListener("addstream", handleAddStream);

// 상대 peer의 stream: data.stream, 내 peer의 stream: myStream
peerFace.srcObject = data.stream;
```