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
    res.setHeader('Access-Control-Allow-Origin', '*');
    let path = req.url.split('/');
    path = path.filter(value => value.length > 0);
    console.log(path);
    if(req.method == 'GET'){
        if(path.length == 0){
            home(req, res, path);
        }
        else if(path[0] == 'notes'){
            if(path.length < 2) notes.list(req, res, path);
            else if(path.length == 2) notes.get(req, res, path);
            else {
                res.statusCode = 404;
                res.end();
            }
        }
        else {
            res.statusCode = 404;
            res.end();
        }
    }
    else if(req.method == 'POST'){
        if(path.length == 1 && path[0] == 'notes'){
            notes.create(req, res);
        }
        else {
            res.statusCode = 404;
            res.end();
        }
    }
    else if(req.method == 'PUT'){
        if(path.length == 2 && path[0] == 'notes'){
            notes.edit(req, res);
        }
        else {
            res.statusCode = 404;
            res.end();
        }
    }
    else if(req.method == 'DELETE'){
        if(path.length == 2 && path[0] == 'notes'){
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