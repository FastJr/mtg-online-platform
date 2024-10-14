// server/src/index.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test Route
app.get('/', (req, res) => {
  res.send('Back-End Server is Running');
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
