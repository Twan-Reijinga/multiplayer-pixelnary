console.log("hello world");
const socket = io();

socket.emit("client msg", "hi server");

socket.on("server msg", (msg) => {
    console.log(msg);
});
