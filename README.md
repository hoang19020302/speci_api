# Docker Deployment for Django Web Application

This guide explains how to deploy a Django-based web application using Docker and Traefik for routing. Follow these steps to set up a production-ready, scalable, and secure environment.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Directory Structure](#directory-structure)
3. [Configuration Files](#configuration-files)
4. [Building and Running Containers](#building-and-running-containers)
5. [Traefik Setup](#traefik-setup)
6. [Managing Environment Variables](#managing-environment-variables)
7. [Scaling Services](#scaling-services)
8. [Security Best Practices](#security-best-practices)
9. [Cleanup](#cleanup)

---

## Prerequisites

* Docker Engine installed on the server
* Docker Compose v2
* Domain name pointed to the server IP
* Valid DNS records for the domain
* SSL certificates managed by Traefik (Let’s Encrypt)

---

## Directory Structure

```bash
project-root/
├── docker-compose.yml
├── traefik/
│   ├── traefik.yml
│   ├── dynamic.yml
│   └── acme.json
├── web/                # Django project folder
│   ├── Dockerfile
│   ├── entrypoint.sh
│   └── <your Django app files>
└── .env
```

---

## Configuration Files

### 1. `docker-compose.yml`

```yaml
version: "3.8"
services:
  traefik:
    image: traefik:v2.10
    command:
      - --providers.docker
      - --entrypoints.web.address=:80
      - --entrypoints.websecure.address=:443
      - --certificatesresolvers.le.acme.tlschallenge=true
      - --certificatesresolvers.le.acme.email=${LE_EMAIL}
      - --certificatesresolvers.le.acme.storage=/letsencrypt/acme.json
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./traefik/traefik.yml:/etc/traefik/traefik.yml:ro
      - ./traefik/dynamic.yml:/etc/traefik/dynamic.yml:ro
      - ./traefik/acme.json:/letsencrypt/acme.json
      - /var/run/docker.sock:/var/run/docker.sock:ro

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_NAME}
    volumes:
      - db_data:/var/lib/postgresql/data

  web:
    build: ./web
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.web.rule=Host(`${DOMAIN}`)"
      - "traefik.http.routers.web.entrypoints=websecure"
      - "traefik.http.routers.web.tls.certresolver=le"
    depends_on:
      - db
    environment:
      - DATABASE_URL=postgresql://${DB_USER}:${DB_PASSWORD}@db:5432/${DB_NAME}
    volumes:
      - ./.env:/app/.env:ro
    networks:
      - webnet

volumes:
  db_data:

networks:
  webnet:
    driver: bridge
```

### 2. `web/Dockerfile`

```Dockerfile
# Use official Python image as base
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    netcat \
    curl \
    && apt-get clean

# Install pipenv or use requirements.txt
COPY requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copy Django project code
COPY . .

# Collect static files
RUN python manage.py collectstatic --noinput

# Copy entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Command
ENTRYPOINT ["/entrypoint.sh"]
```

### 3. `web/entrypoint.sh`

```bash
#!/bin/sh
# Apply database migrations
python manage.py migrate --noinput

# Start Gunicorn
exec gunicorn your_project_name.wsgi:application \
  --bind 0.0.0.0:8000 \
  --workers 3 \
  --timeout 120
```

### 4. `traefik/traefik.yml`

```yaml
entryPoints:
  web:
    address: ":80"
  websecure:
    address: ":443"
providers:
  docker:
    exposedByDefault: false
certificatesResolvers:
  le:
    acme:
      email:
      storage: /letsencrypt/acme.json
      tlsChallenge: {}
```

### 5. `.env`

```
DOMAIN=your-domain.com
DB_USER=postgres
DB_PASSWORD=secret
DB_NAME=postgres
LE_EMAIL=you@example.com
```

---

## Building and Running Containers

1. Place all files as per the directory structure.
2. Ensure `acme.json` is created and writable:

   ```bash
   touch traefik/acme.json
   chmod 600 traefik/acme.json
   ```
3. Start services:

   ```bash
   docker-compose up -d --build
   ```
4. Verify containers:

   ```bash
   docker-compose ps
   ```
5. Access your app at `https://your-domain.com`.

---

## Traefik Setup

* Traefik auto-discovers Docker services with proper labels.
* TLS certificates are managed by Let’s Encrypt.
* Routes HTTP→HTTPS automatically.

---

## Managing Environment Variables

* Sensitive data stored in `.env`, mounted as read-only.
* Do NOT commit `.env` to version control.

---

## Scaling Services

* To scale web app instances:

  ```bash
  docker-compose up -d --scale web=3
  ```
* Traefik will load balance between containers.

---

## Security Best Practices

* Use non-root user in containers (can be added to Dockerfile).
* Monitor and update base images regularly.
* Limit exposed ports: only 80/443 on host.
* Use strong passwords and rotate keys.

---

## Cleanup

* Stop containers: `docker-compose down`
* Remove volumes (if needed): `docker-compose down -v`

---

*End of documentation.*
