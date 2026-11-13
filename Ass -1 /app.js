const isEven = require('./modules/isEven');
const { logMessage } = require('./modules/logger');

logMessage("App started!");
const num = 10;
console.log(`Is ${num} even? : ${isEven(num)}`);