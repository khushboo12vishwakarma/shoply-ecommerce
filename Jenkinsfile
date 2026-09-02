pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/khushboo12vishwakarma/shoply-ecommerce.git'
            }
        }
        stage('Gitleaks Secret Scan'){
            steps{
                sh '''
                docker run --rm \
                -v "$PWD:/repo" \
                ghcr.io/gitleaks/gitleaks:latest \
                detect --source=/repo --redact
        '''
            }
        
        }
        stage('Prepare Environment') {
            steps {
                sh 'cp backend/.env.example backend/.env'
            }
        }

        stage('Build Docker Images') {
            steps {
                sh 'docker compose build'
            }
        }

        stage('Start Application') {
            steps {
                sh 'docker compose up -d'
            }
        }

        stage('Check Containers') {
            steps {
                sh 'docker compose ps'
            }
        }
    }
}