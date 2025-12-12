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

resource "azurerm_cosmosdb_sql_database" "db" {
  name                = "strawpoll"
  resource_group_name = azurerm_resource_group.rg.name
  account_name        = azurerm_cosmosdb_account.cosmos.name
}

resource "azurerm_cosmosdb_sql_container" "polls" {
  name                = "polls"
  resource_group_name = azurerm_resource_group.rg.name
  account_name        = azurerm_cosmosdb_account.cosmos.name
  database_name       = azurerm_cosmosdb_sql_database.db.name
  partition_key_paths = ["/id"]
}

resource "azurerm_service_plan" "api_plan" {
  name                = "plan-api-${local.name}"
  resource_group_name = azurerm_resource_group.rg.name
  location            = var.location_data
  os_type             = "Linux"
  sku_name            = "B1" # simple et stable (tu peux passer en F1 si dispo, sinon B1)
}

resource "azurerm_linux_web_app" "api" {
  name                = "api-${local.name}"
  resource_group_name = azurerm_resource_group.rg.name
  location            = var.location_data
  service_plan_id     = azurerm_service_plan.api_plan.id

  site_config {
    application_stack {
      node_version = "20-lts"
    }
  }

  app_settings = {
    COSMOS_CONNECTION_STRING = azurerm_cosmosdb_account.cosmos.primary_sql_connection_string
    COSMOS_DB_NAME           = azurerm_cosmosdb_sql_database.db.name
    COSMOS_CONTAINER_NAME    = azurerm_cosmosdb_sql_container.polls.name

    ALLOWED_ORIGIN = "http://localhost:5173,https://${azurerm_static_web_app.swa.default_host_name}"
    PORT           = "8080"
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
