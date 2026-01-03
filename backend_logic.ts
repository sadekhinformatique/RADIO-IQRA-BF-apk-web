
/**
 * CE FICHIER EST À UTILISER SUR VOTRE SERVEUR INFOMANIAK (server.js)
 * Il gère SQLite, PM2 et la logique de fallback.
 */

/*
import express from 'express';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import fetch from 'node-fetch';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

// Setup SQLite
const dbPromise = open({
  filename: './radio.sqlite',
  driver: sqlite3.Database
});

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());

// Logic Fallback
app.get('/api/stream-check', async (req, res) => {
  const STREAM_URL = "http://votre-flux.com/live";
  try {
    const response = await fetch(STREAM_URL, { method: 'HEAD', timeout: 3000 });
    if (response.ok) {
      return res.json({ status: 'live', url: STREAM_URL });
    }
    throw new Error("Stream down");
  } catch (e) {
    // Si flux mort, on renvoie une playlist locale stockée en JSON
    const db = await dbPromise;
    const backupSongs = await db.all('SELECT url FROM fallback_playlist');
    res.json({ status: 'fallback', playlist: backupSongs });
  }
});

// Admin Middleware
const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader === 'votre_cle_secrete') return next();
  res.status(401).send('Unauthorized');
};

app.post('/api/admin/update', auth, async (req, res) => {
  const { stationName, streamUrl } = req.body;
  const db = await dbPromise;
  await db.run('UPDATE settings SET value = ? WHERE key = "stationName"', stationName);
  res.json({ success: true });
});

app.listen(PORT, () => console.log(`Serveur Radio lancé sur port ${PORT}`));
*/
