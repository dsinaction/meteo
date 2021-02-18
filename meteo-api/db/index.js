const { Pool } = require('pg')

const pool = new Pool() // use default PostgreSQL env variables

module.exports = {
    query: (text, params, callback) => {
        return pool.query(text, params, callback)
    }
}