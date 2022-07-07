class ColorPalette {
    constructor(colors, cellSize) {
        this.colors = colors;
        this.colorIndex = 0;
        this.cellSize = cellSize;
    }

    draw(marginX, marginY, marginBetween) {
        push();
        translate(marginX, marginY);
        for (let i = 0; i < this.colors.length; i++) {
            if (this.colorIndex == i) {
                strokeWeight(3);
                stroke(0);
            } else {
                noStroke();
            }
            fill(color(this.colors[i]));
            rect(
                (this.cellSize + marginBetween) * i,
                0,
                this.cellSize,
                this.cellSize
            );
        }
        pop();
        textAlign(LEFT, CENTER);
        textSize(30);
        text('Use numberkeys to select color', 32, 896);
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

    setColor(colorIndex) {
        this.colorIndex = colorIndex;
    }
}
