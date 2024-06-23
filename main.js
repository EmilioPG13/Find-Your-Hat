const prompt = require('prompt-sync')({sigint: true});

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

class Field {
    constructor(field) {
        this.field = field;
        this.locationX = 0; // Horizontal location of the player
        this.locationY = 0; // Vertical location of the player
        this.field[this.locationY][this.locationX] = pathCharacter; // Initial position of the player
    }

    // Method to check if the player has won
    isInBounds(x, y) {
        return y >= 0 && y < this.field.length && x >= 0 && x < this.field[0].length;
    }

    // Method to check if the player has lost (fell in a hole or out of bounds)
    isLoss() {
        return !this.isInBounds(this.locationX, this.locationY) || this.field[this.locationY][this.locationX] === hole;
    }

    // Method to move the player based on input
    move(direction) {
        switch (direction) {
            case 'u': // up
                this.locationY -= 1;
                break;
            case 'd': // down
                this.locationY += 1;
                break;
            case 'l': // left
                this.locationX -= 1;
                break;
            case 'r': // right
                this.locationX += 1;
                break;
        }

        // Update player's position on the field
        if (this.isInBounds(this.locationX, this.locationY)) {
            this.field[this.locationY][this.locationX] = pathCharacter;
        }
    }

    // Method to check if the player has found the hat
    isWin() {
        return this.field[this.locationY][this.locationX] === hat;
    }

    // Static method to generate a random field
    static generateField(height, width, percentage) {
        const field = new Array(height).fill(null).map(() => new Array(width).fill(fieldCharacter));
        // Place the hat in a random position other than the starting point
        const hatLocation = {
            x: Math.floor(Math.random() * width),
            y: Math.floor(Math.random() * height)
        };
        if (hatLocation.x === 0 && hatLocation.y === 0) hatLocation.x = 1; // Ensure hat is not at the starting point
        field[hatLocation.y][hatLocation.x] = hat;

        // Generate holes in the field based on the percentage
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                if (Math.random() * 100 < percentage) {
                    field[y][x] = hole;
                }
            }
        }

        field[0][0] = pathCharacter; // Ensure the starting point is not a hole
        return field;
    }
}

// Example usage
const myField = new Field(Field.generateField(10, 10, 20));

// Game loop
while (true) {
    console.log(myField.field.map(row => row.join('')).join('\n'));
    const direction = prompt('Which way? (u, d, l, r): ');
    myField.move(direction);
    if (myField.isWin()) {
        console.log("Congratulations, you found the hat!");
        break;
    } else if (myField.isLoss()) {
        console.log("Sorry, you lost.");
        break;
    }
}