# Dockerfile Optimization & Security
## Outlines:

1. [Docker Layer Caching](#1-docker-layer-caching)
2. [Containers Package Managers](#2-containers-package-managers)
3. [Runtime Commands (Production vs. Development | CMD vs. ENTRYPOINT)](#3-runtime-commands-production-vs-development--cmd-vs-entrypoint)
4. [The `USER` Instruction (Security)](#4-the-user-instruction-security)
5. [The `HEALTHCHECK` Instruction (Reliability)](#5-the-healthcheck-instruction-reliability)
6. [Build Context](#build-context)


# 1. Docker Layer Caching

## Where to see it?
did you ever run `docker build` and see the output like this?
```yaml
Step 1/5 : FROM python:3.10-slim
 ---> 123456789abc
Step 2/5 : WORKDIR /app
 ---> Using cache
 ---> 23456789abcd
Step 3/5 : COPY requirements.txt .
 ---> Using cache
 ---> 3456789abcde
Step 4/5 : RUN pip install -r requirements.txt
 ---> Running in 456789abcdef
Collecting flask
  Downloading Flask-2.0.1-py3-none-any.whl (94 kB)
Installing collected packages: flask
Successfully installed flask-2.0.1
 ---> 56789abcdef0
Step 5/5 : COPY . .
 ---> Using cache
 ---> 6789abcdef01
Successfully built 6789abcdef01
Successfully tagged myapp:latest
```
- You can see that some steps are using cache, and some steps are not using cache.
- The steps that are using cache are the steps that have not changed since the last build.
- And the steps that are not using cache are the steps that have changed since the last build.
- This is because Docker uses a `layer caching mechanism` to speed up the build process.
- Each instruction in the Dockerfile creates a new layer, and if the instruction has not changed since the last build, Docker will use the cached layer instead of rebuilding it.
- This is why the order of instructions in the Dockerfile is important, because if you have a step that changes frequently (like copying your application code), it will invalidate the cache for all subsequent steps, even if they have not changed.
- This can lead to longer build times, especially if you have heavy installation steps after the `COPY` instruction.
- Therefore, it is important to order your instructions from least likely to change to most likely to change, so that you can take advantage of Docker's layer caching mechanism and speed up your build times. **Lets See How** ...


## Why Orders matter?

Docker builds images layer by layer, strictly from top to bottom. Every `RUN`, `COPY`, and `ADD` instruction creates a new layer. 
Layers are immutable, if created, it can't be change ever.

Lets see an Example about what cause layers in Docker:
```Dockerfile
FROM alpine # ofcourse this line cause a layer 
WORKDIR /usr/local/app # this create a new folder, so it will create a new layer
COPY requirements.txt . # this copies the file from host to container so it will create a new layer
RUN pip install -r requirements.txt # this line installs packages so it will create a new layer.
COPY . . # this line copies files from host to contaienr so it will create layer
EXPOSE 5000 # this line is just for documentation, it will NOT create a layer
CMD python hello.py # this line just trigger the app to run so it will NOT create a layer     
```

You can observe that and see the difference between the base image layer and the layers created by the instructions in the Dockerfile by running `docker inspect <image_id>` for both base image and the built image.

If a layer changes (for example, you modify a single line of code, and the `COPY . .` instruction detects the change), Docker executes that line **and all subsequent lines**, even if they haven't changed. This can lead to significantly longer build times, especially if you have heavy installation steps after the `COPY` instruction.

**The Golden Rule of Ordering:**
Order your instructions from *`least likely to change`* to *`most likely to change`*. You must install dependencies *`before`* copying your constantly changing application code.

> **Bad Example (Slow Builds):**

```dockerfile
COPY . /app
RUN pip install -r /app/requirements.txt 
# If you change ONE line of app code, Docker rebuilds the pip install step!
```

> **Good Example (Fast Builds):**
### 1. Copy ONLY the dependencies file first. 
```dockerfile
COPY requirements.txt /app/
```
### 1. Install dependencies (This layer is cached forever unless requirements.txt changes!)
```dockerfile
RUN pip install -r /app/requirements.txt 
# Note: Cache cleanup is discussed below, here we should use "--no-cache-dir" flag 
```

### 1. Now copy the frequently changing source code
```dockerfile
COPY . /app
# Now, any updates in the source code only and rebuild the docker file, the execution will starts from this instruction.
```



## Cache Cleanup: The "Why" and "When"

When installing packages, both the OS (Linux) and programming languages (Python, Node.js) generate temporary cache files.

### Why is the cache harmful and not useful?
On your personal laptop, caching is useful for faster re-installations. However, a Docker container is **immutable** (read-only in production). Once the image is built and deployed, you will *never* run installation commands inside it again, so here there is no meaning for caching. 

Leaving the cache inside the image acts as "dead weight." It bloats the image size by hundreds of megabytes, making the container slower to pull from the registry, slower to start, and more expensive to store in the cloud.

### When exactly do we clean it?
You **MUST** clean the cache in the **exact same `RUN` instruction** where you installed the packages, using the `&&` operator. 

Every `RUN` command creates a permanent "snapshot" layer. If you install in one `RUN` and delete the cache in the next `RUN`, the cache is already `permanently` baked into the previous layer. You just hid it, but the file size remains huge.

## Real-World Example: `OS` vs. `Language Caches`

When building applications, you often deal with `two distinct layers of caching`. You must optimize both to keep your image size small.
1. **OS Cache (e.g., `apt-get`):** The system packages required to compile or run your app (like `gcc` or `curl`).
1. **Language Cache (e.g., `pip`, `npm`):** The application-level libraries.

**Example `Dockerfile` handling both:**
```dockerfile
FROM python:3.10-slim
WORKDIR /app

# 1. OS-Level: Install system tools and immediately remove the 'apt' cache
RUN apt-get update && apt-get install -y gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy dependency file first (Leveraging Docker Layer Caching)
COPY requirements.txt .

# 2. Language-Level: Install Python libs and prevent 'pip' from saving cache
RUN pip install --no-cache-dir -r requirements.txt

# Copy the frequently changing source code last
COPY . .

CMD ["python", "app.py"]
```

### Here, the cache cleaning here is mainly divided into two steps,
1. **The caches from downloading the package, gcc**.
    - this cache is the `.deb` files and is automatically removed after installation in the official docker images, so don't worry about it.
2. **The caches from updating packages**
    - after updating packages `apt-get update`, the updating process installs extra text files in the `/var/lib/apt/lists/` directory that are responsible for accessing the package repositories, but we only need the `gcc package`. so we need to remove them.
    - now we need to keep only the `gcc` package and remove all the other packages and repositories files that we don't need.
    - first we install the updates, then install the gcc package (now it became a port of the image), then we remove the cache files, so we are sure that the cache files are removed after the installation of the package.
    - all of thes must be in a single RUN instrction, because if we do it in two RUN instructions, the first RUN instruction will create a layer with the cache files, and the second RUN instruction will remove them, but the first layer will still exist and will be included in the final image, so we need to do it in a single RUN instruction.
    - now we have `only` the `gcc` which we get from updating all packages, and we don't have any of them now, we have a clean image with only the necessary package.
  
3. **The cache from downloading python packages**.
    - The `--no-cache-dir` flag tells `pip` not to store the downloaded packages in its cache, which can easily add hundreds of megabytes to your image if left unchecked.


### OS Package Manager Cleanups
| Distro | Install & Cleanup Command (Must be same layer) |
| :--- | :--- |
| **Ubuntu/Debian** | `RUN apt-get update && apt-get install -y <pkg> && rm -rf /var/lib/apt/lists/*` |
| **Alpine** | `RUN apk add --no-cache <pkg>` *(The flag handles cleanup automatically)* |
| **CentOS/RHEL** | `RUN dnf install -y <pkg> && dnf clean all` |

### Language-Specific Cleanups
Always clean your programming language's package manager cache as well.
| Language | Best Practice Production Command (Install + Build + Clean) |
| :--- | :--- |
| **Python** | `RUN pip install --no-cache-dir -r requirements.txt` |
| **Node.js** | `RUN npm install && npm cache clean --force` |
| **Java** | `RUN mvn clean install -DskipTests && rm -rf ~/.m2/repository` |
| **PHP** | `RUN composer install --no-cache --no-dev --optimize-autoloader` |
| **Go** | `RUN go mod download && go build -o app . && go clean -modcache` |



# 2. Containers Package Managers

When writing automated scripts like a `Dockerfile`, you must use tools designed for machines, not humans.

**1. Debian/Ubuntu (`apt` vs. `apt-get`)**
- **`apt`**: Designed for human users. It features progress bars, formatting, and an unstable CLI output that can change between versions. **Never use `apt` in a Dockerfile.** It will trigger a warning and can randomly break your CI/CD pipelines.
- **`apt-get`**: Designed for automated scripts. It is rock-solid, produces predictable plain text, and is backward compatible. **Always use `apt-get`.**

**2. Alpine (`apk`)**
- Alpine is container-native. There is no "human vs. machine" split. The `apk` command is inherently script-safe and lightweight. Just ensure you use the `--no-cache` flag to avoid storing downloaded package indexes.

**3. CentOS/RHEL (`yum` vs. `dnf`)**
- **`yum`**: The classic package manager. It is script-safe but older, slower, and consumes more memory.
- **`dnf`**: The modern, rewritten version of YUM. It is significantly faster and resolves dependencies better. For modern Red Hat-based images (like AlmaLinux, Rocky Linux, or Fedora), always prefer `dnf` over `yum`.

## Summary: How to know which package manager to use?
- Check the base image documentation to see which package manager is recommended.
- For Debian/Ubuntu-based images, use `apt-get`.
- For Alpine-based images, use `apk`.
- For Red Hat-based images, check if `dnf` is available and use it; otherwise, use `yum`.

# 3. Runtime Commands (Production vs. Development | CMD vs. ENTRYPOINT)

The last instruction in your `Dockerfile` tells Docker how to start your application (`CMD` or `ENTRYPOINT`). A critical rule of containerization is that you must never run a development server in a production container.

### The Architectural Difference:
* **Development Servers (`nodemon`, `flask run`):** Designed for developer convenience. They actively scan the disk for file changes (Hot-Reloading) which wastes CPU. They are usually single-threaded (handling one request at a time) and expose sensitive code traces on error pages.
* **Production Servers (`node`, `gunicorn`):** Designed for scale and security. They load code into memory once, spawn multiple worker processes to handle thousands of concurrent requests, and suppress sensitive error outputs.

### Exec Form VS SHell Form:
- **Exec Form (JSON Array)**: `CMD ["executable", "param1", "param2"]`  
  - `Recommended` for production. It runs the command directly without invoking a shell. This ensures that your application runs as PID 1 and correctly receives Unix signals (like `SIGTERM`) when Docker tries to stop the container gracefully.
- **Shell Form**: `CMD executable param1 param2`  
  - `Not recommended` for production. It invokes a shell (`/bin/sh -c`) that takes the PID 1 and the main process will be just a child process which can interfere with signal handling and process management.
  - **The Problem (Shell Form):** If you write your command as plain text, Docker executes it using a shell, and the shell takes PID 1. When you stop the container, Docker sends a SIGTERM signal for a graceful shutdown, but the shell ignores this signal and does not pass it to your application. After a 10-second timeout, Docker gives up and forcefully kills the container with a SIGKILL. In the case of databases, this abrupt termination prevents saving data from RAM to the hard disk, which causes complete Data Corruption.

  - **The Solution (Exec Form):** Always as a Best Practice, use the `JSON array` format. This method bypasses the shell entirely and makes your application take PID 1 directly. This way, the application correctly receives the SIGTERM signal, finishes its pending transactions, saves the data, and shuts down safely (Graceful Shutdown). 

### `CMD` in Development vs. Production 
| Language | Development Command (Do NOT use) | Production Command (Best Practice) |
| :--- | :--- | :--- |
| **Node.js** | `CMD ["npm", "run", "dev"]` *(or nodemon)* | `CMD ["node", "server.js"]` |
| **Python** | `CMD ["flask", "run"]` | `CMD ["gunicorn", "--bind", "0.0.0.0:80", "app:app"]` |
| **Java** | `CMD ["mvn", "spring-boot:run"]` | `CMD ["java", "-jar", "app.jar"]` |
| **Go** | `CMD ["go", "run", "main.go"]` | `CMD ["./app"]` |
| **PHP** | `CMD ["php", "artisan", "serve"]` | `CMD ["php-fpm"]` |


### ENTERPOINT vs CMD
---
- **ENTRYPOINT**: Configures a container to run as an executable. It defines the main command that will always be executed when the container starts. It is often used to set the primary command for the container, and it can be combined with CMD to provide default arguments.
- **CMD**: Specifies the default command to run when the container starts. It can be overridden by providing arguments when running the container. CMD is often used to provide default arguments for the ENTRYPOINT command.


1. **ENTRYPOINT with no Args:**
```dockerfile
FROM alpine_test_1:latest
ENTRYPOINT ["echo"]
    # docker run --name just_entrypoint-cont just_entrypoint-img "karim fathy"
    # └── "karim fathy"

    # docker run --name just_entrypoint-cont just_entrypoint-img 
    # └── ""
```

2. **ENTRYPOINT with Args:**
```dockerfile
FROM alpine_test_1:latest
ENTRYPOINT ["echo", "karim", "fathy"]
    # docker run --name entrypoint_with_args-cont entrypoint_with_args-img
    # └── "karim fathy"

    # docker run --name entrypoint_with_args-cont entrypoint_with_args-img "karim fathy-2"
    # └── "karim fathy karim fathy-2" --> Append
```

3. **CMD with no Args:**
```dockerfile
FROM alpine_test_1:latest
CMD ["echo"]
    # docker run --name just_cmd_with_no_args-cont just_cmd_with_no_args-img
    # └── ""

    # docker run --name just_cmd_with_no_args-cont just_cmd_with_no_args-img "karim fathy"
    # └── ERROR -> Docker replace CMD and its arguments with the arguments passed from Command Line

    # docker run --name just_cmd_with_no_args-cont just_cmd_with_no_args-img ls -l
    # └── long listing
```
4. **CMD with Args:**
```dockerfile 
FROM alpine_test_1:latest
CMD ["echo", "karim fathy"]
    # docker run --name cmd_with_args-cont cmd_with_args-img
    # └── "karim fathy"

    # docker run --name cmd_with_args-cont cmd_with_args-img "karim fathy"
    # └── ERROR -> Docker replace CMD and its arguments with the arguments passed from Command Line

    # docker run --name just_cmd_with_no_args-cont just_cmd_with_no_args-img ls -l
    # └── long listing
```

5. **ENTRYPOINT with CMD:** 
```dockerfile
FROM alpine_test_1:latest
ENTRYPOINT ["echo"]
CMD ["karim", "fathy"]
    # docker run --name cmd_and_entrypoint cmd_and_entrypoint:latest
    # └── "karim fathy"

    # docker run --name cmd_and_entrypoint cmd_and_entrypoint:latest "karim fathy-2"
    # └── "karim fathy-2" --> Override
```


The main idea is that, ENTRYPOINT for main Command and CMD for Arguments passed.
Passed Argument from Command Line Overwrite CMD always but not ENTRYPOINT.
 `--entrypoint` flag in `docker run` can be used to override the ENTRYPOINT defined in the Dockerfile, CMD will be completely ignored.

Passed Argument from Command Line Append the ENTRYPOINT Arguments from the Dockerfile while using ENTRYPOINT only.    


# 4. The `USER` Instruction (Security)

By default, Docker runs all applications inside the container as the `root` user (UID 0). This is a critical security risk. 

### The Threat: Container Breakout
Containers are not true Virtual Machines; they share the Host operating system's kernel. If a hacker exploits a vulnerability in your application (e.g., Remote Code Execution) and gains a terminal session, they will inherit the permissions of the user running the app. 
If that user is `root`, the hacker can use "container escape" exploits to break out of the container and gain `root` access to your physical Host machine, compromising your entire infrastructure.

### The Fix: Principle of Least Privilege
Always switch to a dedicated, low-privileged user at the very end of your `Dockerfile`, right before the `CMD` instruction.

> **Example 1: Using a pre-built user (Node.js)**
Most official language images (like Node) come with a secure user already created.

```dockerfile
...
(Install dependencies and copy code as root)
...
```

#### Switch to the pre-existing non-root user named 'node'
```dockerfile
USER node 

CMD ["node", "server.js"]
```
> **Example 2: Creating a custom user (Python/Ubuntu)**
If your base image doesn't have a pre-built user, you must create one.
```dockerfile
...
(Install dependencies as root) 
...
```

### Create a dummy user named 'appuser' with no password and no shell access
```dockerfile
RUN useradd -r -s /bin/false appuser
# -r = create a system user (no home directory)
# -s /bin/false = disable shell access for this user (security best practice)

RUN chown -R appuser:appuser /app
# Give the dummy user permission to read the application folder

# Switch to the dummy user
USER appuser

CMD ["gunicorn", "--bind", "0.0.0.0:80", "app:app"]
```

Look carefully at the previous example. it did its job correctely, but it breaks the [Docker Layer Caching rule](#1-docker-layer-caching), because we created a new layer for copying the files before change the ownership, this layer now is immutable (can't be changed ever) with the root ownership, and then we changed the ownership of the folder in another layer, docker can't change the ownership of file because the pre-last layer is immutable now so it copies another copy of the files and change its ownership to the custom user, it will rebuild the user creation layer and the ownership layer, which is not good. so we need to combine them in one layer.
The link anchor is incorrect. Change it to:


Go to [Docker Layer Caching Section](#1-docker-layer-caching) again and remind yourself.



```dockerfile
# Create a dummy user named 'appuser' with no password and no shell access.
RUN useradd -r -s /bin/false appuser 

COPY --chown=appuser:appuser . /app
# copy the files and change the ownership at the same moment using --chown flag

USER appuser
CMD ["gunicorn", "--bind", "0.0.0.0:80", "app:app"]
```

# 5. The `HEALTHCHECK` Instruction (Reliability)

Docker only monitors the main process (PID 1) of your container. If your application freezes, deadlocks, or loses database connectivity, the process might not crash. Docker will falsely report the container as "Running" and continue sending user traffic to a broken app (a "`Zombie Container`").

### The Solution:
Use the `HEALTHCHECK` instruction to tell Docker *how* to test the internal health of your application.

**Syntax and Best Practice:**
```dockerfile
# We use 'curl -f' which fails silently on server errors (like 500)
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:80/health || exit 1
```
- `--interval=30s`: Check every 30 seconds.
- `--timeout=5s`: If the check takes longer than 5 seconds, consider it a failure.
- `--start-period=10s`: Wait 10 seconds after container start before performing the first check (allowing the app to initialize).
- `--retries=3`: If the check fails 3 consecutive times, mark the container as "Unhealthy".
- The `CMD` runs a simple HTTP request to the app's health endpoint. If it fails (e.g., app is frozen or database is down), it exits with a non-zero code, signaling Docker that the container is unhealthy.
- THE `CMD` is a part of the `HEALTHCHECK` instruction, not the main application command. It is only used for health monitoring, not for running the app.
- For `curl -f http://localhost:80/health || exit 1`
    * `curl` is a command-line tool for making HTTP requests.
    * `-f` (or `--fail`) tells `curl` to fail if receives any code except 2xx (success). This way, if the app is unhealthy and returns a 500 error, `curl` will exit with a non-zero code.
        - `0` exit code means success
        - `1` exit code means fail
    * we use `localhost` as the HTTP request is made from inside the container to itself, as the app is in the container itself,  so `localhost` refers to the container's own network namespace.
    * Here port `80` is used as an example, but you will use the app port ofcourse, except the databases, as `curl` send only HTTP requests and the databases don't work with it, it has thier own health check methods
    ```dockerfile
        # for MySQL/MariaDB databases
        HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
          CMD mysqladmin ping -h localhost -u root -p${MYSQL_ROOT_PASSWORD} || exit 1

        # for PostgreSQL databases
        HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
          CMD pg_isready -U ${POSTGRES_USER:-postgres} || exit 1

        # for Redis databases
        HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
          CMD redis-cli ping | grep PONG || exit 1

        # for MongoDB databases
        HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
          CMD mongosh --quiet --eval "db.adminCommand('ping')" || exit 1

        # for RabbitMQ message brokers
        HEALTHCHECK --interval=30s --timeout=10s --start-period=20s --retries=3 \
          CMD rabbitmq-diagnostics -q ping || exit 1

        # Elasticsearch
        HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
          CMD curl -f http://localhost:9200/_cluster/health || exit 1
    ```

    * the endpoint `/health` should be implemented in your application to return a simple success response (e.g., `200 OK`) when the app is healthy. This allows Docker to accurately monitor the app's health status.
    * if the app has not `health endpoint`, you can use other checks like `curl -f http://localhost:80/ || exit 1` to check the `root endpoint`, but having a dedicated health endpoint is a best practice for better monitoring.
    * `|| exit 1` means programmatically if the left side command (`curl`) fails, then execute the right side command (`exit 1`), which signals Docker that the container is unhealthy, and if it succeeds, it does nothing and the container remains healthy.

  
  ## What actually the  HEALTHCHECK test do for the container?
  - if the test command succeeds (returns 0), the container is considered healthy.
  - if the test command fails (returns a non-zero exit code), the container is considered unhealthy, but it does not stop the container, it just marks it as unhealthy in the Docker system, and you can check the health status of the container using `docker ps` or `docker inspect`.  




# Build Context:
## What is the build context?
- The build context is the set of files located in the specified PATH or URL.
- The build process can refer to any of the files in the context.
- The build context is sent to the Docker daemon when you run `docker build`.

## Why Build Context is Important?
- The build context is important because it determines which files are available to the Docker daemon during the build process.
- If you specify a build context that does not include the necessary files, the build will fail.
- For example, if your Dockerfile has a `COPY` instruction that references a file that is not in the build context, the build will fail with an error like `COPY failed: stat /path/to/file: no such file or directory`. Therefore, it is important to ensure that the build context includes all the files that are needed for the build process, and to avoid including unnecessary files in the build context, as this can increase the size of the build context and slow down the build process. You can use a `.dockerignore` file to exclude files and directories from the build context.

usually we do `docker build -t <image_tag> .` the `.` means the current directory is the build context, and all files in this directory and its subdirectories are sent to the Docker daemon as the build context.

but what if the Dockerfile is located in a different directory than the build context? you can specify the path to the Dockerfile using the `-f` flag, and the build context using the last argument. for example:




> ### $  docker build -t [image_name] -f [Dockerfile_path] [context]


lets imagine you have the following directory structure:
```
/home/user/myapp/
            ├── docker/
            │   └── Dockerfile
            └── app/
                ├── app.py
                └── requirements.txt

```
and you are in the `/home/user/myapp` directory,

1. You have a `COPY` instruction in your Dockerfile that copies files from the `app` directory, so you need to set the build context to `/home/user/myapp`, because it contains the `app` directory and its files.

2. You want to build the image using the Dockerfile located in `/home/user/myapp/docker/Dockerfile`, you can run:

How to do that? you can use the `-f` flag to specify the path to the Dockerfile, and the last argument to specify the build context.


- `-f` tells DOcker where is and what is the name of the docker file, and the last argument tells Docker what is the build context.
- [context] the docker world, the path to the directory that contains the files that you want to include in the build context.
- if the dockerfile is named `Dockerfile` it is optional to specify the `-f` flag, because Docker will look for a file named `Dockerfile` in the build context by default.


```bash
pwd
# /home/user/myapp

# with absolute paths 
docker build -t myapp:latest -f /home/user/myapp/docker/Dockerfile /home/user/myapp

# with relative paths
docker build -t myapp:latest -f ./docker/Dockerfile .
```

> it is better to use the relative paths, because it is more readable and easier to understand, and it is also more portable, because it will work on any machine that has the same directory structure, while the absolute paths will only work on your machine.


