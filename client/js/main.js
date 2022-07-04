const socket = io();
let gameBoard;
let colorPalette;
let font;

// socket.emit("client msg", "hi server");
// socket.on("server msg", (msg) => {
//     console.log(msg);
// });

function preload() {
    font = loadFont('m5x7.ttf');
}

function setup() {
    const WIDTH = 1024;
    const HEIGHT = 1024;
    createCanvas(WIDTH, HEIGHT);
    frameRate(60);
    noStroke();
    let colors = ['red', 'green', 'blue'];
    colorPalette = new ColorPalette(colors, 32);
}

function draw() {
    if (gameBoard) {
        background(225);
        gameBoard.draw();
        if (mouseIsPressed) {
            let color = colorPalette.colors[colorPalette.colorIndex];
            let change = gameBoard.fillTile(color);
            if (change) {
                socket.emit('boardState', JSON.stringify(change));
            }
        }
        colorPalette.draw(32, gameBoard.height + 64, 32);
    }
}

function keyPressed() {
    let colors = colorPalette.colors;
    if (gameBoard && keyCode >= 49 && keyCode <= 48 + colors.length) {
        colorPalette.setColor(keyCode - 49);
    }
}

function startGame() {
    document.getElementsByTagName('canvas')[0].style.display = 'block';
    document.getElementById('menu').style.display = 'none';
    gameBoard = new GameBoard(32, 24, 30, 32, 32);
}

function createGame() {
    console.log('created game');
    startGame();
}

function joinGame() {
    let gameCode = gameCodeInput.value.toUpperCase();
    if (gameCode.length == 6) {
        console.log('joined game:', gameCode);
    }
    startGame();
}

document.getElementById('newGame').addEventListener('click', createGame);
document.getElementById('joinGame').addEventListener('click', joinGame);
let gameCodeInput = document.getElementById('gameCodeInput');
gameCodeInput.addEventListener('keypress', (e) => {
    let keycode = e.keyCode || e.which;
    if (keycode === 13) {
        joinGame();
    }
});
