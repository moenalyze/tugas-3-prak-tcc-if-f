const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Koneksi Database
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

// Endpoint Default
app.get('/', (req, res) => {
    res.send('Backend Notes App Running!');
});

// 1. GET: Ambil Semua Catatan
app.get('/notes', (req, res) => {
    const sql = "SELECT * FROM notes ORDER BY createdAt DESC";
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
});

// 2. POST: Tambah Catatan Baru
app.post('/notes', (req, res) => {
    const { judul, isi } = req.body;
    const sql = "INSERT INTO notes (judul, isi, createdAt, updatedAt) VALUES (?, ?, NOW(), NOW())";
    
    db.query(sql, [judul, isi], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: "Catatan berhasil ditambahkan", id: result.insertId });
    });
});

// 3. PUT: Edit Catatan
app.put('/notes/:id', (req, res) => {
    const { id } = req.params;
    const { judul, isi } = req.body;
    const sql = "UPDATE notes SET judul = ?, isi = ?, updatedAt = NOW() WHERE id = ?";
    
    db.query(sql, [judul, isi, id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ message: "Catatan berhasil diupdate" });
    });
});

// 4. DELETE: Hapus Catatan
app.delete('/notes/:id', (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM notes WHERE id = ?";
    
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ message: "Catatan berhasil dihapus" });
    });
});

app.listen(5000, () => console.log('Server running on port 5000'));