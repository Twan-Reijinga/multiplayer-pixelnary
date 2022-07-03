const socket = io();
let gameBoard;

// socket.emit("client msg", "hi server");
// socket.on("server msg", (msg) => {
//     console.log(msg);
// });

function setup() {
    const WIDTH = 1024;
    const HEIGHT = 1024;
    createCanvas(WIDTH, HEIGHT);
    frameRate(60);
    noStroke();

    gameBoard = new GameBoard(32, 24, 30, 32, 32);
}

function draw() {
    background(225);
    gameBoard.draw();
    if (mouseIsPressed) {
        gameBoard.changeColor();
    }
}
