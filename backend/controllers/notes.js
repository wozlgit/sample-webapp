const db = require('../models/postgres');

module.exports = {
    get: (req, res, path) => {
        if(path[1].length < 1){
            res.statusCode = 404;
            res.end();
        }
        let noteID = path[1];
        db.query('SELECT * FROM notes WHERE id = $1', [noteID])
        .then(result => {
            res.statusCode = 200;
            res.end(JSON.stringify({rows: result.rows, rowCount: result.rowCount}));
        })
        .catch(err => {
            res.statusCode = 200;
            res.end(JSON.stringify({err: err}));
        });
    },
    create: (req, res, path) => {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk;
        });
        req.on('end', () => {
            let note, queryProm;
            try {
                note = JSON.parse(body);
                queryProm = db.query("INSERT INTO notes (title, creationDate, note) VALUES ($1, $2, $3)", [note.title, new Date().toUTCString(), note.note]);
            } catch(err){
                res.statusCode = 200;
                res.end(JSON.stringify({err: err}));
                return;
            }
            queryProm
            .then(result => {
                res.statusCode = 200;
                res.end(JSON.stringify({rows: result.rows, rowCount: result.rowCount}));
            })
            .catch(err => {
                res.statusCode = 200;
                res.end(JSON.stringify({err: err}));
            })
        });
    },
    edit: (req, res, path) => {
        if(path[1].length < 1){
            res.statusCode = 404;
            res.end();
        }
        else {
            let noteID = path[1];
            let body = '';
            req.on('data', (chunk) => {
                body += chunk;
            });
            req.on('end', () => {
                let note, queryProm;
                try {
                    note = JSON.parse(body);
                    queryProm = db.query("UPDATE notes SET title = $2, note = $3 WHERE id = $1", [noteID, note.title, note.note]);
                } catch (err){
                    res.statusCode = 200;
                    res.end(JSON.stringify({err: err}));
                    return;
                }
                queryProm
                .then(result => {
                    res.statusCode = 200;
                    res.end(JSON.stringify({rows: result.rows, rowCount: result.rowCount}));
                })
                .catch(err => {
                    res.statusCode = 200;
                    res.end(JSON.stringify({err: err}));
                });
            });
        }
    },
    delete: (req, res, path) => {
        if(path[1].length < 1){
            res.statusCode = 404;
            res.end();
        }
        else {
            let noteID = path[1];
            db.query("DELETE FROM notes WHERE id = $1", [noteID])
            .then(result => {
                res.statusCode = 200;
                res.end(JSON.stringify({rows: result.rows, rowCount: result.rowCount}));
            })
            .catch(err => {
                res.statusCode = 200;
                res.end(JSON.stringify({err: err}));
            })
        }
    },
    list: (req, res, path) => {
        db.query("SELECT * FROM notes", [])
        .then(result => {
            res.statusCode = 200;
            res.end(JSON.stringify({rows: result.rows, rowCount: result.rowCount}));
        })
        .catch(err => {
            res.statusCode = 200;
            res.end(JSON.stringify({err: err}));
        })
    }
}