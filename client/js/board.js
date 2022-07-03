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
                tilesInCol.push(new Tile(tileSize, color(255)));
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
}

class Tile {
    constructor(tileSize, color) {
        this.tileSize = tileSize;
        this.setColor(color);
    }

    setColor(color) {
        this.color = color;
    }

    draw(marginX, marginY) {
        fill(this.color);
        rect(marginX, marginY, this.tileSize, this.tileSize);
    }
}
