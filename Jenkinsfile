pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/khushboo12vishwakarma/shoply-ecommerce.git'
            }
        }

        stage('Gitleaks Secret Scan') {
            steps {
                bat 'gitleaks detect --source=. --no-git --redact'
            }
        }
        stage('Trivy Filesystem Scan'){
            steps{
                 bat 'trivy fs --scanners vuln --severity CRITICAL,HIGH --exit-code 1 .'
            }
        }

        stage('Prepare Environment') {
            steps {
                bat 'copy backend\\.env.example backend\\.env'
            }
        }

    }
}