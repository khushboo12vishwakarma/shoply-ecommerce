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
          stage('Trivy SCA Scan') {
            steps {
                bat 'trivy fs --scanners vuln .'
            }
        }

        stage('Generate CycloneDX SBOM') {
            steps {
                bat 'trivy fs --format cyclonedx --output shoply-sbom-cyclonedx.json .'
            }
        }

        stage('Scan CycloneDX SBOM') {
            steps {
                bat 'trivy sbom shoply-sbom-cyclonedx.json'
            }
        }

        stage('Generate SPDX SBOM') {
            steps {
                bat 'trivy fs --format spdx-json --output shoply-sbom-spdx.json .'
            }
        }

        stage('Scan SPDX SBOM') {
            steps {
                bat 'trivy sbom shoply-sbom-spdx.json'
            }
        }

        stage('Prepare Environment') {
            steps {
                bat 'copy backend\\.env.example backend\\.env'
            }
        }

    }
}