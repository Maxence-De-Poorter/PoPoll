# 🔁 Redéploiement du projet (enseignant)

Ce document décrit **la procédure minimale** permettant à l’enseignant de redéployer le projet de manière autonome.

Le pipeline CI/CD **n’a pas vocation à être testé ou modifié**.  
Il sert uniquement de mécanisme de déploiement automatique après la création de l’infrastructure.

---

## ✅ Principe général

L’enseignant doit simplement :

1. **Forker le dépôt**
2. **Déployer l’infrastructure avec Terraform**
3. **Récupérer la clé de déploiement**
4. **Ajouter la clé comme secret GitHub**
5. **Effectuer un push pour déclencher le déploiement**

Aucune configuration manuelle dans Azure n’est nécessaire.

---

## 1️⃣ Fork du dépôt GitHub

Depuis GitHub :

```
Fork → Create fork
```

Le fork permet :
- d’avoir son propre pipeline CI/CD
- de gérer ses propres secrets GitHub
- de redéployer le projet sans dépendre du dépôt original

---

## 2️⃣ Déploiement de l’infrastructure (Terraform)

```bash
cd infra
terraform init
terraform apply
```

Terraform crée automatiquement :
- Resource Group
- Azure Cosmos DB
- Azure App Service (Backend Express)
- Azure Static Web App (Frontend)

---

## 3️⃣ Récupération de la clé de déploiement

À la fin du `terraform apply`, récupérer l’output suivant :

- `static_web_app_api_key`

Cette clé permet au pipeline GitHub Actions de déployer l’application frontend.

---

## 4️⃣ Ajout du secret GitHub

Dans le dépôt forké :

```
Settings → Secrets and variables → Actions → New repository secret
```

Ajouter :

| Nom | Valeur |
|---|---|
| AZURE_STATIC_WEB_APPS_API_TOKEN | valeur de `static_web_app_api_key` |

---

## 5️⃣ Déploiement applicatif

Effectuer un push sur la branche `main` :

```bash
git commit -m "Initial deployment"
git push origin main
```

Le pipeline GitHub Actions :
- build le frontend
- build le backend
- déploie automatiquement les deux sur Azure

---

## ✅ Résultat attendu

- L’infrastructure est créée via Terraform
- Le déploiement est déclenché automatiquement via GitHub Actions
- L’application est accessible sans configuration manuelle supplémentaire

---

## ℹ️ Remarque pédagogique

Conformément aux consignes, le CI/CD :
- **n’a pas besoin d’être testé**
- est fourni à titre démonstratif
- permet simplement d’illustrer un déploiement automatisé et reproductible
