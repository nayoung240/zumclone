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
