resource "random_string" "suffix" {
  length  = 6
  special = false
  upper   = false
}

locals {
  name = "${var.project}-${var.environment}-${random_string.suffix.result}"
}

resource "azurerm_resource_group" "rg" {
  name     = "rg-${local.name}"
  location = var.location_swa
}

resource "azurerm_cosmosdb_account" "cosmos" {
  name                = "cosmos-${local.name}"
  location            = var.location_data
  resource_group_name = azurerm_resource_group.rg.name
  offer_type          = "Standard"
  kind                = "GlobalDocumentDB"

  capabilities { name = "EnableServerless" }

  consistency_policy {
    consistency_level = "Session"
  }

  geo_location {
    location          = var.location_data
    failover_priority = 0
  }
}

resource "azurerm_storage_account" "funcsa" {
  name                     = "funcsa${random_string.suffix.result}"
  resource_group_name      = azurerm_resource_group.rg.name
  location                 = var.location_data
  account_tier             = "Standard"
  account_replication_type = "LRS"
}

resource "azurerm_service_plan" "funcplan" {
  name                = "plan-func-${local.name}"
  resource_group_name = azurerm_resource_group.rg.name
  location            = var.location_data
  os_type             = "Linux"
  sku_name            = "Y1"
}

resource "azurerm_linux_function_app" "api" {
  name                       = "func-${local.name}"
  resource_group_name        = azurerm_resource_group.rg.name
  location                   = var.location_data
  service_plan_id            = azurerm_service_plan.funcplan.id
  storage_account_name       = azurerm_storage_account.funcsa.name
  storage_account_access_key = azurerm_storage_account.funcsa.primary_access_key

  site_config {
    application_stack {
      node_version = "20"
    }
  }

  app_settings = {
    FUNCTIONS_WORKER_RUNTIME = "node"
    WEBSITE_RUN_FROM_PACKAGE = "1"

    COSMOS_CONNECTION_STRING = azurerm_cosmosdb_account.cosmos.primary_sql_connection_string
    COSMOS_DB_NAME           = "strawpoll"
    COSMOS_CONTAINER_NAME    = "polls"

    ALLOWED_ORIGIN = "http://localhost:5173,https://${azurerm_static_web_app.swa.default_host_name}"
  }

  depends_on = [azurerm_static_web_app.swa]
}

resource "azurerm_static_web_app" "swa" {
  name                = "swa-${local.name}"
  resource_group_name = azurerm_resource_group.rg.name
  location            = var.location_swa
  sku_tier            = "Free"
  sku_size            = "Free"
}
