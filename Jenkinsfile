
pipeline {
    agent any

    stages {
        stage('Checkout Shoply') {
            steps {
                echo 'Checking out the Shoply source code...'

                git branch: 'main',
                    url: 'https://github.com/khushboo12vishwakarma/shoply-ecommerce.git'
            }
        }

        stage('Monitoring - Start') {
            steps {
                echo 'Starting Prometheus and Grafana monitoring test'
                echo 'Check Jenkins metrics in Prometheus and Grafana'

                bat 'echo Jenkins monitoring test is running'

                sleep time: 60, unit: 'SECONDS'
            }
        }

        stage('Monitoring - Verify') {
            steps {
                echo 'Monitoring test completed'
                echo 'Jenkins metrics are collected separately by Prometheus'
            }
        }
    }

    post {
        success {
            echo 'Shoply monitoring pipeline completed successfully'
        }

        failure {
            echo 'Pipeline failed. Check the Jenkins Console Output.'
        }

        always {
            echo 'Monitoring test pipeline finished'
        }
    }
}
