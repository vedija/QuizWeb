require('dotenv').config();
const express = require("express");
const path = require('path');
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'frontend/pages'))); 
app.use(express.json());


// MySQL connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "ch@shmish2006",
    database: "quizwitz"
});



db.connect((err) => {
    if (err) throw err;
    console.log("MySQL connected...");
});

// Login endpoint
app.post("/login", (req, res) => {
    console.log('Login request received:', req.body);
    const { username, password, gender } = req.body;

    // Check if username exists
    db.query("SELECT * FROM users WHERE username = ?", [username], (err, result) => {
        if (err) return res.status(500).json({ message: "Server error" });
        
        if (result.length > 0) {
            return res.json({ success: false, message: "Username already exists" });
        }

        // Insert new user
        db.query("INSERT INTO users (username, password, gender) VALUES (?, ?, ?)", 
            [username, password, gender],
            (err, result) => {
                if (err) return res.status(500).json({ message: "Server error" });
                res.json({ success: true });
            }
        );
    });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Endpoint to fetch available subjects
app.get("/subjects", (req, res) => {
    db.query("SELECT name, slogan FROM subjects", (err, results) => {
        if (err) return res.status(500).json({ message: "Error fetching subjects" });
        res.json(results);
    });
});

