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

# Cosmos DB account
resource "azurerm_cosmosdb_account" "cosmos" {
  name                = "cosmos-${local.name}"
  location            = var.location_data
  resource_group_name = azurerm_resource_group.rg.name
  offer_type          = "Standard"
  kind                = "GlobalDocumentDB"

  capabilities { name = "EnableServerless" }

  consistency_policy { consistency_level = "Session" }

  geo_location {
    location          = var.location_data
    failover_priority = 0
  }
}

# Static Web App
resource "azurerm_static_web_app" "swa" {
  name                = "swa-${local.name}"
  location            = var.location_swa
  resource_group_name = azurerm_resource_group.rg.name
  sku_tier            = "Free"
  sku_size            = "Free"

  app_settings = {
    COSMOS_CONNECTION_STRING  = azurerm_cosmosdb_account.cosmos.primary_sql_connection_string
    COSMOS_DB_NAME            = "strawpoll"
    COSMOS_CONTAINER_NAME     = "polls"
    COSMOS_PARTITION_KEY_PATH = "/id"
    ALLOWED_ORIGIN            = "http://localhost:5173"
  }
}