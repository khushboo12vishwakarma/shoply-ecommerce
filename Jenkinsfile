
pipeline {
    agent any

    options {
        timestamps()
    }

    stages {

        // 1. Checkout Project
        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/khushboo12vishwakarma/shoply-ecommerce.git'
            }
        }

        // 2. Create Report Directories
        stage('Prepare Reports Directory') {
            steps {
                bat '''
                if not exist reports mkdir reports
                if not exist reports\\Gitleaks mkdir reports\\Gitleaks
                if not exist reports\\Syft mkdir reports\\Syft
                if not exist reports\\Grype mkdir reports\\Grype
                if not exist reports\\Trivy mkdir reports\\Trivy
                '''
            }
        }

        // 3. Gitleaks Secret Scan
        stage('Gitleaks Secret Scan') {
            steps {
                script {
                    def rc = bat(
                        returnStatus: true,
                        script: 'gitleaks detect --source=. --no-git --redact --report-format json --report-path reports\\Gitleaks\\gitleaks-report.json'
                    )
                    echo "Gitleaks exit code: ${rc}"
                }
            }
        }

        // 4. Generate Syft SBOM
        stage('Generate SBOM using Syft') {
            steps {
                bat 'syft . -o syft-json=reports\\Syft\\syft-inventory.json'
                bat 'syft . -o cyclonedx-json=reports\\Syft\\syft-cyclonedx.json'
                bat 'syft . -o spdx-json=reports\\Syft\\syft-spdx.json'
            }
        }

        // 5. Grype CycloneDX Scan
        stage('Grype CycloneDX Scan') {
            steps {
                script {
                    def rc = bat(
                        returnStatus: true,
                        script: 'grype sbom:reports/Syft/syft-cyclonedx.json -o json > reports\\Grype\\grype-cyclonedx-report.json'
                    )
                    echo "Grype CycloneDX exit code: ${rc}"
                }
            }
        }

        // 6. Grype SPDX Scan
        stage('Grype SPDX Scan') {
            steps {
                script {
                    def rc = bat(
                        returnStatus: true,
                        script: 'grype sbom:reports/Syft/syft-spdx.json -o json > reports\\Grype\\grype-spdx-report.json'
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
                        script: 'grype . -o json > reports\\Grype\\grype-filesystem-report.json'
                    )
                    echo "Grype filesystem exit code: ${rc}"
                }
            }
        }

        // 8. Grype Container Scan
        stage('Grype Container Scan') {
            steps {
                script {
                    def rc = bat(
                        returnStatus: true,
                        script: 'grype khushboovishwakarma/amazon_clone-backend:latest -o json > reports\\Grype\\grype-container-report.json'
                    )
                    echo "Grype container exit code: ${rc}"
                }
            }
        }

        // 9. Trivy License Scan
        stage('Trivy License Scan') {
            steps {
                script {
                    def rc = bat(
                        returnStatus: true,
                        script: 'trivy fs --scanners license --format json --output reports\\Trivy\\trivy-license-report.json .'
                    )
                    echo "Trivy license exit code: ${rc}"
                }
            }
        }

        // 10. Trivy Filesystem Scan
        stage('Trivy SCA Scan') {
            steps {
                script {
                    def rc = bat(
                        returnStatus: true,
                        script: 'trivy fs --scanners vuln --format json --output reports\\Trivy\\trivy-filesystem-report.json .'
                    )
                    echo "Trivy filesystem exit code: ${rc}"
                }
            }
        }

        // 11. Trivy Container Scan
        stage('Trivy Container Scan') {
            steps {
                script {
                    def rc = bat(
                        returnStatus: true,
                        script: 'trivy image --format json --output reports\\Trivy\\trivy-container-report.json khushboovishwakarma/amazon_clone-backend:latest'
                    )
                    echo "Trivy container exit code: ${rc}"
                }
            }
        }

        // 12. Generate Trivy CycloneDX SBOM
        stage('Generate Trivy CycloneDX SBOM') {
            steps {
                bat 'trivy fs --format cyclonedx --output reports\\Trivy\\trivy-cyclonedx.json .'
            }
        }

        // 13. Trivy CycloneDX SBOM Scan
        stage('Trivy CycloneDX Scan') {
            steps {
                script {
                    def rc = bat(
                        returnStatus: true,
                        script: 'trivy sbom --format json --output reports\\Trivy\\trivy-cyclonedx-report.json reports\\Trivy\\trivy-cyclonedx.json'
                    )
                    echo "Trivy CycloneDX exit code: ${rc}"
                }
            }
        }

        // 14. Generate Trivy SPDX SBOM
        stage('Generate Trivy SPDX SBOM') {
            steps {
                bat 'trivy fs --format spdx-json --output reports\\Trivy\\trivy-spdx.json .'
            }
        }

        // 15. Trivy SPDX SBOM Scan
        stage('Trivy SPDX Scan') {
            steps {
                script {
                    def rc = bat(
                        returnStatus: true,
                        script: 'trivy sbom --format json --output reports\\Trivy\\trivy-spdx-report.json reports\\Trivy\\trivy-spdx.json'
                    )
                    echo "Trivy SPDX exit code: ${rc}"
                }
            }
        }

        // 16. Convert JSON Reports into CSV
        stage('Convert Security Reports to CSV') {
            steps {

                writeFile file: 'reports/convert-to-csv.ps1', text: '''
function Get-JsonData($path) {
    if (Test-Path $path) {
        try {
            return (Get-Content $path -Raw | ConvertFrom-Json)
        }
        catch {
            Write-Warning "Unable to parse $path : $_"
        }
    }
    return $null
}

function Get-Value($object, $property) {
    if ($null -eq $object) {
        return $null
    }

    $p = $object.PSObject.Properties[$property]

    if ($null -ne $p) {
        return $p.Value
    }

    return $null
}

function Export-ReportCsv($rows, $path, $columns) {
    if (@($rows).Count -gt 0) {
        $rows | Select-Object -Property $columns |
            Export-Csv -Path $path -NoTypeInformation -Encoding UTF8
    }
    else {
        ($columns -join ',') |
            Set-Content -Path $path -Encoding UTF8
    }

    Write-Host "CSV generated: $path"
}

# GITLEAKS REPORT
$data = Get-JsonData 'reports/Gitleaks/gitleaks-report.json'
$rows = @()

foreach ($item in @($data)) {
    if ($null -ne $item) {
        $rows += [PSCustomObject]@{
            RuleID      = $item.RuleID
            Description = $item.Description
            File        = $item.File
            StartLine   = $item.StartLine
            EndLine     = $item.EndLine
            Commit      = $item.Commit
            Author      = $item.Author
            Date        = $item.Date
            Secret      = $item.Secret
        }
    }
}

Export-ReportCsv $rows 'reports/Gitleaks/gitleaks-report.csv' @(
    'RuleID','Description','File','StartLine','EndLine',
    'Commit','Author','Date','Secret'
)

# SYFT PACKAGE INVENTORY
$data = Get-JsonData 'reports/Syft/syft-inventory.json'
$rows = @()

foreach ($item in @($data.artifacts)) {
    $rows += [PSCustomObject]@{
        PackageName    = $item.name
        Version        = $item.version
        PackageType    = $item.type
        PURL           = $item.purl
        FoundLocations = (@($item.locations | ForEach-Object { $_.path }) -join '; ')
    }
}

Export-ReportCsv $rows 'reports/Syft/syft-inventory.csv' @(
    'PackageName','Version','PackageType','PURL','FoundLocations'
)

# GRYPE REPORTS
$grypeFiles = @(
    'grype-cyclonedx',
    'grype-spdx',
    'grype-filesystem',
    'grype-container'
)

foreach ($name in $grypeFiles) {

    $data = Get-JsonData "reports/Grype/$name-report.json"
    $rows = @()

    foreach ($match in @($data.matches)) {

        $vuln = $match.vulnerability
        $pkg = $match.artifact
        $location = @($pkg.locations)[0]

        $rows += [PSCustomObject]@{
            VulnerabilityID = $vuln.id
            Severity        = $vuln.severity
            PackageName     = $pkg.name
            PackageVersion  = $pkg.version
            PackageType     = $pkg.type
            FixVersions     = (@($vuln.fix.versions) -join '; ')
            FilePath        = $location.path
        }
    }

    Export-ReportCsv $rows "reports/Grype/$name-report.csv" @(
        'VulnerabilityID','Severity','PackageName',
        'PackageVersion','PackageType','FixVersions','FilePath'
    )
}

# TRIVY VULNERABILITY REPORTS
$trivyFiles = @(
    'trivy-filesystem',
    'trivy-container',
    'trivy-cyclonedx',
    'trivy-spdx'
)

foreach ($name in $trivyFiles) {

    $data = Get-JsonData "reports/Trivy/$name-report.json"
    $rows = @()

    foreach ($result in @($data.Results)) {

        foreach ($vuln in @($result.Vulnerabilities)) {

            $rows += [PSCustomObject]@{
                Target           = $result.Target
                VulnerabilityID  = $vuln.VulnerabilityID
                PackageName      = $vuln.PkgName
                InstalledVersion = $vuln.InstalledVersion
                FixedVersion     = $vuln.FixedVersion
                Severity         = $vuln.Severity
                Title            = $vuln.Title
                PrimaryURL       = $vuln.PrimaryURL
            }
        }
    }

    Export-ReportCsv $rows "reports/Trivy/$name-report.csv" @(
        'Target','VulnerabilityID','PackageName',
        'InstalledVersion','FixedVersion','Severity',
        'Title','PrimaryURL'
    )
}

# TRIVY LICENSE REPORT
$data = Get-JsonData 'reports/Trivy/trivy-license-report.json'
$rows = @()

foreach ($result in @($data.Results)) {

    foreach ($license in @($result.Licenses)) {

        $rows += [PSCustomObject]@{
            Target         = $result.Target
            PackageName    = $license.PkgName
            PackageVersion = $license.PkgVersion
            LicenseName    = $license.Name
            Category       = $license.Category
            Severity       = $license.Severity
        }
    }
}

Export-ReportCsv $rows 'reports/Trivy/trivy-license-report.csv' @(
    'Target','PackageName','PackageVersion',
    'LicenseName','Category','Severity'
)

Write-Host 'All available CSV conversions completed.'
'''

                bat 'powershell -NoProfile -ExecutionPolicy Bypass -File reports\\convert-to-csv.ps1'
            }
        }
    }

    // 17. Archive All Reports
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
            echo 'Security scanning and report generation completed.'
        }

        failure {
            echo 'Pipeline failed. Check Jenkins Console Output.'
        }
    }
}
