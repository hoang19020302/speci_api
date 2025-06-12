pipeline {
    agent any

    environment {
        IMAGE_NAME = "speci_image"
        CONTAINER_NAME = "speci_container"
        IMAGE_TAG = "${BUILD_NUMBER}"
        PORT = "80"
    }

    stages {
        stage('Checkout') {
            steps {
                git url: 'git@gitlab.com:tranhoang2/speci_fe.git',
                    branch: 'main',
                    credentialsId: 'gitlab-ssh'
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
                sh 'docker run -d --name $CONTAINER_NAME -p $PORT:3000 $IMAGE_NAME:$IMAGE_TAG'
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
            echo "✅ Deployment successful! 🚀"
        }
        failure {
            echo "❌ Deployment failed! 🔥"
        }
    }
}
