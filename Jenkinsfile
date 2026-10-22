pipeline {
    agent any

    environment {
        SNYK_EXE = 'C:\\tools\\snyk.exe'
    }

    stages {
        stage('Checkout Shoply') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/khushboo12vishwakarma/shoply-ecommerce.git'
            }
        }

        stage('Snyk Scan All Projects') {
            steps {
                withCredentials([
                    string(
                        credentialsId: 'snyk-cli-token',
                        variable: 'SNYK_TOKEN'
                    )
                ]) {
                    bat '''
                        "%SNYK_EXE%" test --all-projects
                    '''
                }
            }
        }
    }

    post {
        success {
            echo 'Snyk scan completed. Review the console output for findings.'
        }

        failure {
            echo 'Snyk scan failed or returned a non-zero exit code. Check Console Output.'
        }
    }
}