const crypto = require('crypto');

function rollDice() {
    return crypto.randomInt(1, 7);
}

console.log("Simulating 3 dice rolls...");

for (let i = 1; i <= 3; i++) {
    const result = rollDice();
    console.log(`🎲 Dice Rolled: ${result}`);
}