pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/khushboo12vishwakarma/shoply-ecommerce.git'
            }
        }
        stage('Fortify Translation Check') {
    steps {
        bat '''
        "C:\\Program Files\\Fortify\\OpenText_SAST_Fortify_26.1.0\\bin\\sourceanalyzer.exe" ^
        -b ShoplyBuild ^
        -show-files
        '''
    }
}
stage('ScanCentral SAST Scan') {
    steps {
        withCredentials([string(
            credentialsId: 'scancentral-ssc-token',
            variable: 'SSC_TOKEN'
        )]) {
            bat '''
            "C:\\Program Files\\Fortify\\OpenText_SAST_Fortify_26.1.0\\bin\\scancentral.bat" ^
            -sscurl "https://tomcat.com:7443/ssc" ^
            -ssctoken "%SSC_TOKEN%" ^
            start -upload ^
            --application "shoply-ecommerce" ^
            --application-version "1.0.0" ^
            -b "ShoplyBuild" ^
            -scan
            '''
        }
    }
}
}

        stage('Gitleaks Secret Scan') {
            steps {
                bat 'gitleaks detect --source=. --no-git --redact'
            }
        }

        stage('Generate SBOM using syft'){
            steps{
                bat 'syft . -o cyclonedx-json=shoply-syft-sbom-cyclonedx.json'
            }
        }

         stage('Scan CycloneDX SBOM with grype') {
            steps {
                 bat 'grype sbom:shoply-syft-sbom-cyclonedx.json'
            }
        }

        stage('Generate spdx sbom using syft'){
            steps{
                bat 'syft . -o spdx-json=shoply-syft-sbom-spdx-cyclonedx.json'
            }
        }

        stage('scan spdx sbom with grype'){
            steps{
                bat 'grype sbom:shoply-syft-sbom-spdx-cyclonedx.json'
            }
        }

        stage('scanning with syft'){
            steps{
                bat 'syft .'
            }
        }
        stage('scan Vulnerability with grype'){
            steps{
                bat 'grype .'
            }
        }
        stage('scan container with grype'){
            steps{
                bat 'grype khushboovishwakarma/amazon_clone-backend:latest'
            }
        }

        stage('scan container images'){
            steps{
                echo 'Skipping mysql.tar scan because mysql.tar is not available'
            }
        }
        // stage('scan container images'){
        //     steps{
        //         bat 'trivy image --input C:/Users/Admin/Downloads/mysql.tar'
        //     }
        // }


        stage('License Scan'){
            steps{
                bat 'trivy fs --scanners license .'
            }
        }

          stage('Trivy SCA Scan') {
            steps {
                 bat 'trivy fs --scanners vuln .'
            }
        }

        stage('Container scanning'){
            steps{
                bat 'trivy image khushboovishwakarma/amazon_clone-backend:latest'
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