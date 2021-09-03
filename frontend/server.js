const http = require('http');
const fs = require('fs');

http.createServer((req, res) => {
    if(req.method == 'GET'){
        if(req.url == '/'){
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html;charset=utf-8');
            res.end(fs.readFileSync('static/html/home.html'));
        }
        else if(req.url.slice(0, 3) == '/js'){
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/javascript');
            res.end(fs.readFileSync('static/js/index.js'));
        }
        else {
            res.statusCode = 404;
            res.end();
        }
    }
    else {
        res.statusCode = 405;
        res.end();
    }
});