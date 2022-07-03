class GameBoard {
    constructor(tileSize, rows, cols, marginX, marginY) {
        this.tileSize = tileSize;
        this.rows = rows;
        this.cols = cols;
        this.marginX = marginX;
        this.marginY = marginY;
        this.width = tileSize * cols;
        this.height = tileSize * rows;
        this.color = color('red');

        this.tiles = [];
        for (let i = 0; i < rows; i++) {
            let tilesInCol = [];
            for (let j = 0; j < cols; j++) {
                tilesInCol.push(new Tile(tileSize));
            }
            this.tiles.push(tilesInCol);
        }
    }

    draw() {
        push();
        stroke(0);
        translate(this.marginX, this.marginY);
        for (let i = 0; i < this.tiles.length; i++) {
            for (let j = 0; j < this.tiles[i].length; j++) {
                this.tiles[i][j].draw(this.tileSize * j, this.tileSize * i);
            }
        }
        pop();
    }

    setColor(colorIndex) {
        this.color = colors[colorIndex];
    }

    fillTile() {
        if (
            mouseIsPressed &&
            mouseX >= this.marginX &&
            mouseX < this.marginX + this.width &&
            mouseY >= this.marginY &&
            mouseY < this.marginY + this.height
        ) {
            let tileX = Math.floor((mouseX - this.marginX) / this.tileSize);
            let tileY = Math.floor((mouseY - this.marginX) / this.tileSize);
            this.tiles[tileY][tileX].setColor(this.color);
        }
    }
}

class Tile {
    constructor(tileSize) {
        this.tileSize = tileSize;
        this.setColor(color(255));
    }

    setColor(color) {
        this.color = color;
    }

    draw(marginX, marginY) {
        fill(this.color);
        rect(marginX, marginY, this.tileSize, this.tileSize);
    }
}
