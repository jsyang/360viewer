const http = require('http');
const url  = require('url');
const fs   = require('fs');

http.createServer((req, res) => {
    try {
        const {pathname}    = url.parse(req.url);
        const requestedFile = pathname === '/' ? '/index.html' : pathname;

        const fileStream = fs.createReadStream(__dirname + requestedFile);

        fileStream.pipe(res);

        fileStream.on('open', () => res.writeHead(200));
        fileStream.on('error', () => {
            res.writeHead(404);
            res.end();
        });

    } catch (e) {
        res.writeHead(500);
        res.end();
    }
}).listen(3000);
