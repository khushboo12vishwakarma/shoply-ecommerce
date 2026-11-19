
pipeline {
    agent any

    options {
        timestamps()
    }

    stages {

        // 1. Checkout Source Code
        stage('Checkout') {
            steps {
                echo 'Checking out the Shoply source code...'

                git branch: 'main',
                    url: 'https://github.com/khushboo12vishwakarma/shoply-ecommerce.git'
            }
        }

        // 2. Create Reports Directory
        stage('Prepare Reports Directory') {
            steps {
                bat 'if not exist reports mkdir reports'
            }
        }

        // 3. Gitleaks Secret Scanning
        stage('Gitleaks Secret Scan') {
            steps {
                script {
                    def rc = bat(
                        returnStatus: true,
                        script: 'gitleaks detect --source=. --no-git --redact --report-format json --report-path reports\\gitleaks-report.json'
                    )
                    echo "Gitleaks exit code: ${rc}"
                }
            }
        }

        // 4. Generate SBOM using Syft
        stage('Generate SBOM using Syft') {
            steps {
                bat 'syft . -o cyclonedx-json=reports\\syft-cyclonedx.json'
                bat 'syft . -o spdx-json=reports\\syft-spdx.json'
            }
        }

        // 5. Grype CycloneDX SBOM Scan
        stage('Grype CycloneDX SBOM Scan') {
            steps {
                script {
                    def rc = bat(
                        returnStatus: true,
                        script: 'grype sbom:reports/syft-cyclonedx.json -o json > reports\\grype-cyclonedx-report.json'
                    )
                    echo "Grype CycloneDX exit code: ${rc}"
                }
            }
        }

        // 6. Grype SPDX SBOM Scan
        stage('Grype SPDX SBOM Scan') {
            steps {
                script {
                    def rc = bat(
                        returnStatus: true,
                        script: 'grype sbom:reports/syft-spdx.json -o json > reports\\grype-spdx-report.json'
                    )
                    echo "Grype SPDX exit code: ${rc}"
                }
            }
        }

        // 7. Grype Filesystem Scan
        stage('Grype Filesystem Scan') {
            steps {
                script {
                    def rc = bat(
                        returnStatus: true,
                        script: 'grype . -o json > reports\\grype-filesystem-report.json'
                    )
                    echo "Grype filesystem exit code: ${rc}"
                }
            }
        }

        // 8. Grype Container Image Scan
        stage('Grype Container Scan') {
            steps {
                script {
                    def rc = bat(
                        returnStatus: true,
                        script: 'grype khushboovishwakarma/amazon_clone-backend:latest -o json > reports\\grype-container-report.json'
                    )
                    echo "Grype container exit code: ${rc}"
                }
            }
        }

        // 9. Trivy License Scanning
        stage('Trivy License Scan') {
            steps {
                script {
                    def rc = bat(
                        returnStatus: true,
                        script: 'trivy fs --scanners license --format json --output reports\\trivy-license-report.json .'
                    )
                    echo "Trivy license exit code: ${rc}"
                }
            }
        }

        // 10. Trivy Filesystem Vulnerability Scan
        stage('Trivy SCA Scan') {
            steps {
                script {
                    def rc = bat(
                        returnStatus: true,
                        script: 'trivy fs --scanners vuln --format json --output reports\\trivy-filesystem-report.json .'
                    )
                    echo "Trivy filesystem exit code: ${rc}"
                }
            }
        }

        // 11. Trivy Container Image Scan
        stage('Trivy Container Scan') {
            steps {
                script {
                    def rc = bat(
                        returnStatus: true,
                        script: 'trivy image --format json --output reports\\trivy-container-report.json khushboovishwakarma/amazon_clone-backend:latest'
                    )
                    echo "Trivy container exit code: ${rc}"
                }
            }
        }

        // 12. Generate Trivy CycloneDX SBOM
        stage('Generate Trivy CycloneDX SBOM') {
            steps {
                bat 'trivy fs --format cyclonedx --output reports\\trivy-cyclonedx.json .'
            }
        }

        // 13. Scan Trivy CycloneDX SBOM
        stage('Trivy CycloneDX SBOM Scan') {
            steps {
                script {
                    def rc = bat(
                        returnStatus: true,
                        script: 'trivy sbom --format json --output reports\\trivy-cyclonedx-report.json reports\\trivy-cyclonedx.json'
                    )
                    echo "Trivy CycloneDX exit code: ${rc}"
                }
            }
        }

        // 14. Generate Trivy SPDX SBOM
        stage('Generate Trivy SPDX SBOM') {
            steps {
                bat 'trivy fs --format spdx-json --output reports\\trivy-spdx.json .'
            }
        }

        // 15. Scan Trivy SPDX SBOM
        stage('Trivy SPDX SBOM Scan') {
            steps {
                script {
                    def rc = bat(
                        returnStatus: true,
                        script: 'trivy sbom --format json --output reports\\trivy-spdx-report.json reports\\trivy-spdx.json'
                    )
                    echo "Trivy SPDX exit code: ${rc}"
                }
            }
        }
    }

    // 16. Archive All Security Reports
    post {
        always {
            echo 'Archiving security scan reports...'

            archiveArtifacts(
                artifacts: 'reports/**',
                allowEmptyArchive: true,
                fingerprint: true
            )
        }

        success {
            echo 'Security scanning pipeline completed successfully.'
        }

        failure {
            echo 'Pipeline failed. Check Console Output.'
        }
    }
}
