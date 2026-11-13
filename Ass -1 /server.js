const http = require('http');

const PORT = 3000;

const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'text/plain');

    if (req.url === '/') {
        res.writeHead(200);
        res.end('Welcome message\n');
    } else if (req.url === '/about') {
        res.writeHead(200);
        res.end('About page\n');
    } else if (req.url === '/contact') {
        res.writeHead(200);
        res.end('Contact page\n');
    } else {
        res.writeHead(404);
        res.end('404 Error Message\n');
    }
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});