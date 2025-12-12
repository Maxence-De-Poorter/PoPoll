/** Déclaration des variables golables utiles pour le projet */

/* Région Azure utilisée pour la Static Web App */
variable "location_swa" {
  type    = string
  default = "westeurope"
}

/* Région Azure utilisée pour la BDD */
variable "location_data" {
  type    = string
  default = "francecentral"
}

/* Nom du projet */
variable "project" {
  type    = string
  default = "popoll"
}