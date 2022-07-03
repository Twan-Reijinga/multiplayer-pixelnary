class GameBoard {
    constructor(tileSize, rows, cols, marginX, marginY) {
        this.tileSize = tileSize;
        this.rows = rows;
        this.cols = cols;
        this.marginX = marginX;
        this.marginY = marginY;
        this.width = tileSize * cols;
        this.height = tileSize * rows;

        this.tiles = [];
        for (let i = 0; i < rows; i++) {
            let tilesInCol = [];
            for (let j = 0; j < cols; j++) {
                tilesInCol.push(new Tile('white'));
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
                this.tiles[i][j].draw(
                    this.tileSize * j,
                    this.tileSize * i,
                    this.tileSize
                );
            }
        }
        pop();
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
            let color = colorPalette.colors[colorPalette.colorIndex];
            this.tiles[tileY][tileX].setColor(color);
        }
    }

    getState() {
        return JSON.stringify(this.tiles);
    }
}

class Tile {
    constructor(color) {
        this.setColor(color);
    }

    setColor(color) {
        this.color = color;
    }

    draw(marginX, marginY, tileSize) {
        fill(this.color);
        rect(marginX, marginY, tileSize, tileSize);
    }
}
