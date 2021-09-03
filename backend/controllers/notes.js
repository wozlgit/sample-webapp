const db = require('../models/postgres');

module.exports = {
    get: (req, res) => {
        if(req.url.length < 8){
            res.statusCode = 404;
            res.end();
        }
        else {
            let noteID = req.url.slice(7);
            db.query('SELECT * FROM notes WHERE id = $1', [noteID], (err, result) => {
                if(err){
                    return console.error(err);
                }
                res.statusCode = 200;
                res.end(JSON.stringify(result));
            });
        }
    },
    create: (req, res) => {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk;
        });
        req.on('end', () => {
            let note = JSON.parse(body);
            db.query("INSERT INTO notes (title, creationDate, note) VALUES ($1, $2, $3)", [note.title, Date.now(), note.note], (err, result) => {
                if(err){
                    return console.error(err);
                }
                res.statusCode = 200;
                res.end(JSON.stringify(result));
            });
        });
    },
    edit: (req, res) => {
        if(req.url.length < 8){
            res.statusCode = 404;
            res.end();
        }
        else {
            let noteID = req.url.slice(8);
            let body = '';
            req.on('data', (chunk) => {
                body += chunk;
            });
            req.on('end', () => {
                let note = JSON.parse(body);
                db.query("UPDATE notes SET title = $2, note = $3 WHERE id = $1", [noteID, note.title, note.note], (err, result) => {
                    if(err){
                        return console.error(err);
                    }
                    res.statusCode = 200;
                    res.end(JSON.stringify(result));
                });
            });
        }
    },
    delete: (req, res) => {
        if(req.url.length < 8){
            res.statusCode = 404;
            res.end();
        }
        else {
            let noteID = req.url.slice(8);
            db.query("DELETE FROM notes WHERE id = $1", [noteID], (err, result) => {
                if(err){
                    return console.error(err);
                }
                res.statusCode = 200;
                res.end(JSON.stringify(result));
            });
        }
    }
}