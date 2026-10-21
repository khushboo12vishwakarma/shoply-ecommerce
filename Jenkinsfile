pipeline {
    agent any

    environment {
        TF_EXE = 'C:\\Terraform\\terraform_1.16.5_windows_amd64\\terraform.exe'
        TF_DIR = 'C:\\Users\\Admin\\Downloads\\shoply-ecommerce-Terraform\\terraform'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/khushboo12vishwakarma/shoply-ecommerce.git'
            }
        }
        stage('Check Terraform') {
            steps {
                bat '"%TF_EXE%" -version'
            }
        }

        stage('Terraform Format Check') {
            steps {
                bat '"%TF_EXE%" fmt -check "%TF_DIR%"'
            }
        }

        stage('Terraform Init') {
            steps {
                dir('C:\\Users\\Admin\\Downloads\\shoply-ecommerce-Terraform\\terraform') {
                    bat '"C:\\Terraform\\terraform_1.16.5_windows_amd64\\terraform.exe" init -backend=false -input=false'
                }
            }
        }

        stage('Terraform Validate') {
            steps {
                dir('C:\\Users\\Admin\\Downloads\\shoply-ecommerce-Terraform\\terraform') {
                    bat '"C:\\Terraform\\terraform_1.16.5_windows_amd64\\terraform.exe" validate'
                }
            }
        }
  
       
    }
}