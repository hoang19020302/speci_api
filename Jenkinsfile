pipeline {
    agent {
        label 'docker-agent-test'
    }

    environment {
        IMAGE_NAME = "speci_image"
        CONTAINER_NAME = "speci_container"
        IMAGE_TAG = "${BUILD_NUMBER}"
        PORT = "3000"
    }

    stages {
        stage('Checkout') {
            steps {
                git url: 'git@gitlab.com:tranhoang2/speci_fe.git',
                    branch: 'main',
                    credentialsId: 'gitlab-ssh'
            }
        }
       
        stage('Generate .env.production') {
            steps {
                withCredentials([file(credentialsId: 'SPEC_FE_ENV_PROD', variable: 'ENV_PROD_CONTENT')]) {
                    sh 'cp "$ENV_PROD_CONTENT" .env.production'
                }
            }
        }

        stage('Debug Info') {
            steps {
                sh 'whoami'
                sh 'ls -l /var/run/docker.sock || echo "No docker.sock found"'
            }
        }


        stage('Build Docker Image') {
            steps {
                 sh 'docker build -t $IMAGE_NAME:$IMAGE_TAG .'
                 sh 'docker tag $IMAGE_NAME:$IMAGE_TAG $IMAGE_NAME:latest'
            }
        }

        stage('Stop & Remove Old Container') {
            steps {
                script {
                    sh 'docker rm -f $CONTAINER_NAME || true'
                }
            }
        }

        stage('Run Container') {
            steps {
                sh 'docker run -d --name $CONTAINER_NAME -p $PORT:80 $IMAGE_NAME:$IMAGE_TAG'
                sh 'docker ps -a'
            }
        }

        stage('Cleanup Dangling Images') {
            steps {
                sh 'docker image prune -f'
            }
        }
    }

    post {
        success {
            slackSend (
                channel: '#ci-notifications',
                message: "✅ Build *${env.JOB_NAME}* #${env.BUILD_NUMBER} succeeded",
                color: 'good'
            )
        }
        failure {
            slackSend (
                channel: '#ci-notifications',
                message: "❌ Build *${env.JOB_NAME}* #${env.BUILD_NUMBER} failed",
                color: 'danger'
            )
        }
    }
}
