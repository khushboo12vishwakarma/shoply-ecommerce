FROM jenkins/jenkins:2.568.2-alpine-jdk21

USER root

RUN apt-get update \
    && apt-get install -y docker.io docker-compose \
    && rm -rf /var/lib/apt/lists/*

USER jenkins