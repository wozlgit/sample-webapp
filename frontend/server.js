const http = require('http');
const fs = require('fs');

const port = process.env.PORT || 8002

const server = http.createServer((req, res) => {
    if(req.method == 'GET'){
        if(req.url == '/'){
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html;charset=utf-8');
            res.end(fs.readFileSync('static/html/home.html'));
        }
        else if(req.url == '/js/index.js'){
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

server.listen(port, () => {
    console.log('Server listening on port ' + port + '\n');
})