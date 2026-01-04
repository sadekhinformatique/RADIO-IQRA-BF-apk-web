
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
// Render fournit automatiquement la variable PORT
const PORT = process.env.PORT || 10000; 

app.use(express.json());

// Servir les fichiers statiques (racine et dossier dist généré par esbuild)
app.use(express.static(path.join(__dirname, '.')));
app.use('/dist', express.static(path.join(__dirname, 'dist')));

// API simple pour tester la santé de l'app sur Render
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', station: "Radio Iqra BF" });
});

// Support du routage React (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[Radio Iqra] Serveur actif sur le port ${PORT}`);
});
