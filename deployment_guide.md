
# Guide de déploiement sur Render

## 1. Préparer le code
- Assurez-vous d'avoir un compte [GitHub](https://github.com) ou [GitLab].
- Créez un nouveau dépôt et poussez votre code (y compris les nouveaux fichiers `render.yaml` et `server.js`).

## 2. Créer le service sur Render
1. Connectez-vous sur [dashboard.render.com](https://dashboard.render.com).
2. Cliquez sur **New +** puis **Blueprint**.
3. Connectez votre dépôt Git.
4. Render détectera automatiquement le fichier `render.yaml`.
5. Cliquez sur **Approve**.

## 3. Configuration de l'API Gemini
Comme le fichier `render.yaml` a défini `sync: false` pour la clé API :
1. Dans votre dashboard Render, allez dans votre service **radio-iqra-bf**.
2. Allez dans l'onglet **Environment**.
3. Ajoutez une variable nommée `API_KEY`.
4. Collez votre clé API Google Gemini.
5. Enregistrez. Le service va redémarrer automatiquement.

## 4. Avantages de Render
- **SSL Gratuit** : Votre site sera automatiquement en HTTPS.
- **Auto-Deploy** : Chaque fois que vous poussez sur GitHub, le site se met à jour.
- **Logs** : Visualisez les logs en temps réel dans l'onglet 'Logs'.
