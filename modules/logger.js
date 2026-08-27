// Bonus: Adding timestamps to the logger module
function logMessage(message) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${message}`);
}
module.exports = { logMessage };