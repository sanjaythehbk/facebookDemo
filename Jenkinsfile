pipeline {
    agent {
        docker {
            image "mcr.microsoft.com/playwright:v1.58.1-jammy"
            args "-u root:root"
            label "main"
        }
    }

    environment {
        CI       = "true"
        BASE_URL = "https://www.facebook.com"
        // Create these as Jenkins credentials (Secret text) with the same ids
        email           = credentials('facebook-demo-email')
        PASSWORD        = credentials('facebook-demo-password')
        FB_ACCESS_TOKEN = credentials('facebook-demo-graph-token')
    }

    options {
        timestamps()
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh '''
                    mkdir -p test-results allure-results
                    npm ci
                    npx playwright install chromium --with-deps
                '''
            }
        }

        stage('Run Tests In Parallel') {
            steps {
                script {
                    catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {

                        parallel(

                            "Login Tests" : {
                                sh '''
                                    npx playwright test tests/web/LoginLogout.spec.js tests/web/login --reporter=line,allure-playwright || true
                                '''
                            },

                            "Signup Tests" : {
                                sh '''
                                    npx playwright test tests/web/signup tests/web/forgotPassword --reporter=line,allure-playwright || true
                                '''
                            },

                            "Home Tests" : {
                                sh '''
                                    npx playwright test tests/web/home --reporter=line,allure-playwright || true
                                '''
                            },

                            "Profile Tests" : {
                                sh '''
                                    npx playwright test tests/web/profile tests/api --reporter=line,allure-playwright || true
                                '''
                            }

                        )
                    }
                }
            }
        }

        stage('Generate Allure Report') {
            steps {
                sh '''
                    apt update
                    apt install -y openjdk-17-jre-headless zip

                    node scripts/generate-allure-env.js
                    npx allure-commandline generate allure-results -o allure-report --clean || true

                    zip -r allure-report.zip allure-report || true
                '''
            }
        }
    }

    post {
        always {

            archiveArtifacts artifacts: 'allure-report.zip', fingerprint: true, allowEmptyArchive: true
            archiveArtifacts artifacts: 'allure-results/**', fingerprint: true, allowEmptyArchive: true

            script {
                def summaryJson = readFile 'allure-report/widgets/summary.json'
                def stats = parseAllureStats(summaryJson)

                emailext(
                    subject: "Facebook Demo UI Automation Report - ${currentBuild.currentResult}",
                    body: """
                        <h2>Automation Execution Completed</h2>

                        <table border="1" cellpadding="8" cellspacing="0">
                            <tr><th>Total</th><td>${stats.total}</td></tr>
                            <tr><th style="color:green;">Passed</th><td>${stats.passed}</td></tr>
                            <tr><th style="color:red;">Failed</th><td>${stats.failed}</td></tr>
                            <tr><th>Broken</th><td>${stats.broken}</td></tr>
                            <tr><th>Skipped</th><td>${stats.skipped}</td></tr>
                        </table>

                        <br>
                        <p><b>Status:</b> ${currentBuild.currentResult}</p>
                        <p><b>Job:</b> ${env.JOB_NAME}</p>
                        <p><b>Build Number:</b> ${env.BUILD_NUMBER}</p>

                        <br>
                        <p><a href="${env.BUILD_URL}artifact/allure-report.zip">Download Full Allure Report</a></p>
                        <p><a href="${env.BUILD_URL}">Open Jenkins Build</a></p>
                    """,
                    mimeType: 'text/html',
                    to: "sanjay.biswal@albertinvent.com"
                )
            }
        }
    }
}

@NonCPS
def parseAllureStats(String jsonText) {
    def json = new groovy.json.JsonSlurper().parseText(jsonText)

    return [
        total  : json.statistic.total as String,
        passed : json.statistic.passed as String,
        failed : json.statistic.failed as String,
        broken : json.statistic.broken as String,
        skipped: json.statistic.skipped as String
    ]
}
