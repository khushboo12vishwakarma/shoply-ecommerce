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

        stage('Check Snyk CLI') {
            steps {
                bat '''
                    "%SNYK_EXE%" --version
                '''
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
                    script {
                        int result = bat(
                            returnStatus: true,
                            script: '''
                                "%SNYK_EXE%" test --all-projects
                            '''
                        )

                        if (result == 0) {
                            echo 'Snyk scan completed with no vulnerabilities reported.'
                        } else {
                            echo "Snyk returned exit code ${result}. Check Console Output for vulnerabilities or dependency errors."
                            currentBuild.result = 'UNSTABLE'
                        }
                    }
                }
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully.'
        }

        unstable {
            echo 'Scan needs review. Check Snyk findings and dependency errors.'
        }

        failure {
            echo 'Pipeline failed. Check Console Output, CLI path, and credentials.'
        }

        always {
            echo 'Shoply Snyk scan finished.'
        }
    }
}