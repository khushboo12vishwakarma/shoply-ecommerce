variable "project_name" {
  description = "Name of the application"
  type        = string
  default     = "Shoply"
}

output "application_name" {
  description = "Application name for this Terraform lab"
  value       = var.project_name
}