const pg = require('pg');

/** @type {pg.Pool} */
let pool;

module.exports = {
    init: () => {
        pool = new pg.Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: {
                rejectUnauthorized: false
            }
        });
        return pool.connect()
        .then(client => {
            client.query('CREATE TABLE IF NOT EXISTS notes (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), title text, creationDate Date, note text)')
            .then(result => {
                client.release(true);
            })
            .catch(err => {
                console.error(err);
                client.release(err);
            });
        })
        .catch(err => {
            console.error(err);
        });
    },
    query: (text, params) => {
        return pool.query(text, params);
    },
    shutdown: () => {
        return pool.end();
    }
}