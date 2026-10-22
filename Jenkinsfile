pipeline {
    agent any

    environment {
        SNYK_EXE = 'C:\\tools\\snyk.exe'
    }

    stages {
        stage('Checkout Shoply') {
            steps {
                echo 'Checking out the Shoply source code...'

                git branch: 'main',
                    url: 'https://github.com/khushboo12vishwakarma/shoply-ecommerce.git'
            }
        }

        stage('Check Snyk CLI') {
            steps {
                echo 'Checking Snyk CLI installation...'

                bat '"%SNYK_EXE%" --version'
            }
        }

        stage('Snyk Authentication') {
            steps {
                echo 'Authenticating Snyk using Jenkins credentials...'

                withCredentials([
                    string(
                        credentialsId: 'snyk-cli-token',
                        variable: 'SNYK_TOKEN'
                    )
                ]) {
                    bat '''
                        @echo off
                        "%SNYK_EXE%" auth "%SNYK_TOKEN%"
                    '''
                }
            }
        }

        stage('Snyk Dependency Scan') {
            steps {
                echo 'Scanning Shoply dependencies for known vulnerabilities...'

                withCredentials([
                    string(
                        credentialsId: 'snyk-cli-token',
                        variable: 'SNYK_TOKEN'
                    )
                ]) {
                    script {
                        int scanResult = bat(
                            returnStatus: true,
                            script: '''
                                @echo off
                                set "SNYK_TOKEN=%SNYK_TOKEN%"
                                "%SNYK_EXE%" test --all-projects
                            '''
                        )

                        if (scanResult == 0) {
                            echo 'Snyk scan completed: no vulnerabilities were reported.'
                        } else {
                            echo "Snyk scan returned exit code ${scanResult}. Review the console output to determine whether vulnerabilities or a scan error caused it."
                        }
                    }
                }
            }
        }
    }

    post {
        success {
            echo 'Shoply Snyk pipeline completed. Review the scan output.'
        }

        failure {
            echo 'The pipeline failed. Review Console Output for the error.'
        }

        always {
            echo 'Shoply Snyk pipeline execution finished.'
        }
    }
}