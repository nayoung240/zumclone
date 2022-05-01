// window.location.host == localhost:3000
const socket = new WebSocket(`ws://${window.location.host}`);