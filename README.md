# Installation du projet PoPoll

Ce document décrit **pas à pas** la procédure permettant de déployer le projet de manière autonome à l’aide de **Terraform**, **Azure CLI** et du **pipeline CI/CD fourni**.

---

## 🏗️ Architecture de l’application

L’application **PoPoll** repose sur une architecture **cloud simple et modulaire**, entièrement déployée sur **Microsoft Azure**.

### Vue d’ensemble

- **Frontend**  
  Application web développée en **React** et déployée sur **Azure Static Web Apps**.  
  Elle gère l’interface utilisateur (création de sondages, vote, affichage des résultats).

- **Backend**  
  API REST déployée sur **Azure App Service (Linux)**.  
  Elle expose les endpoints nécessaires à la gestion des sondages et des votes.

- **Base de données**  
  Base de données **NoSQL** (Azure Cosmos DB) utilisée pour stocker :
  - les sondages
  - les options
  - les résultats de vote

- **Infrastructure as Code**  
  L’ensemble de l’infrastructure est décrit via **Terraform**, garantissant un déploiement reproductible et automatisé.

- **CI/CD**  
  Le déploiement applicatif est automatisé via **GitHub Actions**.

### Schéma logique (simplifié)

```
[ Navigateur ]
      |
      v
[ Azure Static Web App ]
      |
      v
[ Azure App Service (API) ]
      |
      v
[ Azure Cosmos DB ]
```

---

## 🔗 Accès à une instance déjà déployée (démonstration)

Une instance de démonstration est disponible à l’adresse suivante :

```
https://victorious-flower-03f193303.3.azurestaticapps.net
```

---

## Prérequis

- Un compte **GitHub**
- Un compte **Azure**
- **Azure CLI** installé
- **Terraform** installé
- **Git** installé

---

## 1️⃣ Création du dépôt (Fork)

1. Se rendre sur le dépôt GitHub du projet
2. Cliquer sur **Fork**
3. Créer le fork sur son propre compte GitHub

Le fork est nécessaire pour :
- disposer de son propre pipeline CI/CD
- configurer ses propres secrets GitHub
- déployer le projet indépendamment

---

## 2️⃣ Récupération complète du projet

Cloner le dépôt forké :

```bash
git clone <url-du-depot-forke>
cd <nom-du-depot>
```

⚠️ Le projet doit être récupéré **dans son intégralité**, y compris les dossiers :
- `frontend`
- `api`
- `infra`
- `.github`

---

## 3️⃣ Accès au dossier d’infrastructure

Depuis la racine du projet :

```bash
cd infra
```

---

## 4️⃣ Connexion à Azure

```bash
az login
```

Une fenêtre de connexion s’ouvre dans le navigateur.  
Une fois la connexion terminée, revenir au terminal.

---

## 5️⃣ Initialisation de Terraform

```bash
terraform init
```

---

## 6️⃣ Déploiement de l’infrastructure Azure

```bash
terraform apply
```

Confirmer le déploiement avec :

```text
yes
```

Terraform crée automatiquement :
- le Resource Group
- l’Azure App Service (backend)
- l’Azure Static Web App (frontend)
- les ressources associées

---

## 7️⃣ Récupération des clés secrètes (commandes)

### 🔐 Clé Static Web App (frontend)

```bash
terraform output -raw static_web_app_api_key
```

---

### 🔐 Nom de la Web App backend

```bash
terraform output -raw api_app_name
```

---

### 🔐 Publish Profile du backend

```bash
az webapp deployment list-publishing-profiles --name "$(terraform output -raw api_app_name)" --resource-group "$(terraform output -raw resource_group_name)" --xml
```

Résultat : <publishData>...</publishData>

---

## 8️⃣ Configuration des secrets GitHub

Dans le dépôt forké :

```
Settings → Secrets and variables → Actions → New repository secret
```

Ajouter les **3 secrets suivants** :

| Nom du secret | Valeur |
|--------------|--------|
| `AZURE_STATIC_WEB_APPS_API_TOKEN` | clé Static Web App |
| `AZURE_WEBAPP_NAME` | nom de la Web App backend |
| `AZURE_WEBAPP_PUBLISH_PROFILE` | XML du publish profile |

---

## 9️⃣ Configuration de l’URL de l’API (frontend)

Avant de configurer le frontend, il est nécessaire de **récupérer l’URL publique du backend**.

- Via Terraform (recommandé) : `terraform output -raw api_base_url`
- Ou via le **Portail Azure** → App Services → Web App backend → *Default domain*

---

### ✏️ Modification du fichier frontend

Modifier le fichier suivant :

```text
/frontend/.env.production
```

Remplacer la valeur par l’URL du backend récupérée précédemment :

```env
VITE_API_URL=https://api-popoll-xxxx.azurewebsites.net
```

---

## 🔟 Déclenchement du déploiement applicatif

```bash
git commit -m "Initial deployment"
git push origin main
```

---

## 🏁 Accès à l’application déployée

Une fois le **pipeline GitHub Actions terminé avec succès** :

1. Se rendre sur le **Portail Azure**
2. Aller dans **Static Web Apps**
3. Sélectionner la Static Web App créée
4. Cliquer sur le **lien affiché dans “Overview”**

L’application s’ouvre alors directement dans le navigateur.

---

## ✅ Résultat attendu

- infrastructure Azure créée
- secrets GitHub configurés
- frontend et backend déployés automatiquement
- application accessible publiquement
