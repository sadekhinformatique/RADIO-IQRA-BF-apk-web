
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');

// Chargement des variables d'environnement
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware pour le JSON
app.use(express.json());

// Servir les fichiers statiques (le build de l'application)
// Sur Infomaniak, les fichiers statiques sont souvent dans le même dossier ou un sous-dossier 'public'
app.use(express.static(path.join(__dirname, '.')));

// API : Vérification de l'état du flux (Proxy optionnel pour éviter les erreurs CORS)
app.get('/api/status', (req, res) => {
  res.json({ 
    status: 'online', 
    timestamp: new Date().toISOString(),
    station: "Radio Iqra BF"
  });
});

// Routage SPA : Rediriger toutes les requêtes vers index.html
// Crucial pour que React Router (HashRouter ou BrowserRouter) fonctionne
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`[Radio Iqra] Serveur démarré sur le port ${PORT}`);
  console.log(`[Mode] ${process.env.NODE_ENV || 'development'}`);
});
