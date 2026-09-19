# Docker Deployment Environments

## Key Takeaways

- **Consistency**: Docker environments ensure the same setup across development, staging, and production
- **Isolation**: Containers keep dependencies separate from your host machine and other developers' environments
- **Reproducibility**: All configurations and settings are version-controlled and easily shared
- **Flexibility**: Environments can be customized with variables, networks, and storage configurations
- **Efficiency**: Hot reloading and bind mounts accelerate development workflows


# 1. Development Environment
Imagine you are the developer that is working now on a new feature. with the legacy way of working, to see your code results you need to build and run your application on your machine, but this is a lot of effort and time-consuming. 

With Docker, you can create a development environment that is isolated from your machine and other developers' machines. You can use Docker to create a container that has all the dependencies and configurations needed to run your application. This way, you can focus on writing code without worrying about the underlying environment. 

## How can we use this mindset of working?
1. **The hot relaod feature**
   - You can use Docker to create a development environment that supports hot reloading.
   - This means that when you make changes to your code, the container will automatically detect the changes and reload the application without needing to restart the container.
   - This can save a lot of time and effort during development.
   - Hot reloading is supported by many programming languages and frameworks, such as Node.js, Python, and Ruby on Rails.
    - nodeJS -> `nodemon` package
    - Python -> `watchdog` package
2. **The bind mount**
    - You can use Docker to create a development environment that uses bind mounts.
    - This means that you can mount a directory from your host machine into the container, allowing you to edit files on your host machine and see the changes reflected in the container.
    ```bash
    docker run -v /path/to/host/directory:/path/to/container/directory myimage
    ```
    - This can be useful for sharing code between the host machine and the container, as well as for debugging and testing.
    - But this considered a security risk, because the container can access the host machine's file system. (two way binding)
    ```bash
    docker run -v /path/to/host/directory:/path/to/container/directory:ro myimage
    ``` 
    - This prevents the container from modifying files on the host machine, but still allows the container to read files from the host machine. (one way binding)
    - But still this way has problem. the syncronization now became one way, and if you delete a file from the host machine, it will be deleted from the container as well. what if this file was important for the container to run? so we need to use another way to solve this problem.
    ```bash
    docker run -v /path/to/host/directory:/path/to/container/directory -v /cont-path/important-file myimage
    ```
    - This way called `anonymous volume`, it prevents any change from the host machine to a specific file in the container, and it will be created in the container if it doesn't exist.




## 2. Production Environment
A production environment is the live system where applications run for end users. It requires high availability, security, and performance optimization. Docker ensures consistency between development, staging, and production, reducing deployment issues.


## Multi-Environment using Multi-Dockerfile
- create a `docker-compose.dev.yaml` for development environment
- create a `docker-compose.prod.yaml` for production environment
- create a `docker-compose.yaml` for common services that are used in both environments
- whie running the docker compose in development environment, you can specify which environment to use with the `-f` flag with the common services file, for example:
```bash
# run the development environment with the common services
docker compose -f docker-compose.yaml -f docker-compose.dev.yaml up

# run the production environment with the common services
docker compose -f docker-compose.yaml -f docker-compose.prod.yaml up
```
- **Remember**, we don't use the hotreload or bind mount in production environment, because it is a security risk and it can cause performance issues.

### Example of Multi-Environment using Multi-Dockerfile

see first [Dockerfile Best Practices - CMD in Development vs. Production](07_Dockerfile_Best_Practices.md#cmd-in-development-vs-production) for reference. 

1. **`Dockerfile.dev` file** 
```dockerfile
FROM node:24-alpine

WORKDIR /usr/local/app

COPY package*.json .

RUN npm install

COPY . .

EXPOSE 4000
    
USER node 

CMD ["npm", "run", "start-dev"]
```

2. **`Dockerfile.prod` file**
```dockerfile
FROM node:24-alpine

WORKDIR /usr/local/app

COPY package*.json .

RUN npm install --omit=dev

COPY . .

EXPOSE 4000
    
USER node 

CMD ["npm", "start"]
```

3. **The common services `docker-compose.yaml` file**
```yaml
services:
  node-app:
    container_name: node-app-container
    hostname: node
```

4. **`docker-compose.dev.yaml` file**
```yaml
services:
  node-app:
    build: 
      context: ../app
      dockerfile: ../docker/Dockerfile.dev
    environment:
      ENV: Development
    ports:
      - target: 4000
        published: 8080
        protocol: tcp
    volumes:
      - type: bind
        source: ../app/
        target: /usr/local/app
        read_only: true
    networks:
      - backend-dev-net

networks:
  backend-dev-net:
    driver: bridge
    name: backend-dev-net
```

5. **`docker-compose.prod.yaml` file**
```yaml
services:
  node-app:
    build: 
      context: ../app                   
      dockerfile: ../docker/Dockerfile.prod 
      # This is my current context, it may differe from your project structure, so you need to change it to your project structure 
    environment:
      ENV: Production
    ports:
      - target: 4000
        published: 80
    networks:
      - backend-prod-net
    
networks:
  backend-prod-net:
    driver: bridge
    name: backend-prod-net
```

Run the a specific environment with the common services:
```bash
# run the development environment with the common services
docker compose -f docker-compose.yaml -f docker-compose.dev.yaml up

# run the production environment with the common services
docker compose -f docker-compose.yaml -f docker-compose.prod.yaml up

```

only the last command will be executed, as the compose will consider it as a new project. 
to use both of them, you need to specify a different project name for each environment with the `-p` flag, for example:

```bash 
docker compose -p dev -f docker-compose.yaml -f docker-compose.dev.yaml up
docker compose -p prod -f docker-compose.yaml -f docker-compose.prod.yaml up
```

## Multi-Environment using a Single Dockerfile with checks using `args`
Some schools preferred to use a single `Dockerfile` for both development and production environments.
Lets have a look on how to do that:

1. **`Dockerfile` file** 
```dockerfile
FROM node:24-alpine

WORKDIR /usr/local/app

COPY package*.json .

# the story hero
ARG NODE_ENV

RUN if [ "$NODE_ENV" = "Development" ]; \
        then npm install; \
        else npm install --omit=dev; \
        fi

COPY . .

EXPOSE 4000
    
USER node 

# will be overriden in dockercompose
CMD ["npm", "start"]
```

2. **`docker-compose.dev.yaml` file**
```yaml
 node-app:
    container_name: node-app-container-dev
    build: 
      context: ../app
      dockerfile: ../docker/Dockerfile
      args:
        - NODE_ENV: Development
# the rest of the file is the same as the previous example
```
3. **`docker-compose.prod.yaml` file**
```yaml
 node-app:
    container_name: node-app-container-prod
    build: 
      context: ../app                   
      dockerfile: ../docker/Dockerfile
      args:
        - NODE_ENV: Production

```

This way, is work but seems a bit complicated. lets see another way to do that with a single y`Dockerfile` file.

## Multi-Environment using a Single Dockerfile with checks using `target`
what do you think?
pro, thats it, `Docker Multi-stage Build`.
Lets see...

```dockerfile
FROM node:24-alpine AS Development
WORKDIR /usr/local/app
COPY package*.json .
RUN npm install
COPY . .
EXPOSE 4000
CMD ["npm", "run", "start-dev"]

FROM node:24-alpine AS Production
WORKDIR /usr/local/app
COPY package*.json .
RUN npm install --omit=dev
COPY . .
EXPOSE 4000
CMD ["npm", "start"]
```
How docker know which stage to use?
- you can specify the stage to use with the `target` option at the `docker-compose` file when building the image
```yaml
 node-app:
    container_name: node-app-container-dev
    build: 
      context: ../app
      dockerfile: ../docker/Dockerfile
      target: Development # or target: Production for prod env
```