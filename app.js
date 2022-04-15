const db = require("./db/connection");

// Start DB connection
db.connect((err) => {
    if (err) throw err;
    });