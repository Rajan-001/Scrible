"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_client_1 = require("socket.io-client");
const socket = (0, socket_io_client_1.io)("http://localhost:3001");
socket.on("data", (data) => {
    console.log(`data received from server side: ${data}`);
    socket.emit("hello", { name: "John" });
});
