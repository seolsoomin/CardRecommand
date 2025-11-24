const mariadb = require('mariadb');

const pool = mariadb.createPool({
    host : '127.0.0.1',
    user : 'root',
    port : 3307,
    password : '1234',
    database : 'carddb',
    connectionLimit : 4
});

module.exports = pool;
