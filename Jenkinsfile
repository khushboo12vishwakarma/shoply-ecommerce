pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/khushboo12vishwakarma/shoply-ecommerce.git'
            }
        }
  
        stage('Check Terraform') {
            steps {
                bat 'terraform -version'
            }
        }
    }
}