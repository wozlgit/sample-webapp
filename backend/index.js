if(process.env.NODE_ENV != 'production') require('dotenv').config();

const http = require('http');

const home = require('./controllers/home');
const notes = require('./controllers/notes');
const db = require('./models/postgres');

const port = process.env.PORT || 8000;
/** @type {http.Server} */

// Initialize database
db.init()
.then(() => {
    console.log('Database initialization successfull');
})
.catch(() => {
    console.log('Database initialization failed');
    console.error(err);
    process.exit(1);
});

const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'application/json');
    if(req.method == 'GET'){
        if(req.url == '/'){
            home(req, res);
        }
        else if(req.url.slice(0, 7) == '/notes/'){
            if(req.url.length < 8) notes.list(req, res);
            else notes.get(req, res);
        }
        else {
            res.statusCode = 404;
            res.end();
        }
    }
    else if(req.method == 'POST'){
        if(req.url == '/notes/'){
            notes.create(req, res);
        }
        else {
            res.statusCode = 404;
            res.end();
        }
    }
    else if(req.method == 'PUT'){
        if(req.url.slice(0, 7) == '/notes/'){
            notes.edit(req, res);
        }
        else {
            res.statusCode = 404;
            res.end();
        }
    }
    else if(req.method == 'DELETE'){
        if(req.url.slice(0, 7) == '/notes/'){
            notes.delete(req, res);
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
});

const gracefulShutdown = () => {
    console.err(reason);
    db.shutdown()
    .finally(() => {
        server.close(() => {
            process.exit(1);
        });
    });
}

process.on('SIGTERM', gracefulShutdown);