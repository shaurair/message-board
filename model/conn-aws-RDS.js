require('dotenv').config();
const util = require('util');
const mysql = require('mysql');
const pool = mysql.createPool({
    host: process.env.RDS_HOST,
    port: process.env.RDS_PORT,
    user: process.env.RDS_USER,
    password: process.env.RDS_PASSWORD,
    database: process.env.RDS_DB,
    waitForConnections: true,
    connectionLimit: 5
})

pool.getConnection((err, conn) => {
    if(err) throw err;
})
pool.query = util.promisify(pool.query);

async function getMessagesFromDB() {
    let sql = 'SELECT * FROM message ORDER BY id DESC;';
    try {
        let results = await pool.query(sql);

        return {data: results, statusCode: 200}
    }
    catch(error) {
        let errorMessage = {};
        errorMessage["error"] = true;
        errorMessage["message"] = "資料庫操作有誤";

        return {data: errorMessage, statusCode: 500}
    }
}

async function addMessagesToDB(text, imageFilename) {
    let sql = "INSERT INTO message(text, image_filename) VALUES (?,?);";
    try {
        let result = await pool.query(sql, [text, imageFilename]);

        return {data: result, statusCode: 200}
    }
    catch(error) {
        let errorMessage = {};
        errorMessage["error"] = true;
        errorMessage["message"] = "資料庫操作有誤";

        return {data: errorMessage, statusCode: 500}
    }
}

module.exports = {
    getMessagesFromDB: getMessagesFromDB,
    addMessagesToDB: addMessagesToDB
}