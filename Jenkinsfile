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
                bat 'gitleaks detect --source=. --redact'
            }
        }
    
        stage('Prepare Environment') {
            steps {
                 bat 'cp backend/.env.example backend/.env'
            }
        }

    //     stage('Build Docker Images') {
    //         steps {
    //              bat 'docker compose build'
    //         }
    //     }

    //     stage('Start Application') {
    //         steps {
    //              bat 'docker compose up -d'
    //         }
    //     }

    //     stage('Check Containers') {
    //         steps {
    //              bat 'docker compose ps'
    //         }
    //     }
    // }
}