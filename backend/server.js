const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Autoriser les requêtes cross‑origin depuis le front
app.use(cors());
app.use(express.json());

const fs = require('fs');
const path = require('path');

// Chemin vers le fichier de base de données JSON
const dbPath = path.join(__dirname, 'db.json');

// Lire la base de données JSON en mémoire
function readDB() {
  try {
    const raw = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Erreur lecture DB:', err);
    return { clients: [], semaines: [], repas: [] };
  }
}

// Écrire la base de données en mémoire dans le fichier JSON
function writeDB(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
}

// Routes API
app.get('/', (req, res) => {
  res.json({ message: 'Bienvenue sur l’API AirNutri !' });
});

// Liste des clients
app.get('/clients', (req, res) => {
  const db = readDB();
  res.json(db.clients);
});

// Ajouter un client
app.post('/clients', (req, res) => {
  const db = readDB();
  const { prenom, nom, email } = req.body;
  if (!prenom || !nom) {
    return res.status(400).json({ error: 'Prénom et nom requis' });
  }
  const newId = db.clients.length > 0 ? Math.max(...db.clients.map(c => c.id)) + 1 : 1;
  const newClient = { id: newId, prenom, nom, email: email || '' };
  db.clients.push(newClient);
  writeDB(db);
  res.status(201).json(newClient);
});

// Obtenir un client par son id
app.get('/clients/:id', (req, res) => {
  const db = readDB();
  const client = db.clients.find(c => c.id === parseInt(req.params.id, 10));
  if (!client) {
    return res.status(404).json({ error: 'Client non trouvé' });
  }
  res.json(client);
});

// Liste des semaines
app.get('/semaines', (req, res) => {
  const db = readDB();
  const { clientId } = req.query;
  let list = db.semaines;
  if (clientId) {
    list = list.filter(s => s.clientId === parseInt(clientId, 10));
  }
  res.json(list);
});

// Ajouter une semaine
app.post('/semaines', (req, res) => {
  const db = readDB();
  const { clientId, semaine, dateDebut } = req.body;
  if (!clientId || !semaine) {
    return res.status(400).json({ error: 'clientId et semaine requis' });
  }
  const newId = db.semaines.length > 0 ? Math.max(...db.semaines.map(s => s.id)) + 1 : 1;
  const newSemaine = { id: newId, clientId: parseInt(clientId, 10), semaine, dateDebut: dateDebut || '' };
  db.semaines.push(newSemaine);
  writeDB(db);
  res.status(201).json(newSemaine);
});

// Liste des repas (filtrés par semaineId si fourni)
app.get('/repas', (req, res) => {
  const db = readDB();
  const { semaineId } = req.query;
  let list = db.repas;
  if (semaineId) {
    list = list.filter(r => r.semaineId === parseInt(semaineId, 10));
  }
  res.json(list);
});

// Ajouter un repas
app.post('/repas', (req, res) => {
  const db = readDB();
  const { semaineId, jour, moment, menu, calories } = req.body;
  if (!semaineId || !jour || !moment || !menu) {
    return res.status(400).json({ error: 'semaineId, jour, moment et menu requis' });
  }
  const newId = db.repas.length > 0 ? Math.max(...db.repas.map(r => r.id)) + 1 : 1;
  const newRepas = {
    id: newId,
    semaineId: parseInt(semaineId, 10),
    jour,
    moment,
    menu,
    calories: calories ? parseInt(calories, 10) : null
  };
  db.repas.push(newRepas);
  writeDB(db);
  res.status(201).json(newRepas);
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur AirNutri en écoute sur http://localhost:${PORT}`);
});