
# Guide de déploiement Infomaniak (Node.js)

Suivez ces étapes pour mettre en ligne votre application sur l'hébergement Web Infomaniak.

## 1. Préparation dans le Manager Infomaniak
1. Connectez-vous à votre interface Infomaniak.
2. Allez dans **Hébergement Web** > Votre domaine.
3. Dans le menu de gauche, sélectionnez **Serveur Cloud** ou **Hébergement Web** (vérifiez que vous avez l'option "Node.js").
4. Créez une application Node.js :
   - **Version Node.js** : Choisissez 18 ou plus.
   - **Dossier racine** : Sélectionnez le dossier où vous allez uploader le code.
   - **Port** : Notez le port attribué (ex: 3000).

## 2. Configuration du Reverse Proxy
Infomaniak utilise un reverse proxy pour lier votre domaine au port Node.js :
1. Allez dans la gestion de votre site.
2. Cherchez l'onglet **Outils** ou **Node.js**.
3. Configurez la redirection : `Proxy inverse` -> `localhost:3000` (remplacez 3000 par votre port).

## 3. Déploiement via SSH
Connectez-vous à votre serveur via Terminal :
```bash
ssh user@votre-domaine.com
cd public_html/radio-app
```

Installez les dépendances :
```bash
npm install
```

## 4. Configuration PM2 (ecosystem.config.js)
Créez un fichier nommé `ecosystem.config.js` à la racine :
```javascript
module.exports = {
  apps : [{
    name: "radio-live",
    script: "server.js",
    watch: true,
    env: {
      NODE_ENV: "production",
      PORT: 3000,
      API_KEY: "VOTRE_CLE_GEMINI"
    }
  }]
}
```

Lancez l'application pour qu'elle redémarre seule :
```bash
pm2 start ecosystem.config.js
pm2 save
```

## 5. Base de données SQLite
Uploadez simplement votre fichier `radio.sqlite` dans le dossier racine. SQLite ne nécessite aucune configuration de serveur supplémentaire (un seul fichier à transférer).

## 6. Routage Express
Assurez-vous que votre fichier `server.js` redirige toutes les requêtes non-API vers l'index pour le SPA :
```javascript
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
```
