var mysql = require('promise-mysql');
var connection;

console.log('Trying to connect to database');

mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "cs731"
}).then(conn => {
    console.log("Connected to database!");
    connection = conn;
}).catch(e => {
    console.error('Failed to connect to database');
    throw e;
});

module.exports.conn = () => connection;