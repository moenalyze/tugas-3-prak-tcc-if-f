const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) throw err;
    console.log('Database connected!');
});

app.get('/', (req, res) => {
    res.send('Backend Notes App Running!');
});

app.get('/notes', (req, res) => {
    const sql = "SELECT * FROM notes ORDER BY createdAt DESC";
    db.query(sql, (err, result) => {
        if (err) return res.status(500).send(err);
        res.json(result);
    });
});

app.listen(5000, () => console.log('Server running on port 5000'));