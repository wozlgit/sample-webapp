const pg = require('pg');

let pool;

module.exports = {
    init: async () => {
        console.log('Initializing PostgreSQL');
        pool = new pg.Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: {
                rejectUnauthorized: false
            }
        });
        pool.connect((err, client, done) => {
            if(err){
                done(err);
            }
            client.query('CREATE TABLE IF NOT EXIST notes (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), title text, creationDate Date, note text)', (err, result) => {
                if(err){
                    done(err);
                }
                done(true);
            });
        });
        console.log('Finished initialization of PostgreSQL');
    },
    query: (text, params, callback) => {
        return pool.query(text, params, callback);
    }
}