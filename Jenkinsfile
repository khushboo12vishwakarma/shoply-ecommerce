pipeline {
    agent any
    stages {
        stage('Checkout Shoply') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/khushboo12vishwakarma/shoply-ecommerce.git'
            }
        }

        stage('Snyk Dependency Scan') {
            steps {
                snykSecurity(
                    snykInstallation: 'Snyk-CLI',
                    snykTokenId: 'snyk-api-token',
                    additionalArguments: '--all-projects',
                    failOnError: true,
                    failOnIssues: false,
                    monitorProjectOnBuild: false
                )
            }
        }
    }

    post {
        success {
            echo 'Shoply Snyk scan completed. Review the scan output.'
        }
        failure {
            echo 'The pipeline failed. Check Console Output for the error.'
        }
    }
}