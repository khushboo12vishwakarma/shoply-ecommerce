
variable "instance_type" {
  description = "EC2 instance type for the Shoply server"
  type        = string
  default     = "t3.micro"
}

variable "ami_id" {
  description = "AMI ID for the Shoply EC2 server"
  type        = string
  default     = "ami-xxxxxxxxxxxxxxxxx"
}

resource "aws_instance" "shoply_server" {
  ami           = var.ami_id
  instance_type = var.instance_type

  tags = {
    Name        = "Shoply-Server"
    Environment = "Learning"
    Project     = "Shoply"
  }
}
