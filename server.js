
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000; 

// Logging middleware for debugging on Render
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

app.use(express.json());

// Serve dist folder with high priority
app.use('/dist', express.static(path.join(__dirname, 'dist')));

// Serve root static files (index.html, etc.)
app.use(express.static(path.join(__dirname, '.')));

// API for Render Uptime/Health
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'online', 
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV 
  });
});

// Catch-all for React Router SPA logic
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log('====================================');
  console.log(`🚀 Radio Iqra Server is running!`);
  console.log(`📡 Port: ${PORT}`);
  console.log(`🌍 Mode: ${process.env.NODE_ENV || 'development'}`);
  console.log('====================================');
});
