import express from 'express';
import sqlite3 from 'sqlite3';
import cors from 'cors';
import path from 'path';

const app = express();
const db = new sqlite3.Database('./items.db');

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/items', (req, res) => {
    db.all('SELECT * FROM items', [], (err, rows) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json(rows);
    });
});

app.post('/items', (req, res) => {
    const { name, description } = req.body;
    db.run('INSERT INTO items (name, description) VALUES (?, ?)', [name, description], function(err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.status(201).json({ id: this.lastID });
    });
});

app.put('/items/:id', (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;
    db.run('UPDATE items SET name = ?, description = ? WHERE id = ?', [name, description, id], function(err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ id });
    });
});

app.patch('/items/:id', (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;

    const updates = [];
    const params = [];

    if (name) {
        updates.push('name = ?');
        params.push(name);
    }
    if (description) {
        updates.push('description = ?');
        params.push(description);
    }

    if (updates.length === 0) {
        return res.status(400).json({ error: 'No fields to update' });
    }

    params.push(id);

    const sql = `UPDATE items SET ${updates.join(', ')} WHERE id = ?`;

    db.run(sql, params, function(err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ id });
    });
});

app.delete('/items/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM items WHERE id = ?', id, function(err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ id });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});