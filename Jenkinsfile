pipeline {
    agent any

    environment {
        TF_EXE = 'C:\\Terraform\\terraform_1.16.5_windows_amd64\\terraform.exe'
        TF_DIR = 'terraform-local'
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
                dir('terraform-local') {
                    bat '"%TF_EXE%" init -backend=false -input=false'
                }
            }
        }

        stage('Terraform Format') {
            steps {
                dir('terraform-local') {
                    bat '"%TF_EXE%" fmt -check'
                }
            }
        }

        stage('Terraform Validate') {
            steps {
                dir('terraform-local') {
                    bat '"%TF_EXE%" validate'
                }
            }
        }

        stage('Terraform Plan') {
            steps {
                dir('terraform-local') {
                    bat '"%TF_EXE%" plan -input=false'
                }
            }
        }
        stage('Terraform plan Review'){
            steps{
                echo 'Terraform plan completed successfully.'
                echo 'Review the Terraform Plan stage in Console Output.'
            }
        }
    }
}
