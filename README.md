# 📊 PoPoll – Strawpoll Cloud App

PoPoll est une application de type **Strawpoll** permettant de créer des sondages et de voter en ligne.  
Le projet est déployé **entièrement sur Microsoft Azure**, avec une infrastructure définie en **Infrastructure as Code (Terraform)**.

**Note à nous-mêmes :** ne plus jamais utiliser Azure Functions pour ce type de projet.
Après une bonne vingtaine de correctifs pour tenter de faire fonctionner quelque chose de simple, le constat est clair : un App Service avec un backend Express est bien plus fiable, plus lisible et surtout beaucoup plus simple à déployer.

---

## 🏗️ Architecture

```
Frontend (React / Vite)
        |
        | HTTPS (REST)
        v
Backend API (Node.js / Express)
        |
        v
Azure Cosmos DB (NoSQL)
```

### Technologies utilisées
- **Frontend** : React, TypeScript, Vite
- **Backend** : Node.js, Express, TypeScript
- **Base de données** : Azure Cosmos DB (SQL API, serverless)
- **Cloud** : Microsoft Azure
- **Infrastructure as Code** : Terraform
- **CI/CD** : GitHub Actions
- **Hébergement Frontend** : Azure Static Web Apps
- **Hébergement Backend** : Azure App Service (Linux)

---

## 📁 Structure du projet

```
PoPoll/
├── frontend/          # Application React
├── api/               # Backend Node.js / Express
│   └── src/
│       └── server.ts
├── infra/             # Infrastructure Terraform
├── .github/workflows/ # CI/CD GitHub Actions
└── README.md
```

---

## ⚙️ Fonctionnalités

### Sondages
- Création de sondages (choix simple ou multiple)
- Liste des sondages
- Consultation d’un sondage
- Vote sur un sondage

### API REST
| Méthode | Route | Description |
|------|------|------------|
| GET | `/polls` | Liste des sondages |
| GET | `/polls/:id` | Détails d’un sondage |
| POST | `/polls` | Créer un sondage |
| POST | `/polls/:id/vote` | Voter |

---

## 🚀 Déploiement

### Prérequis
- Node.js **>= 20**
- Terraform **>= 1.5**
- Azure CLI (`az login`)
- Compte GitHub

### Déploiement de l’infrastructure
```bash
cd infra
terraform init
terraform apply
```

Terraform crée automatiquement :
- Resource Group
- Cosmos DB
- App Service (API)
- Static Web App (Frontend)

---

## 🔄 CI/CD

Un pipeline GitHub Actions est configuré :
- Build du frontend
- Build du backend
- Déploiement automatique sur Azure à chaque `push` sur `main`

Secret GitHub requis :
- `AZURE_STATIC_WEB_APPS_API_TOKEN`

---

## 🔐 Variables d’environnement (Backend)

Configurées automatiquement via Terraform :
- `COSMOS_CONNECTION_STRING`
- `COSMOS_DB_NAME`
- `COSMOS_CONTAINER_NAME`
- `ALLOWED_ORIGIN`

---

## 🧪 Lancer en local (optionnel)

### Backend
```bash
cd api
npm install
npm run build
npm start
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 🎯 Objectifs pédagogiques

- Architecture cloud complète
- Séparation frontend / backend
- Infrastructure as Code
- Déploiement automatisé
- Utilisation d’une base NoSQL distribuée

---

## 👨‍💻 Auteur

Projet réalisé dans un cadre académique, démontrant la mise en place d’une application cloud moderne et déployable de manière reproductible.
