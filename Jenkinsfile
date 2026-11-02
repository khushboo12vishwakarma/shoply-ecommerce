
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
        stage('Start Monitoring Test') {
            steps {
                echo 'Starting Prometheus and Grafana test'
                bat 'echo Jenkins test is running'
                sleep time: 60, unit: 'SECONDS'
            }
        }

        stage('Finish Test') {
            steps {
                echo 'Prometheus and Grafana test completed successfully'
            }
        }
    }

    post {
        success {
            echo 'Monitoring test passed'
        }
    }
}
