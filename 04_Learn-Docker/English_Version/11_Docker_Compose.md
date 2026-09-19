# Docker Compose: The Foundation

## 1. What is Docker Compose?
- It is a tool for defining and running multi-container Docker applications.
- Uses a `YAML` file to configure application services, networks, and volumes.
- Replaces long, complex `docker run` terminal commands with declarative code (Infrastructure as Code).
- Docker compose used to solve the multi-container problem, where you have multiple containers that need to work together (e.g., a web app, a database, and a cache).
- Also used locally for development, testing, and staging environments to replicate production setups.

- **Core Benefit:** With a single command (`docker-compose up`), you create and start all services from your configuration.

## 2. The Core Anatomy (docker-compose.yml)
### A standard compose file consists of three main top-level blocks:

### 1. `version`:
- Specifies the version of the Docker Compose file format.
- While `version` is optional in modern Compose V2, it is still good to know for legacy files.
- The version can affect the available features and syntax.
- For example, `version: '3.8'` is commonly used for modern applications, while older versions like `2.4` may be used for legacy setups.

### 2. `services`: (The Containers)
- This is where you define your containers (e.g., backend, frontend, database).
- Every service needs at least an `image` to pull, or a `build` context to build a Dockerfile.

### 3. `networks`: (The Communication)
- Docker Compose automatically creates a default network for all services in the file.
- Remember the issue of the default docker network `bridge0`? exactely, it doesn't provide any DNS resolution, only comunicating with IP addresses.
- So Docker Compose create another default compose network named `projectfolder-default` allowing `services` to communicate using their **service names** as hostnames (Built-in DNS).
- You can also define custom networks for better isolation.

### 4. `volumes`: (The Storage)
Used to define named volumes that can be shared across multiple services or persist data even if the containers are destroyed.


## 3. Docker-Compose Skeleton Example
```yaml
# Note: 'version' is obsolete in modern Compose V2, but good to know for legacy files.
version: '3.8'
services:
  web_backend:
    image: my-node-app:latest
    ports:
      - "8080:80"
    environment:
      - NODE_ENV=production
    depends_on:
      - database

  database:
    image: postgres:15-alpine
    volumes:
      - pg_data:/var/lib/postgresql/data
    env_file:
      - .env

volumes:
  pg_data:
```

## Lets Deep Dive into docker-compose file structure and options

## 1. `version: '3.8'`  
- Specifies the version of the Docker Compose file format.
- Optional in Docker Compose V2, but good to know for legacy files.
    ```yaml
    version: '3.8'  
    ```

## 2. `services:`
- ### **image and build context**
    ```yaml
    services:
        web_backend:
            image: my-node-app:latest # Specifies the Docker image, use it if have it or pull it from Docker Hub or private registry
    ```

    ```yaml
        build:
            context: ./backend # Means Dockerfile is in the backend folder, and it will build the image from that Dockerfile        
            dockerfile: Dockerfile.dev 
            # to specify the dockerfile name if is not [Dockerfile]. Optional, if not specified, it will look for a file named 'Dockerfile' in the context directory
            args: 
                arg1: value1 # build-time variables, can be used in the Dockerfile with ARG instruction for multi-env
            target: stage
    ```
    >  ### `arg1: value1`: build-time variables, can be used in the Dockerfile with `ARG` instruction for `multi-env` see [Docker Environment](12_Docker_Environments.md#multi-environment-using-a-single-dockerfile-with-checks-using-args)
   
    >  ### `target: stage`: build-time variables, can be used in the Dockerfile for `multi-env` see [Docker Environment](12_Docker_Environments.md#multi-environment-using-a-single-dockerfile-with-checks-using-target)
    
    - **what if they both used?** that means build the image from the Dockerfile in the context directory and then `tag` it with the specified image name. If the image already exists, it will be used instead of building a new one.
    ```yaml
    services:
        web_backend:
            build: 
                context: ../app
                dockerfile: ../docker/Dockerfile
            image: k-fathi1/node-app:v1.1
    ```
    - If you have a separate directory for your Dockerfile and another for your app, you have to specify the path to the `app directory` as the `build context` and the path of the `docker` file `relative` to the context, For example:
    
    ```
    /home/user/myapp/
                ├── docker/
                │   ├── Dockerfile
                |   └── docker-compose.yaml
                └── app/
                    ├── app.py
                    └── requirements.txt
    ```
    ```yaml
    services:
        web_backend:
            build: 
                context: ../app
                dockerfile: ../docker/Dockerfile
    ```
- ### **hostname, contaienr-name**
    ```yaml
    services:
        api_server:
            container_name: api_server_container # Specifies a custom name for the container instead of the default generated name
            hostname: node-app-machine # Specifies a custom hostname for the container, useful for network communication and identification
    ```    
    ```yaml
    services:
        api_server:
            build: ./backend 
            # a short cut for specifying the build context, if the dockerfile is named 'Dockerfile' and located in the context directory, you can just specify the context path
            
            image: k-fathi1/backend:v1.0 # Specifies the Docker image to use or build and tag it with this name
    ```
- ### **ports**
    - Maps container ports to host ports, allowing external access to services.
    - **Short Syntax**: `"hostPort:containerPort"` or just `"containerPort"` for random host port assignment.
        ```yaml
        ports:
            - "8080:80" # Maps port 80 in the container to port 8080 on the host
            - "80" # Maps port 80 in the container to a random available port on the host range [49153, 65535]
            - "127.0.0.1:8080:80" # only localhost can access this port, not from other machines in the network
            - "9090:5000/udp" # Maps UDP port 5000 in the container to port 9090 on the host
            - "8080-8085:8080-8085" # Maps a range of ports from the container to the host
        ```
    - **Long Syntax**: added in the compose version +v3.2
        ```yaml
            ports:
                - target: 80 # the port inside the container
                  published: 8080   # the port on the host machine
                  protocol: tcp # or udp
                  host_ip: 127.0.0.1 # (OPtional) the IP that the service will be accessible from, default is 0.0.0.0
        ```
- ### **environment**
    - Sets environment variables for the container.
    - Can be defined inline, as a list, or from an external `.env` file.
        ```yaml
        environment:
            - NODE_ENV=production
            - API_KEY=your_api_key_here
        ```
        ```yaml
        env_file:
            - ./.env # Load environment variables from a file
        ```
    - **Default Values**: You can provide default values for environment variables using the `${VARIABLE_NAME:-default_value}` syntax.
        ```yaml 
        environment:
            - PORT=${API_PORT:-3000} # Use the value of API_PORT from the environment, or default to 3000 if API_PORT is not set
        ```

- ### **volumes**
    - Mounts host directories or named volumes into the container for persistent storage.
    - **Short Syntax**:
        ```yaml
        volumes:
            - pg_data:/var/lib/postgresql/data # Named volume for PostgreSQL data persistence (read,write) = :rw
            - pg_data:/var/lib/postgresql/data:ro # Named volume for PostgreSQL data persistence (read-only)
            
            - ./config:/app/config # Bind mount a host directory to the container (read,write) = :rw
            - ./config:/app/config:ro # Bind mount a host directory to the container (read-only)
        ```
    - **Long Syntax**:
        - Named Volume:
        ```yaml
        volumes:
            - type: volume
              source: pg_data # volume name 
              target: /var/lib/postgresql/data # Mounts the volume to the specified path in the container
              read_only: true # Mounts the volume as read-only
        ```
        - Bind Mount:
        ```yaml
        volumes:
            - type: bind
              source: ./config # Host directory path
              target: /etc/nginx/ # Mounts the host directory to the specified path in the container
              read_only: true # Mounts the bind mount as read-only
        ```
- ### **networks**
    - Connects services to custom networks for better isolation and communication.
    - if you don't specify a network, Docker Compose creates a default network for the project named `projectfolder-default`. 
    - but if you specify a custom network, its name will be `projectfolder-networkname` by default, but you can override it with the `name` option in networks section.
        ```yaml
        networks:
            - frontend
            - backend
        ```
- ### **depends_on**
    - Specifies service dependencies, ensuring that certain services start before others.
    - Note: `depends_on` does not wait for the dependent service to be "ready", it only ensures that the container is started. For more complex dependency management, you may need to implement health checks or use external tools.
    - **Short Syntax**
        ```yaml
        depends_on:
            - database # Ensures that the 'database' service starts before this service
        ```
    - **Long Syntax**
        ```yaml
        services:
            backend:
                image: my-node-app
                depends_on:
                    database:
                        condition: service_healthy # wait for the service(database) to be fully ready and healthy
                    db-migration:
                        condition: service_completed_successfully # wait for the temporary service(db-migration) to execute and finish. 
        ```

- ### **Restart Policies**
    - Defines how Docker should handle container restarts in case of failure.
        ```yaml
        restart: no # Do not restart the container if it stops (default)
        restart: always # Always restart the container if it stops
        restart: on-failure # Restart only if the container exits with a non-zero status
        restart: unless-stopped # Restart unless the container is explicitly stopped
        ```
- ### **Healthcheck**
    - Defines a command to check the health of a service, allowing Docker to monitor its status.
        ```yaml
        healthcheck:
            test: ["CMD", "curl", "-f", "http://localhost/health"] # Command to check service health
            interval: 30s # Time between health checks
            timeout: 10s # Time to wait for a response before considering the check failed
            retries: 3 # Number of consecutive failures before marking the service as unhealthy
            start_period: 5s # Initial delay before starting health checks
        ```
    - It can be used in the Dockerfile as well, but in the compose file, it allows you to define health checks for services that may not have them built-in.


## 3. `networks:`
- Defines custom networks for services to communicate within.
- You can specify the network driver (e.g., `bridge`, `overlay`) and other options.
    ```yaml
        networks:
            frontend-net:
                driver: bridge
            backend-net:
                driver: bridge
    ```
- If you want to use an existing network, you can specify it like this:
    ```yaml
    networks:
        frontend-net:
            external: true # Indicates that the network is managed outside of Docker Compose
    ```
- If you don't specify a network, Docker Compose creates a default network for the project named `projectfolder-default`. 

- but if you specify a custom network, its name will be `projectfolder-networkname` by default, but you can override it with the `name` option in networks section.
    ```yaml
    networks:
    frontend-net:
        driver: bridge
        name: custom-frontend-net # Override the default network name
    ```
- Some time you see these signs `{}` in the compose file, it means that the network is using the default settings and options. It is a shorthand for defining a network without any custom configuration.
    ```yaml
    networks:
        frontend-net: {} # Using default settings for the network
        # default settings include the default driver (usually bridge), no custom options, and default IPs configuration.
    ```


## 4. `volumes:`
- Defines named volumes that can be shared across multiple services or persist data even if the containers are destroyed.
    ```yaml
    volumes:
        pg_data: # Named volume for PostgreSQL data persistence
    ```

- If there is an existing volume and you want to use it in the compose file, you can specify it like this:
    ```yaml
    volumes:
        pg_data: # Use an existing volume
            external: true # Indicates that the volume is managed outside of Docker Compose
    ```

- `docker compose` command search for a file named `docker-compose.yml` or `docker-compose.yaml` in the current directory by default. You can specify a different file with the `-f` option:
    ```bash
    docker compose -f custom-compose-file.yml up
    ```



## Common Docker Compose Commands
- `docker compose build` - Builds or rebuilds services.
- `docker compose up` - Builds, (re)creates, starts, and attaches to containers for a service.
- `docker compose up --build` - Builds images before starting containers.
- `docker compose up -d` - Starts containers in detached mode (in the background).
- `docker compose down` - Stops and removes containers, networks, and images created by `up`, with `-v` to remove named volumes as well.
- `docker compose -f <file> up -d --build` - Specifies an alternate compose file and builds images before starting containers in detached mode.
- `docker compose -p <project_name>` - Specifies a custom project name, useful for running multiple environments simultaneously.
- `docker compose down --rmi all` - Removes all images used by services in the compose file. 
- `docker compose ps` - Lists containers.
- `docker compose logs` - Views output from containers, with `-f` to follow logs in real-time. 
- `docker compose exec <service> <command>` - Executes a command in a running service container.
- `docker compose run <service> <command>` - Runs a one-time command against a service.
- `docker compose stop` - Stops running containers without removing them.
- `docker compose restart` - Restarts running containers.
- `docker compose config` - Validates and views the compose file configuration.
- `docker compose pull` - Pulls service images from the registry.
- `docker compose push` - Pushes service images to the registry.
- `docker compose --scale <service>=<num>` - Sets the number of containers to run for a service (deprecated in favor of `replicas` in newer versions).
- `docker compose version` - Displays the Docker Compose version information.
- `docker compose help` - Displays help information for Docker Compose commands.
- `docker compose top` - Displays the running processes of containers.
- `docker compose port <service> <private_port>` - Displays the public port for a service's private port.
- `docker compose pause` - Pauses running containers.
- `docker compose unpause` - Unpauses paused containers.

## Scaling Services
- You can scale services to run multiple instances of a container using the `--scale` option
```bash
docker compose up --scale web_backend=3
```
- Or from the docker compose file using the `deploy` key with `replicas` option.

- **long syntax**
```yaml
services:
  web_backend:
    image: my-node-app:latest
    ports:
      - target: 80
        protocol: tcp
    deploy:
      replicas: 3 # Specifies the number of instances to run for this service
```

- **short syntax**
```yaml
services:
  web_backend:
    image: my-node-app:latest
    deploy:
      replicas: 3 # Specifies the number of instances to run for this service
    ports: 
      - "80" # Maps port 80 in the container to a random available port on the host range [49153, 65535]
```
- But, take care not to set a container_name for the servise, that will cause a conflict.
- Alos you can't specify a spicific port for all, use docker compose to create random ports for these replicas, and then use `docker compose ps` to see the ports assigned to each replica.
- Terminal command has precedence over the compose file, so if you specify `--scale` in the command line, it will override the `replicas` option in the compose file.
