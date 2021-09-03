const http = require('http');

const home = require('./controllers/home');
const notes = require('./controllers/notes');
const db = require('./models/postgres');

console.log('Initializing database');
await db.init();
console.log('Database initialization complete');

const port = process.env.PORT | 8000;

const server = http.createServer((req, res) => {
    if(req.method == 'GET'){
        if(req.url == '/'){
            home(req, res);
        }
        else if(req.url.slice(0, 7) == '/notes/'){
            notes.get(req, res);
        }
    }
    else if(req.method == 'POST'){
        if(req.url == '/notes'){
            notes.create(req, res);
        }
    }
    else if(req.method == 'PUT'){
        if(req.url.slice(0, 7) == '/notes'){
            notes.edit(req, res);
        }
    }
    else if(req.method == 'DELETE'){
        if(req.url.slice(0, 7) == '/notes'){
            notes.delete(req, res);
        }
    }
});

server.listen(port, () => {
    console.log('Server listening on port ' + port + '\n');
});