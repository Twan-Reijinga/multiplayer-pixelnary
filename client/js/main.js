const socket = io();
let gameBoard;
let colorPalette = 0;
let font;
let gameCode;
let players = [];
let playerId;
let drawingPlayer;
let startButton;

socket.on('gameCode', (code) => {
    gameCode = code;
    drawLobby();
});

socket.on('undefinedGame', () => {
    document.getElementById('gameCodeInput').classList.add('error');
    let errorContainer = document.getElementsByClassName('error-container')[0];
    errorContainer.style.display = 'block';

    setTimeout(() => {
        document.getElementById('gameCodeInput').classList.remove('error');
        errorContainer.style.display = 'none';
    }, 2500);
});

socket.on('joinedPlayer', (player) => {
    players.push(player);
});

socket.on('leavedPlayer', (player) => {
    players.splice(players.indexOf(player), 1);
});

socket.on('startGame', () => {
    startGame();
});

socket.on('ownPlayerId', (id) => {
    playerId = id;
});

socket.on('correctGuess', (guess) => {
    console.log(guess);
    if (guess.clientId == playerId) {
        alert('You guessed the word "' + guess.word + '" correct');
        return;
    }
    alert(guess.clientId + ' guessed the word "' + guess.word + '" correct');
});

socket.on('startRound', (playerIndex) => {
    drawingPlayer = players[playerIndex % players.length];
    console.log(drawingPlayer);
    if (drawingPlayer == playerId) {
        let drawItem = prompt('What are you going to draw?').toUpperCase();
        socket.emit('drawItem', drawItem);
    } else {
        drawGuesser();
    }
});

socket.on('boardState', (state) => {
    state = JSON.parse(state);
    gameBoard.fillTile(state.x, state.y, state.color);
});

function preload() {
    font = loadFont('m5x7.ttf');
}

function setup() {
    const WIDTH = 1024;
    const HEIGHT = 1024;
    createCanvas(WIDTH, HEIGHT);
    frameRate(600);
    noStroke();
    textFont(font);
    let colors = ['red', 'green', 'blue'];
    colorPalette = new ColorPalette(colors, 32);
}

function draw() {
    if (gameBoard) {
        background(225);
        gameBoard.draw();
        if (drawingPlayer == playerId) {
            colorPalette.draw(32, gameBoard.height + 64, 32);
        } else {
            fill(255);
            rect(32, 850, 710, 150);
            fill(0);
            textSize(50);
            textAlign(LEFT, CENTER);
            text('Guess what the player is drawing...', 80, 875);
        }
    } else if (players.length) {
        fill(255);
        rect(64, 384, 896, 512);
        for (let i = 0; i < players.length; i++) {
            if (players[i] == playerId) {
                fill('red');
            } else {
                fill('black');
            }
            textAlign(CENTER, CENTER);
            textSize(50);
            text('player ' + players[i], 512, 420 + i * 64);
        }
    }
}

function keyPressed() {
    let colors = colorPalette.colors;

    if (gameBoard && keyCode >= 49 && keyCode <= 48 + colors.length) {
        colorPalette.setColor(keyCode - 49);
    }
}

function drawLobby() {
    document.getElementsByTagName('canvas')[0].style.display = 'block';
    document.getElementById('menu').style.display = 'none';
    background(225);
    textAlign(CENTER, CENTER);
    textSize(80);
    text('PIXELNARY - Lobby', 512, 128);
    textSize(60);
    text('Game code: ' + gameCode, 512, 300);
    drawPlayerList(64, 384, 896, 512);

    let quitButton = createButton('Quit');
    startButton = createButton('Start');
    startButton.position(48, 896);
    quitButton.position(745, 896);
    startButton.mouseClicked(() => {
        socket.emit('startGame', gameCode);
        startGame();
    });
    quitButton.mouseClicked(() => {
        window.location.reload();
    });
}

function drawPlayerList(x, y, width, height) {
    fill(255);
    rect(x, y, width, height);
    textSize(30);
    text('Waiting for players...', width / 2 + x, (height / 10) * 9 + y);
    socket.emit('getPlayers', gameCode);
}

function drawGuesser() {
    let guessInput = createInput('');
    guessInput.position(54, 900);
    guessInput.id('guessInput');
    guessInput = document.getElementById('guessInput');
    guessInput.placeholder = 'Do a guess...';
    guessInput.addEventListener('keypress', (e) => {
        let keyCode = e.keyCode || e.which;
        if (keyCode === 13) {
            let guess = guessInput.value.toUpperCase();
            socket.emit('guess', guess);
            console.log(guess);
            guessInput.value = '';
        }
    });
}

function onInput() {
    clear();
    console.log(this.value());
}

function startGame() {
    startButton.remove();
    gameBoard = new GameBoard(16, 48, 60, 32, 32);
}

function createGame() {
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
    let keyCode = e.keyCode || e.which;
    if (keyCode === 13) {
        joinGame();
    }
});
