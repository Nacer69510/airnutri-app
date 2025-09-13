const API_URL = 'http://localhost:3000';

// Elements
const clientSelect = document.getElementById('clientSelect');
const semaineSelect = document.getElementById('semaineSelect');
const repasTableBody = document.querySelector('#repasTable tbody');

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
  } catch (err) {
    console.error('Erreur chargement clients:', err);
  }
}

async function loadSemaines() {
  try {
    const res = await fetch(`${API_URL}/semaines`);
    const data = await res.json();
    const clientId = parseInt(clientSelect.value, 10);
    const filtered = data.filter(s => s.clientId === clientId);
    semaineSelect.innerHTML = '';
    filtered.forEach(s => {
      const option = document.createElement('option');
      option.value = s.id;
      option.textContent = s.semaine;
      semaineSelect.appendChild(option);
    });
    // Charger les repas pour la première semaine du client
    await loadRepas();
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