const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 1. Servir le build React (Fichiers statiques)
app.use(express.static(path.join(__dirname, 'build')));

// 2. CATCH-ALL pour toutes les routes React (Doit être la dernière !)
app.use((req, res) => {
    // Si la requête n'est pas un fichier statique, on renvoie index.html pour que React Router puisse fonctionner
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// 3. Lancer le serveur
app.listen(PORT, () => {
    console.log(`Frontend running on port ${PORT}`);
});