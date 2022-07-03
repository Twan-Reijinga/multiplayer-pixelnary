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
    }

    setColor(colorIndex) {
        this.colorIndex = colorIndex;
    }
}
