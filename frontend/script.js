const API_URL = 'http://localhost:3000';

// Elements
const clientSelect = document.getElementById('clientSelect');
const semaineSelect = document.getElementById('semaineSelect');
const repasTableBody = document.querySelector('#repasTable tbody');

// Form inputs and selectors for adding data
const inputClientPrenom = document.getElementById('clientPrenom');
const inputClientNom = document.getElementById('clientNom');
const inputClientEmail = document.getElementById('clientEmail');
const btnAddClient = document.getElementById('btnAddClient');

const selectNewSemaineClient = document.getElementById('newSemaineClient');
const inputNewSemaineCode = document.getElementById('newSemaineCode');
const inputNewSemaineDate = document.getElementById('newSemaineDate');
const btnAddSemaine = document.getElementById('btnAddSemaine');

const selectNewRepasSemaine = document.getElementById('newRepasSemaine');
const inputNewRepasJour = document.getElementById('newRepasJour');
const inputNewRepasMoment = document.getElementById('newRepasMoment');
const inputNewRepasMenu = document.getElementById('newRepasMenu');
const inputNewRepasCalories = document.getElementById('newRepasCalories');
const btnAddRepas = document.getElementById('btnAddRepas');

// Load data at startup
document.addEventListener('DOMContentLoaded', async () => {
  await loadClients();
  await loadSemaines();
  await loadRepas();

  clientSelect.addEventListener('change', () => {
    loadSemaines();
  });

  semaineSelect.addEventListener('change', () => {
    loadRepas();
  });

  // Ajout d'un client
  btnAddClient.addEventListener('click', async () => {
    const prenom = inputClientPrenom.value.trim();
    const nom = inputClientNom.value.trim();
    const email = inputClientEmail.value.trim();
    if (!prenom || !nom) {
      alert('Veuillez renseigner un prénom et un nom.');
      return;
    }
    try {
      const res = await fetch(`${API_URL}/clients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prenom, nom, email })
      });
      if (res.ok) {
        inputClientPrenom.value = '';
        inputClientNom.value = '';
        inputClientEmail.value = '';
        await loadClients();
        await loadSemaines();
        populateNewSemaineClient();
        alert('Client ajouté !');
      }
    } catch (err) {
      console.error('Erreur ajout client:', err);
    }
  });

  // Ajout d'une semaine
  btnAddSemaine.addEventListener('click', async () => {
    const clientId = selectNewSemaineClient.value;
    const semaine = inputNewSemaineCode.value.trim();
    const dateDebut = inputNewSemaineDate.value;
    if (!clientId || !semaine) {
      alert('Veuillez choisir un client et renseigner le code semaine.');
      return;
    }
    try {
      const res = await fetch(`${API_URL}/semaines`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId, semaine, dateDebut })
      });
      if (res.ok) {
        inputNewSemaineCode.value = '';
        inputNewSemaineDate.value = '';
        await loadSemaines();
        populateNewRepasSemaine();
        alert('Semaine ajoutée !');
      }
    } catch (err) {
      console.error('Erreur ajout semaine:', err);
    }
  });

  // Ajout d'un repas
  btnAddRepas.addEventListener('click', async () => {
    const semaineId = selectNewRepasSemaine.value;
    const jour = inputNewRepasJour.value.trim();
    const moment = inputNewRepasMoment.value.trim();
    const menu = inputNewRepasMenu.value.trim();
    const calories = inputNewRepasCalories.value;
    if (!semaineId || !jour || !moment || !menu) {
      alert('Veuillez compléter tous les champs requis.');
      return;
    }
    try {
      const res = await fetch(`${API_URL}/repas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ semaineId, jour, moment, menu, calories })
      });
      if (res.ok) {
        inputNewRepasJour.value = '';
        inputNewRepasMoment.value = '';
        inputNewRepasMenu.value = '';
        inputNewRepasCalories.value = '';
        await loadRepas();
        alert('Repas ajouté !');
      }
    } catch (err) {
      console.error('Erreur ajout repas:', err);
    }
  });
});

async function loadClients() {
  try {
    const res = await fetch(`${API_URL}/clients`);
    const data = await res.json();
    clientSelect.innerHTML = '';
    data.forEach(client => {
      const option = document.createElement('option');
      option.value = client.id;
      option.textContent = `${client.prenom} ${client.nom}`;
      clientSelect.appendChild(option);
    });
    // Mettre à jour les sélecteurs de formulaires
    populateNewSemaineClient();
  } catch (err) {
    console.error('Erreur chargement clients:', err);
  }
}

async function loadSemaines() {
  try {
    const clientId = clientSelect.value;
    const url = clientId ? `${API_URL}/semaines?clientId=${clientId}` : `${API_URL}/semaines`;
    const res = await fetch(url);
    const filtered = await res.json();
    semaineSelect.innerHTML = '';
    filtered.forEach(s => {
      const option = document.createElement('option');
      option.value = s.id;
      option.textContent = s.semaine;
      semaineSelect.appendChild(option);
    });
    // Charger les repas pour la première semaine du client
    await loadRepas();
    populateNewRepasSemaine();
  } catch (err) {
    console.error('Erreur chargement semaines:', err);
  }
}

async function loadRepas() {
  try {
    const semaineId = semaineSelect.value;
    const url = semaineId ? `${API_URL}/repas?semaineId=${semaineId}` : `${API_URL}/repas`;
    const res = await fetch(url);
    const data = await res.json();
    // Afficher dans le tableau
    repasTableBody.innerHTML = '';
    data.forEach(rep => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${rep.jour}</td>
        <td>${rep.moment}</td>
        <td>${rep.menu}</td>
        <td>${rep.calories}</td>
      `;
      repasTableBody.appendChild(tr);
    });
  } catch (err) {
    console.error('Erreur chargement repas:', err);
  }
}

// Remplit le sélecteur des clients pour le formulaire d’ajout de semaine
function populateNewSemaineClient() {
  fetch(`${API_URL}/clients`)
    .then(res => res.json())
    .then(data => {
      selectNewSemaineClient.innerHTML = '';
      data.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c.id;
        opt.textContent = `${c.prenom} ${c.nom}`;
        selectNewSemaineClient.appendChild(opt);
      });
    })
    .catch(err => console.error(err));
}

// Remplit le sélecteur des semaines pour le formulaire d’ajout de repas
function populateNewRepasSemaine() {
  fetch(`${API_URL}/semaines`)
    .then(res => res.json())
    .then(data => {
      selectNewRepasSemaine.innerHTML = '';
      data.forEach(s => {
        const opt = document.createElement('option');
        opt.value = s.id;
        opt.textContent = `${s.semaine} (client ${s.clientId})`;
        selectNewRepasSemaine.appendChild(opt);
      });
    })
    .catch(err => console.error(err));
}