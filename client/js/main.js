const socket = io();
let gameBoard;
let colorPalette;
let font;
let gameCode;

socket.on('gameCode', (code) => {
    gameCode = code;
    startGame();
});

socket.on('undefinedGame', () => {
    document.getElementById('gameCodeInput').classList.add('error');
    document.getElementsByClassName('error-container')[0].style.display =
        'block';
    console.log('undefined');

    setTimeout(() => {
        document.getElementById('gameCodeInput').classList.remove('error');
        document.getElementsByClassName('error-container')[0].style.display =
            'none';
    }, 2500);
});

socket.on('boardState', (state) => {
    state = JSON.parse(state);
    console.log('boardState', state);
    gameBoard.fillTile(state.x, state.y, state.color);
});

function preload() {
    font = loadFont('m5x7.ttf');
}

function setup() {
    const WIDTH = 1024;
    const HEIGHT = 1024;
    createCanvas(WIDTH, HEIGHT);
    frameRate(60);
    noStroke();
    textFont(font);
    textAlign(LEFT, CENTER);
    let colors = ['red', 'green', 'blue'];
    colorPalette = new ColorPalette(colors, 32);
}

function draw() {
    if (gameBoard) {
        background(225);
        gameBoard.draw();
        colorPalette.draw(32, gameBoard.height + 64, 32);
        textSize(30);
        text('> Press space to start <', 32, 1024 - 128);
        textSize(80);
        text('Game Code: ' + gameCode, 32, 1024 - 64);
        if (mouseIsPressed) {
            let color = colorPalette.colors[colorPalette.colorIndex];
            let tile = gameBoard.findTile();
            if (tile && gameBoard.getTileColor(tile.x, tile.y) != color) {
                tile['color'] = color;
                socket.emit('boardState', JSON.stringify(tile));
                gameBoard.fillTile(tile.x, tile.y, tile.color);
            }
        }
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
    gameBoard = new GameBoard(16, 48, 60, 32, 32);
}

function createGame() {
    console.log('created game');
    socket.emit('newGame');
}

function joinGame() {
    let code = gameCodeInput.value.toUpperCase();
    if (code.length == 6) {
        socket.emit('joinGame', code);
    }
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
