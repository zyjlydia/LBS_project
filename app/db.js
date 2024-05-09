var mysql = require( 'mysql');
var connection = mysql. createConnection ( {
    host: 'localhost',
    user: 'demo', 
    password: 'password',
    database: 'webDemo'
});
module.exports = connection;