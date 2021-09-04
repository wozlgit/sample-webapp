const pg = require('pg');

/** @type {pg.Pool} */
let pool;

module.exports = {
    init: () => {
        console.log('Initializing database...');
        let connectionOptions = {
            connectionString: process.env.DATABASE_URL,
            ssl: false
        }
        if(process.env.NODE_ENV == 'production') connectionOptions.ssl = {
            rejectUnauthorized: false
        };
        pool = new pg.Pool(connectionOptions);
        console.log('Connecting to database...');
        return pool.connect()
        .then(client => {
            console.log('Successfully connected to database');
            client.query('CREATE TABLE IF NOT EXISTS notes (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), title text, creationDate timestamp, note text)')
            .then(result => {
                client.release(true);
            })
            .catch(err => {
                console.error(err);
                client.release(err);
            });
        })
        .catch(err => {
            console.log('Failed connecting to database');
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