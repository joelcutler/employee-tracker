const mysql = require("mysql2");

// Connect to database
const db = mysql.createConnection(
  {
    host: "localhost",
    // Your MySQL username,
    user: "root",
    // Your MySQL password
    password: "m242803m!MYSQL",
    database: "biz",
  },
  console.log("Connected to the Biz employee tracking database.")
);

module.exports = db;