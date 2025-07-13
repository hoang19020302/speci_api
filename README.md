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
10. [Extending with Celery](#extending-with-celery)

---

## Prerequisites

* Docker Engine installed on the server
* Docker Compose v2
* Domain name pointed to the server IP
* Valid DNS records for the domain and subdomain
* SSL certificates managed by Traefik (Let’s Encrypt)

---

## Directory Structure

```bash
project-root/
├── docker-compose.yml
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
services:
  traefik-reverse-proxy:
    image: traefik:v3.1
    restart: always
    command:
      - "--providers.docker"
      - "--providers.docker.exposedbydefault=false"
      - "--entryPoints.websecure.address=:443"
      - "--certificatesresolvers.myresolver.acme.tlschallenge=true"
      - "--certificatesresolvers.myresolver.acme.email=${LE_EMAIL}"
      - "--certificatesresolvers.myresolver.acme.storage=/letsencrypt/acme.json"
      - "--entrypoints.web.address=:80"
      - "--entrypoints.web.http.redirections.entrypoint.to=websecure"
      - "--entrypoints.web.http.redirections.entrypoint.scheme=https"
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - letsencrypt:/letsencrypt
      - /var/run/docker.sock:/var/run/docker.sock:ro
    networks:
      - webnet

  postgres:
    image: postgres:15-alpine
    restart: always
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_NAME}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
        test: ["CMD-SHELL", "pg_isready -U $POSTGRES_USER"]
        interval: 10s
        retries: 5
        timeout: 5s
    networks:
      - webnet

  adminer:
    image: adminer:standalone
    labels:
    - "traefik.enable=true"
    - "traefik.http.routers.adminer.rule=Host(`${ADMINER_DOMAIN}`)"
    - "traefik.http.routers.adminer.entrypoints=websecure"
    - "traefik.http.routers.adminer.tls.certresolver=myresolver"
    restart: always
    environment:
        - ADMINER_DEFAULT_SERVER=postgres
    depends_on:
        postgres:
            condition: service_healthy
    networks:
        - webnet

  redis:
    image: redis:bookworm
    restart: always
    volumes:
        - redis_data:/data
    healthcheck:
        test: ["CMD-SHELL", "redis-cli ping | grep PONG"]
        interval: 10s
        timeout: 5s
        retries: 5
    networks:
        - webnet

  web:
    build: ./web
    restart: always
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.web.rule=Host(`${DOMAIN}`)"
      - "traefik.http.routers.web.entrypoints=websecure"
      - "traefik.http.routers.web.tls.certresolver=myresolver"
    depends_on:
        postgres:
            condition: service_healthy
        redis:
            condition: service_healthy
    environment:
      - DATABASE_URL=postgresql://${DB_USER}:${DB_PASSWORD}@postgres:5432/${DB_NAME}
      - REDIS_URL=redis://redis:6379
    volumes:
      - ./.env:/app/.env:ro
    networks:
      - webnet
    #healthcheck:
    #    test: ["CMD-SHELL", "curl -f http://localhost:8000/health || exit 1"]
    #    interval: 10s
    #    timeout: 5s
    #    retries: 5

volumes:
  postgres_data:
  letsencrypt:
  redis_data:

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

> Replace `your_project_name` with your actual Django project name.

### 4. `.env`

```
DOMAIN=your-domain.com
ADMINER_DOMAIN=sub.your-domain.com
DB_USER=postgres
DB_PASSWORD=secret
DB_NAME=my_postgres
LE_EMAIL=you@example.com
```

---

## Building and Running Containers

1. Place all files as per the directory structure.
2. Start services:

   ```bash
   docker compose up -d --build
   ```
3. Verify containers:

   ```bash
   docker compose ps
   ```
4. Access your app at `https://your-domain.com` and adminner at `https://sub.your-domain.com`

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
  docker compose up -d --scale web=3
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

* Stop containers: `docker compose down`
* Remove volumes (if needed): `docker compose down -v`

---

## Extending with Celery

If you plan to use Celery for background task processing:

* You already have Redis running as a message broker.
* Simply add a new `worker` service in your `docker-compose.yml` like so:

```yaml
worker:
  build: ./web
  command: celery -A your_project_name worker --loglevel=info
  depends_on:
    redis:
      condition: service_healthy
    web:
      condition: service_healthy
  environment:
    - REDIS_URL=redis://redis:6379
  networks:
    - webnet
```

> Replace `your_project_name` with your actual Django project name.

---

### Optional: Logging

If you want better debugging and log rotation, consider adding the following to each service in `docker-compose.yml`:

```yaml
logging:
  driver: json-file
  options:
    max-size: "10m"
    max-file: "3"
```

---

*End of documentation.*
