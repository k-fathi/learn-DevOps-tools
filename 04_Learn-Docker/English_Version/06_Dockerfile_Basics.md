# Dockerfile Basics


## Table of Contents

- [Example Dockerfile](#example-dockerfile)
- [Key Instructions](#key-instructions)
  - [FROM](#from-sets-the-base-image)
  - [ENV](#env-allows-to-set-environment-variables-for-the-docker-container)
  - [ARG](#arg-defines-build-time-variables-that-can-be-passed-during-the-build-process)
  - [WORKDIR](#workdir-sets-the-working-directory-inside-the-container)
  - [COPY](#copy-copies-files-from-your-host-location-to-the-container)
  - [ADD](#add-similar-to-copy-but-with-additional-features-like-extracting-tar-files-and-supporting-remote-urls)
  - [RUN](#run-executes-commands-inside-the-container)
  - [EXPOSE](#expose-documents-the-port-the-container-listens-on)
  - [USER](#user-switches-the-user-context-within-the-container)
  - [HEALTHCHECK](#healthcheck-tells-docker-how-to-test-the-internal-health-of-your-application)
  - [VOLUME](#volume-create-an-announimous-volume-and-connect-it-with-the-container)
  - [MAINTAINER VS LABEL](#maintainer-vs-label-specifies-the-author-of-the-dockerfile)
  - [CMD](#cmd-specifies-the-default-command-to-run-when-the-container-starts)
  - [ENTRYPOINT](#entrypoint-configures-a-container-to-run-as-an-executable)
  - [CMD & ENTRYPOINT Reference](#cmd--entrypoint-reference-for-more-about-the-differences-see-01_cmd_vs_entrypoint)
- [Differences Between Build Time, Run Time, and Compile Time](#differences-between-build-timerun-time-and-compile-time)


## Overview
A **Dockerfile** is a text document that contains instructions for building a Docker image.

---

## Example Dockerfile

```dockerfile
#  Use an official Python runtime as a parent image
FROM python:3.10-slim

# Set the working directory
WORKDIR /app

# Copy the current directory contents into the container
COPY . /app

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Make port 80 available to the world outside this container
EXPOSE 80

# Run the application
CMD ["python", "app.py"]
```

---

# Key Instructions

- ## **`FROM`**: Sets the base image.
    * e.g., `FROM python:3.10-slim` uses a lightweight Python image.
    * The base image can be an official image from Docker Hub or a custom image.
    * If you work on a project that uses a specific language or framwork, first ask about the version of the language or framework, then search for the official image that matches it.
    * For  tag `latest`, it means the latest version of the image, but it is not a good practice to use it in production, because it changes over pushes and can break your application, so it is better to use a specific version tag, e.g., `python:3.10-slim` instead of `python:latest`. 
    * for optimum usage of `FROM` use the `sha256 digest` of the image, e.g., `FROM python@sha256:abc123...` to ensure that you are using the exact same image every time you build your Dockerfile. why? because the tag can be updated to point to a different image, while the digest is unique to a specific image.

- ## **`ENV`**:Allows to set environment variables for the docker container.
    * `ENV KEY=value`
    * while `runtime`, ENV can be used to set environment variables that are needed for the application to run, such as database connection strings, API keys, or configuration settings.
    * e.g., `ENV name=karim`
    * to use it in the same Dockerfile use `${name}` or `$name`
        ```dockerfile
        ENV port=8080

        EXPOSE $port # ${port}
        ```
    * check by write `env` in the terminal of the container to see all environment variables.
    
- ## **`ARG`**: Defines build-time variables that can be passed during the build process.
    * `ARG KEY=value`
    * ARG variables are only available during the build time and cannot be accessed at runtime. They are typically used for passing build-time parameters, such as version numbers or build options.
    * e.g., `ARG APP_VERSION=1.0.0`
    * You can use ARG in the RUN instruction to set environment variables for the build process, but they will not be available in the final image. For example:
      ```dockerfile
        ARG APP_VERSION=1.0.0
        RUN echo "Building version $APP_VERSION"
      ```

        > ### So, Use ENV for build and runtime , ARG for only buildtime 


- ## **`WORKDIR`**: Sets the working directory inside the container.
    * e.g., `WORKDIR /app` sets the working directory to `/app` and go inside it.
    * If the directory does not exist, it will be created.
    * WORKDIR = mkdir <new_dir> & cd <new_dir>
    * If you have multiple WORKDIR instructions, each one will be relative to the previous one. For example:
      ```dockerfile
        WORKDIR /app
        WORKDIR src
      ```
      This will set the working directory to `/app/src`.
    * The WORKDIR best practice to locate an application is to use the path: `/usr/local/app` as the working directory for your application. This is a common convention that helps to keep your Docker images organized and makes it easier for other developers to understand where the application code is located.

- ## **`COPY`**: Copies files from your host location to the container.
    * e.g., `COPY . /app` copies the host/machine current directory to `/app` in the container.
    * The working directory has not to be set before using COPY, you can use the absolute path in the destination and Docker will create the destination directory if it is not exists, but it is a best practice to set the working directory first and then use relative paths in the COPY instruction as `COPY` doesn't keep the contexts, it just create a directory and copy the file to it, but `WORKDIR` switch the entire context to the new directory and this can be seen with other commands
    * This makes the Dockerfile more readable and easier to maintain. For example:
        ```dockerfile
        COPY . /var/www/html
        ```
    * It is a good practise to use the `relative path` of the `source`
    * Also it is a good practise to use `/` with directories `COPY app/ /src/app`
    * > `COPY` always copy the directory contents only, it never copy the directory itself, look carefully to these points:
        ```dockerfile
        COPY app   /src
        COPY app/  /src
        COPY app/* /src
        COPY app/. /src/
        # They all are the same , This will copy `only the contents` of the `app` directory to /src, so if you have a file app/file.txt, it will be copied to /src/file.txt
        ```
      and 
        ```dockerfile
        COPY app/file.txt /src
        # This will copy the file.txt under `/` with name `src`
        COPY app/file.txt /src/
        # This will create the directory /src first if not exists and then copy the file.txt under it, `/src/file.txt`
        ```
- ## **`ADD`**: Similar to COPY but with additional features like extracting tar files and supporting remote URLs.
    * e.g., `ADD https://example.com/file.tar.gz /app/` downloads and extracts the file into `/app`.
    * Not a best practice to use ADD for downloading files from the internet, as it can lead to security vulnerabilities. Instead, it's recommended to use RUN with curl or wget to download files.
    * It is a good practice to use `RUN, curl, tar, rm` with `&&` instead of `ADD, tar` because of layer caching considerations. For details, see [07_Dockerfile_Best_Practices.md](07_Dockerfile_Best_Practices.md#3-docker-layer-caching-order-matters).

- ## **`RUN`**: Executes commands inside the container.
    * e.g., `RUN pip install --no-cache-dir -r requirements.txt` installs dependencies.
    * RUN can used multiple times to execute different commands.
    * Every RUN instruction creates a new layer in the docker image, which can increase the size of the image. Therefore, it is recommended to minimize the number of RUN instructions and combine them when possible.
    * Best practice is to combine commands into a single RUN instruction to reduce the number of layers in the image.

    - Example of combining commands:
      ```dockerfile
        RUN apt-get update &&
            apt-get install -y \
            package1 \
            package2 \
            && rm -rf /var/lib/apt/lists/*
        ## Best Practice to clear cashed files 
      ```
    * RUN instruction create a temporary container to execute the command, and then move the changes to the hard disk then remove the temporary container, so if you have a command that takes a long time to execute, it can slow down the build process.

- ## **`EXPOSE`**: Documents the port the container listens on.
    * e.g., `EXPOSE 80` indicates that the application will run on port 80.
    * While mapping a host port to a container port using `docker run -P`, the EXPOSE instruction is used to specify which ports should be exposed by the container. This allows Docker to automatically map the exposed ports to available ports on the host machine when the container is run.

    - Example:
      ```dockerfile
        EXPOSE 80
      ```
    * When you run the container with `docker run -P`, Docker will automatically map port 80 in the container to an available port on the host machine, allowing you to access the application running inside the container through that port. 



- ## **`USER`**: Switches the user context within the container.
    * e.g., `USER appuser` switches to the `appuser` user.
    * It is a best practice to avoid running applications as the root user inside the container for security reasons. Instead, you should create a non-root user and switch to that user using the USER instruction in your Dockerfile. see [07_Dockerfile_Best_Practices.md](07_Dockerfile_Best_Practices.md#6-the-user-instruction-security) for more details.


- ## **`HEALTHCHECK`**: tells Docker *how* to test the internal health of your application.
    * e.g., `HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 CMD curl -f http://localhost/ || exit 1` checks if the application is responding on the root endpoint every 30 seconds, with a timeout of 5 seconds, and it will start checking after a grace period of 20 seconds, and it will retry 3 times before marking the container as unhealthy.
    * You can use different commands for different types of applications. For example:
      ```dockerfile
        # for web applications
        HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
          CMD curl -f http://localhost/ || exit 1
      ```
    * What actually the  HEALTHCHECK test do for the container?
        - if the test command succeeds (returns 0), the container is considered healthy.
        - if the test command fails (returns a non-zero exit code), the container is considered unhealthy, but it does not stop the container, it just marks it as unhealthy in the Docker system, and you can check the health status of the container using `docker ps` or `docker inspect`.  
    * For more details about the `HEALTHCHECK` instruction, see [07_Dockerfile_Best_Practices.md](07_Dockerfile_Best_Practices.md#7-the-healthcheck-instruction-reliability).

- ## **`VOLUME`**: create an announimous volume and connect it with the container.
  * e.g., `VOLUME /data`, create an announimous volume and connect the /data directory with it.
  ```dockerfile
    FROM alpine
    VOLUME /test_announimous_vol
    CMD ["sh"]
  ```
  ```sh
    docker volume ls                  
      DRIVER    VOLUME NAME
      local     8abb8bed80fcde390202689baca1d9273b604387cb88b6a9bb900357e7fa63a4
  ```

- ## **`MAINTAINER VS LABEL`**: Specifies the author of the Dockerfile.
    * e.g., `MAINTAINER Your Name <your.email@example.com>`
    * It is recommended to use the `LABEL` instruction instead of `MAINTAINER` for adding metadata to the image, as `MAINTAINER` is deprecated in newer versions of Docker.
    * Example of using LABEL:
    ```dockerfile
        LABEL maintainer="Your Name <your.email@example.com>"
    ```
    * The LABEL instruction can be accessed using the `docker inspect` command, which allows you to view the metadata associated with the image. This can be useful for tracking the author of the image and other relevant information.

- ## **`CMD`**: Specifies the default command to run when the container starts.
    * e.g., `CMD ["python", "app.py"]` runs the Python application.
    * Only one CMD instruction is allowed in a Dockerfile.
    * If multiple CMD instructions are specified, only the last one will take effect.

- ## **`ENTRYPOINT`**: Configures a container to run as an executable.
    * e.g., `ENTRYPOINT ["echo"]` sets the entry point for the container.
    * ENTRYPOINT is often used in conjunction with CMD to provide default arguments.

- ## **CMD & ENTRYPOINT Reference**: for more about the differences, see [01_CMD_VS_ENTRYPOINT](../Dockerfiles/01_CMD_VS_ENTRYPOINT)


---

## Differences Between `build time`,`run time` and `compile time`:
- **Build Time**: The period when the Docker image is being built. This is when the Dockerfile is processed, and the image is created based on the instructions provided.
- **Run Time**: The period when the application is executed. This is when the container is running and the application is performing its tasks.
- **Compile Time**: The period when the source code is being compiled into an executable format. This is relevant for languages that require compilation before execution, such as C or Java.