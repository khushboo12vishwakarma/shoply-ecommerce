pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/khushboo12vishwakarma/shoply-ecommerce.git'
            }
        }

        stage('Terraform Init') {
            steps {
                dir('terraform') {
                    bat '"C:\\Terraform\\terraform_1.16.5_windows_amd64\\terraform.exe" init -input=false'
                }
            }
        }

        stage('Terraform Validate') {
            steps {
                dir('terraform') {
                    bat '"C:\\Terraform\\terraform_1.16.5_windows_amd64\\terraform.exe" validate'
                }
            }
        }

        stage('Terraform Plan') {
            steps {
                dir('terraform') {
                    bat '"C:\\Terraform\\terraform_1.16.5_windows_amd64\\terraform.exe" plan -input=false -no-color'
                }
            }
        }
                stage('Terraform Apply') {
            steps {
                dir('terraform') {
                    bat '"C:\\Terraform\\terraform_1.16.5_windows_amd64\\terraform.exe" apply -auto-approve -input=false -no-color'
                }
            }
        }
  
       
    }
}