const fs = require('fs');
const filePath = 'test.txt';

console.log("Creating File...");
try {
    // Create
    fs.writeFileSync(filePath, 'Hello Node.js\n');
    console.log("File Created");

    // Read
    console.log("Reading File...");
    const data1 = fs.readFileSync(filePath, 'utf8');
    console.log(data1.trim());

    // Update 
    fs.appendFileSync(filePath, 'Learning FS Module\n');
    console.log("File Updated");

    // Read again to show update
    const data2 = fs.readFileSync(filePath, 'utf8');
    console.log(data2.trim());

    // Delete
    //fs.unlinkSync(filePath);
    console.log("File Deleted");

} catch (err) {
    console.error("File operation error:", err.message);
}