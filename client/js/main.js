const socket = io();
let gameBoard;
let colorPalette;

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
    let colors = ['red', 'green', 'blue'];
    colorPalette = new ColorPalette(colors, 32);
    gameBoard = new GameBoard(32, 24, 30, 32, 32);
}

function draw() {
    background(225);
    gameBoard.draw();
    if (mouseIsPressed) {
        gameBoard.fillTile();
        socket.emit('boardState', gameBoard.getState());
    }
    colorPalette.draw(32, gameBoard.height + 64, 32);
}

function keyPressed() {
    if (keyCode >= 49 && keyCode <= 48 + colorPalette.colors.length) {
        colorPalette.setColor(keyCode - 49);
    }
}
