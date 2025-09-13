# AirNutri App

Ce dépôt contient un squelette d’application pour **Personal Coach’In**, conçu pour vous aider à démarrer rapidement le développement d’une application web et mobile destinée à la gestion du coaching sportif, de la nutrition et de la livraison de repas personnalisés.

## Architecture du projet

Le projet est découpé en deux parties principales :

* **backend/** : un serveur Node.js/Express qui expose des endpoints pour gérer les clients, les semaines, les repas et autres ressources. Ces routes sont pour l’instant des exemples et devront être connectées à votre base de données (Airtable ou autre).
* **frontend/** : une interface frontale minimaliste (HTML/CSS/JS) qui consomme l’API du back‑end. Elle sert de point de départ pour la future application web et pourra être convertie en application mobile via des technologies hybrides (React Native, Expo, etc.).

## Mise en route

### Prérequis

* [Node.js](https://nodejs.org/) ≥ 16.x installé sur votre machine.
* Un accès à vos données (par exemple via l’API Airtable) si vous souhaitez les brancher dès maintenant.

### Installation

1. Clonez ce dépôt :

```bash
git clone https://github.com/votre-utilisateur/airnutri-app.git
cd airnutri-app
```

2. Installez les dépendances du serveur :

```bash
cd backend
npm install
```

3. Démarrez le serveur :

```bash
npm start
```

Le serveur écoute par défaut sur `http://localhost:3000`.

4. Ouvrez l’interface frontale :

```bash
cd ../frontend
npm install
npm start
```

La page web sera disponible sur `http://localhost:3001` et se connectera au back‑end.

## Prochaines étapes

* Connecter les routes du back‑end à Airtable (ou autre base de données) pour récupérer et mettre à jour les données réelles.
* Remplacer l’interface frontale par une application plus riche (React, Vue, Angular) ou utiliser React Native/Expo pour générer des applications mobiles.
* Mettre en place une authentification (JWT, OAuth) pour sécuriser l’accès selon les rôles (coach, client, admin).
* Ajouter des fonctionnalités avancées comme la génération automatique de plans de repas en fonction des objectifs, la prise de rendez‑vous, le suivi des paiements et la gestion des livraisons.

Ce dépôt est volontairement minimal pour servir de base. N’hésitez pas à l’enrichir selon vos besoins !