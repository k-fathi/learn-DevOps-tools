# Dockerfiles for Applications and Databases

### See [Dockerfile Best Practices](07_Dockerfile_Best_Practices.md) for reference.

## Table of Contents
- [1. Python Dockerfile Single-Stage vs Multi-Stage](#1-python-dockerfile-single-stage-vs-multi-stage)
- [2. Java Dockerfile](#2-java-dockerfile)
- [3. Node.js Dockerfiles: Single-Stage vs Multi-Stage](#3-nodejs-dockerfiles-single-stage-vs-multi-stage)

### Note:
> The Dockerfile ofcourse depends on the application and the programming language used, but here are some examples of Dockerfiles for different applications and databases.


# 1. Python Dockerfile Single-Stage vs Multi-Stage
## 1. Development (Single-Stage)
**Use Case:** Local development. Focuses on fast builds, installing dev/testing tools, and mounting the code using volumes for hot-reloading. Image size is not a priority.

```dockerfile
FROM python:3.11-slim

# Prevent Python from writing pyc files and keep stdout unbuffered
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install dependencies (including dev tools like pytest, black, watchdog)
COPY requirements-dev.txt .
RUN pip install --no-cache-dir -r requirements-dev.txt

# We usually DON'T copy the code here in dev, we use bind mounts in docker-compose
# COPY . . 

EXPOSE 8000

# Default command (can be overridden by compose)
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
```

## 2. Production (Multi-Stage)

**Use Case:** Simple, lightweight Python apps that do not require OS-level build tools (like gcc or C-extensions).

```dockerfile
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install only production dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the actual application code
COPY . .

# Run as a non-root user for security

RUN useradd -r -s /bin/false appuser 

COPY --chown=appuser:appuser . /app

USER myuser

EXPOSE 8000

# Use a production-ready server like gunicorn or uvicorn
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "app.main:app"]
```

## 3. Production (Multi-Stage with `venv`)
***Use Case:*** Complex Python applications requiring heavy build dependencies (compilers, C libraries) that you don't want bloating or compromising your final production image.

```dockerfile
# ==========================================
# Stage 1: Builder
# ==========================================
FROM python:3.11-slim AS builder

# Install heavy OS build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Create a virtual environment
RUN python -m venv /opt/venv

# Make sure we use the venv pip
ENV PATH="/opt/venv/bin:$PATH"

COPY requirements.txt .

# Install packages into the venv
RUN pip install --no-cache-dir -r requirements.txt

# ==========================================
# Stage 2: Final Production Image
# ==========================================
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install ONLY runtime required system libraries (no compilers)
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq5 \
    && rm -rf /var/lib/apt/lists/*

# Copy the completely built venv from the builder stage
COPY --from=builder /opt/venv /opt/venv

# Enable the venv in the system path
ENV PATH="/opt/venv/bin:$PATH"

# Copy application code
COPY . .

RUN useradd -m myuser
USER myuser

EXPOSE 8000
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "app.main:app"]
```



# 2. Java Dockerfile
## 1. Development (Single-Stage)
**Use Case:** Local development. Focuses on providing the full JDK and build tools (Maven/Gradle). Source code is typically mounted via `docker-compose` volumes to allow hot-reloading (e.g., using Spring Boot DevTools).

```dockerfile
FROM maven:3.9-eclipse-temurin-17

WORKDIR /app

# Copy the pom.xml and download dependencies first to cache this layer
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Code is usually mounted via volumes in dev, but copied here as fallback
# COPY src ./src

EXPOSE 8080

# Run the application using Maven's development server
CMD ["mvn", "spring-boot:run"]
```


## 2. Production (Single-Stage - Pre-built Artifact)
**Use Case:** Used when your CI/CD pipeline (like Jenkins or GitHub Actions) has already compiled the code and generated the .jar file outside of Docker. You only need a lightweight Java Runtime Environment (JRE) to run it.

```dockerfile
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copy the pre-compiled JAR file from the host machine
# Assuming the CI/CD pipeline built it in the 'target' directory
COPY target/my-app-1.0.0.jar app.jar

# Run as a non-root user for security
RUN addgroup -S spring && adduser -S spring -G spring && chown -R spring:spring /app
USER spring

EXPOSE 8080

CMD ["java", "-jar", "app.jar"]
```

## 3. Production (Multi-Stage)
**Use Case:** The standard Best Practice for compiling Java code inside Docker. Stage 1 uses a heavy JDK + Maven image to compile the code. Stage 2 uses a tiny JRE image to run the final .jar, leaving all source code and build tools behind.

```dockerfile
# ==========================================
# Stage 1: Builder (Heavy JDK + Build Tools)
# ==========================================
FROM maven:3.9-eclipse-temurin-17 AS builder

WORKDIR /app

# Cache dependencies layer
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code and build the JAR file
COPY src ./src
RUN mvn clean package -DskipTests

# ==========================================
# Stage 2: Final Production Image (Lightweight JRE)
# ==========================================
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Create a non-root user
RUN addgroup -S spring && adduser -S spring -G spring && chown -R spring:spring /app

# Copy ONLY the compiled JAR file from the builder stage
# Notice we are looking inside the 'target' directory of the builder
COPY --from=builder /app/target/*.jar app.jar

# Switch to non-root user
USER spring

EXPOSE 8080

# Run the application
CMD ["java", "-jar", "app.jar"]
```


# 3. Node.js Dockerfiles: Single-Stage vs Multi-Stage
## 1. Development (Single-Stage)
**Use Case:** Local development. Focuses on fast dependency installation and running tools like `nodemon` for hot-reloading. The actual source code is typically mounted via `docker-compose` volumes rather than copied into the image.

```dockerfile
FROM node:24-alpine

WORKDIR /app

# Copy package files and install all dependencies (including devDependencies)
COPY package*.json ./
RUN npm install

# Code is mounted via volumes in dev, but copied here as fallback
# COPY . .

EXPOSE 4000
```


## 2. Production (Single-Stage)
**Use Case:** Simple Node.js APIs (e.g., plain JavaScript, no TypeScript or native C++ addons) where you just need to install production dependencies and run the application.
```dockerfile
FROM node:24-alpine

# Set Node environment to production
ENV NODE_ENV=production

WORKDIR /app

# Copy package files and install ONLY production dependencies
# 'npm ci' is used in CI/CD and production for strict, reproducible builds
COPY package*.json ./
RUN npm ci --omit=dev

# Copy the rest of the application code
COPY . .

# Run as the built-in non-root 'node' user for security
USER node

EXPOSE 4000

# Start the application directly
CMD ["node", "server.js"]
```

## 3. Production (Multi-Stage)
**Use Case:** The standard Best Practice for modern Node.js applications (especially TypeScript, NestJS, or when native build tools like node-gyp and python are required). Stage 1 installs everything and compiles the code. Stage 2 is a pristine environment containing only production dependencies and the compiled output.
```dockerfile
# ==========================================
# Stage 1: Builder (Heavy dependencies + Compilation)
# ==========================================
FROM node:24-alpine AS builder

WORKDIR /app

# Install all dependencies (including dev tools like TypeScript)
COPY package*.json ./
RUN npm ci

# Copy source code and build the project (e.g., compiling TS to JS)
COPY . .
RUN npm run build

# ==========================================
# Stage 2: Final Production Image (Lightweight)
# ==========================================
FROM node:24-alpine

ENV NODE_ENV=production

WORKDIR /app

# Install ONLY production dependencies to keep the image small
COPY package*.json ./
RUN npm ci --omit=dev

# Copy ONLY the compiled code (usually in a 'dist' or 'build' folder) from the builder stage
COPY --from=builder /app/dist ./dist

# Switch to non-root user
USER node

EXPOSE 4000

# Run the compiled application
CMD ["node", "dist/server.js"]
```

# PHP 
## 1. Development (Single-Stage)
**Use Case:** Local development. Focuses on fast builds, installing dev/testing tools, and mounting the code using volumes for hot-reloading. Image size is not a priority.
```dockerfile
FROM php:8.2-fpm

RUN docker-php-ext-install pdo pdo_mysql

WORKDIR /var/www/html

COPY ./src .

EXPOSE 9000
CMD ["php-fpm"]

```

## 2. Production (Single-Stage)
- needs nginx container
```dockerfile
FROM php:8.2-fpm

RUN docker-php-ext-install pdo pdo_mysql

WORKDIR /var/www/html

COPY ./src .

EXPOSE 9000

CMD ["php-fpm"]
```

## 3. Procution (Multi-Stage)
```dockerfile
# Stage 1: تحميل الباكدجات
FROM composer:latest AS vendor
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --no-autoloader

# Stage 2: الـ Image النهائية الخفيفة
FROM php:8.2-fpm
WORKDIR /var/www/html
COPY --from=vendor /app/vendor ./vendor
COPY ./src .
```