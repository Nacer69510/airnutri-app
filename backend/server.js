const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Autoriser les requêtes cross‑origin depuis le front
app.use(cors());
app.use(express.json());

// Exemple de données statiques.
// À terme, ces données seront remplacées par des appels à Airtable ou une base de données.
const clients = [
  { id: 1, prenom: 'Nacer', nom: 'Bennour', email: 'nacer@example.com' },
  { id: 2, prenom: 'Marion', nom: 'Dupont', email: 'marion@example.com' }
];

const semaines = [
  { id: 1, clientId: 1, semaine: '2024‑S37', dateDebut: '2024-09-09' },
  { id: 2, clientId: 2, semaine: '2024‑S37', dateDebut: '2024-09-09' }
];

const repas = [
  { id: 1, semaineId: 1, jour: 'Lundi', moment: 'Petit déjeuner', menu: 'Porridge aux fruits', calories: 350 },
  { id: 2, semaineId: 1, jour: 'Lundi', moment: 'Déjeuner', menu: 'Poulet grillé et quinoa', calories: 600 },
  { id: 3, semaineId: 1, jour: 'Lundi', moment: 'Dîner', menu: 'Saumon et légumes', calories: 500 }
];

// Routes API
app.get('/', (req, res) => {
  res.json({ message: 'Bienvenue sur l’API AirNutri !' });
});

// Liste des clients
app.get('/clients', (req, res) => {
  res.json(clients);
});

// Liste des semaines
app.get('/semaines', (req, res) => {
  res.json(semaines);
});

// Liste des repas (filtrés par semaineId si fourni)
app.get('/repas', (req, res) => {
  const { semaineId } = req.query;
  if (semaineId) {
    const filtered = repas.filter(r => r.semaineId === parseInt(semaineId, 10));
    return res.json(filtered);
  }
  res.json(repas);
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur AirNutri en écoute sur http://localhost:${PORT}`);
});