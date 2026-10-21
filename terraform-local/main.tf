variable "project_name" {
  description = "Name of the application"
  type        = string
  default     = "Shoply"
}

variable "environment" {
  description = "Deployment environment"
  type        = string
  default     = "Learning"
}

variable "owner" {
  description = "Team responsible for the project"
  type        = string
  default     = "DevOps Team"
}

output "application_name" {
  description = "Application name"
  value       = var.project_name
}

output "environment_name" {
  description = "Environment name"
  value       = var.environment
}

output "project_owner" {
  description = "Project owner"
  value       = var.owner
}