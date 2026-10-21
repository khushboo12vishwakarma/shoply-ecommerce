
variable "project_name" {
  description = "Name of the application"
  type        = string
  default     = "Shoply"
}

variable "environment" {
  description = "Environment for this learning lab"
  type        = string
  default     = "Learning"
}

output "application_name" {
  value = var.project_name
}

output "environment_name" {
  value = var.environment
}
