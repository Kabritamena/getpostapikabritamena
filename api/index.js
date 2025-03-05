// api/index.js
const express = require('express');
const serverless = require('serverless-http');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();
app.use(express.json());

// Create a connection to the Azure MySQL database
const connection = mysql.createConnection({
  host: process.env.DB_HOST,     // e.g., shopifytempdb.mysql.database.azure.com
  user: process.env.DB_USER,     // Your username stored in env var
  password: process.env.DB_PASS, // Your password stored in env var
  database: process.env.DB_NAME  // shopify
});

connection.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Connected to the database.');
  }
});

// GET /data: Fetch data from the database
app.get('/data', (req, res) => {
  connection.query('SELECT * FROM tokens', (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database query error' });
    }
    res.json(results);
  });
});

// POST /data: Insert data into the database
app.post('/data', (req, res) => {
  const data = req.body;
  connection.query('INSERT INTO your_table SET ?', data, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database insert error' });
    }
    res.json({ success: true, id: result.insertId });
  });
});

// Export the Express app wrapped in a serverless handler
module.exports = app;
module.exports.handler = serverless(app);
