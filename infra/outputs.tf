/** Déclaration des outputs Terraform */

/** Nom du ressource groupe */
output "resource_group_name" {
  value = azurerm_resource_group.rg.name
}

/** Nom de domaine par défaut */
output "static_web_app_default_host_name" {
  value = azurerm_static_web_app.swa.default_host_name
}

/** Clé de déploiement de la Static Web App */
output "static_web_app_api_key" {
  value     = azurerm_static_web_app.swa.api_key
  sensitive = true
}

/** Nom de l'Azure App Service */
output "api_app_name" {
  value = azurerm_linux_web_app.api.name
}

/** URL de l'Azure App Service */
output "api_base_url" {
  value = "https://${azurerm_linux_web_app.api.default_hostname}"
}
