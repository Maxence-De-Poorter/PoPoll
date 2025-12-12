/** Configuration globale de Terraform, permet de définir les versions minimales et les providers requis */
terraform {
  required_version = ">= 1.5.0"

  /** Liste des providers requis */
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.110"
    }

    /** Permet de générer des nombres aléatoires pour les suffixes */
    random = {
      source  = "hashicorp/random"
      version = "~> 3.6"
    }
  }
}

/** Configuration du provider Azure, permet d'activer les fonctionnalités par défaut */
provider "azurerm" {
  features {}
}
