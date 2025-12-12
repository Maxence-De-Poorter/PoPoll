output "resource_group_name" {
  value = azurerm_resource_group.rg.name
}

output "static_web_app_default_host_name" {
  value = azurerm_static_web_app.swa.default_host_name
}

output "static_web_app_api_key" {
  value     = azurerm_static_web_app.swa.api_key
  sensitive = true
}

output "function_app_name" {
  value = azurerm_linux_function_app.api.name
}

output "function_app_url" {
  value = "https://${azurerm_linux_function_app.api.default_hostname}"
}
