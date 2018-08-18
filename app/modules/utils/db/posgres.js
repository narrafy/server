const { Pool } = require('pg');

let pool = null;

require('dotenv').config({silent: true})

function connect(uri){

    pool = new Pool({
        connectionString: uri,
        ssl: true
    });
    return pool.connect();
}

async function singleResultQuery(query)
{
    try {
        let res = await pool.query(query);
        let result = res.rows[0];
        return result;
    }catch (e) {
        console.log(e.stack);
    }
}

async function multipleRowsQuery(query)
{
    try {
        let res = await pool.query(query);
        let result = res.rows;
        return result;
    }catch (e) {
        console.log(e.stack);
    }
}

module.exports = exports = {

    connect: connect,
    singleResultQuery: singleResultQuery,
    multipleRowsQuery: multipleRowsQuery
}