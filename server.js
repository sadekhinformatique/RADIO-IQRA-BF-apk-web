
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000; 

app.use(express.json());

// Ordre important : d'abord le dossier dist, puis la racine
app.use('/dist', express.static(path.join(__dirname, 'dist')));
app.use(express.static(path.join(__dirname, '.')));

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', station: "Radio Iqra BF" });
});

// Pour toutes les autres routes, renvoyer index.html (SPA routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[Radio Iqra] Serveur actif sur le port ${PORT}`);
});
