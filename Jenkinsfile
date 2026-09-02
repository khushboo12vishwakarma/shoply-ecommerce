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
        sh '''
            docker run --rm \
                --entrypoint /bin/sh \
                -v "$PWD:/repo" \
                ghcr.io/gitleaks/gitleaks:latest \
                -c "
                    cd /repo &&
                    git log --oneline -5 &&
                    gitleaks git . --redact
                "
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