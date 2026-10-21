pipeline {
    agent any

    environment {
        TF_EXE = 'C:\\Terraform\\terraform_1.16.5_windows_amd64\\terraform.exe'
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

        stage('Terraform Init') {
            steps {
                dir('terraform') {
                    bat '"%TF_EXE%" init -backend=false -input=false'
                }
            }
        }

        stage('Terraform Format') {
            steps {
                dir('terraform') {
                    bat '"%TF_EXE%" fmt'
                }
            }
        }

        stage('Terraform Validate') {
            steps {
                dir('terraform') {
                    bat '"%TF_EXE%" validate'
                }
            }
        }

        stage('Terraform Plan') {
            steps {
                dir('terraform') {
                    bat '"%TF_EXE%" plan -input=false'
                }
            }
        }
    }
}
