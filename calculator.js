const args = process.argv.slice(2);
const operation = args[0];
const num1 = parseFloat(args[1]);
const num2 = parseFloat(args[2]);

if (!operation || isNaN(num1) || isNaN(num2)) {
    console.log("Error: Please provide valid inputs. Example: node calculator.js add 10 5");
    process.exit(1);
}

console.log(`Executing operation: ${operation}`);

switch (operation.toLowerCase()) {
    case 'add':
        console.log(`Result: ${num1 + num2}`);
        break;
    case 'subtract':
        console.log(`Result: ${num1 - num2}`);
        break;
    case 'multiply':
        console.log(`Result: ${num1 * num2}`);
        break;
    case 'divide':
        if (num2 === 0) {
            console.log("Error: Cannot divide by zero.");
        } else {
            console.log(`Result: ${num1 / num2}`);
        }
        break;
    default:
        console.log("Error: Invalid operation. Use add, subtract, multiply, or divide.");
}