# Installation du projet PoPoll

Ce document décrit **pas à pas** la procédure permettant à l’enseignant de déployer le projet de manière autonome à l’aide de **Terraform**, **Azure CLI** et du **pipeline CI/CD fourni**.

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
az staticwebapp secrets list --name <static_web_app_name> --resource-group <resource_group_name> --query "properties.apiKey" -o tsv
```

---

### 🔐 Nom de la Web App backend

```bash
az webapp list --resource-group <resource_group_name> --query "[].name" -o table
```

---

### 🔐 Publish Profile du backend

```bash
az webapp deployment list-publishing-profiles --name <webapp_name> --resource-group <resource_group_name> --xml
```

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

Modifier le fichier suivant :

```text
/frontend/.env.production
```

Remplacer la valeur par l’URL du backend déployé :

```env
VITE_API_URL=https://api-popoll-dev-vqg41f.azurewebsites.net
```

---

## 🔟 Déclenchement du déploiement applicatif

```bash
git commit -m "Initial deployment"
git push origin main
```

---

## ✅ Résultat attendu

- infrastructure Azure créée
- secrets GitHub configurés
- frontend et backend déployés automatiquement
