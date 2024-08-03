const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Servir les fichiers statiques du répertoire 'game' et 'final'
app.use(express.static(path.join(__dirname, 'game')));
app.use('/final', express.static(path.join(__dirname, 'final')));

// Route pour la page principale
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'game', 'index.html'));
});

app.listen(port, () => {
  console.log(`Serveur en écoute sur http://localhost:${port}`);
});
