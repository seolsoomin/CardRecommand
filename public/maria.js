const mariadb = require('mariadb');

const pool = mariadb.createPool({
    host : '192.168.193.1',
    user : 'remote_user',
    port : 3307,
    password : '1234',
    database : 'carddb',
    connectionLimit : 4
});

module.exports = pool;
