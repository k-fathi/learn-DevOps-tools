# 🚀 Docker Basic Commands Cheat Sheet

## Create & Run Containers

- **Pull an image:**
    ```sh
    docker pull <image_name>
    # or
    docker image pull <image_name>
    ```

- **Create a container (with interactive terminal):**
    ```sh
    docker container create -it <image_name>
    ```

- **Start and attach to the container:**
    ```sh
    docker container start -ai <container_name>
    ```

- **All-in-one (create & run interactively):**
    ```sh
    docker run -it <image_name>
    # or
    docker container run -it <image_name>
    ```

- **Stop a container:**
    ```sh
    docker stop <container_name>
    # or
    docker container stop <container_name>
    ```

- **Run in background (detached):**
    ```sh
    docker run -itd <image_name>
    ```

- **Reattach to a running container:**
    ```sh
    docker exec -it <container_name> <command>
    # or
    docker container exec -it <container_name> <command>
    ```

> 💡 Most OS images have a default shell, so specifying `bash` is often unnecessary.

---

## 📋 Listing Containers and Images

- **List images:**
    ```sh
    docker images
    # or
    docker image ls
    ```

- **List running containers:**
    ```sh
    docker container ls
    # or
    docker ps
    ```

- **List all containers:**
    ```sh
    docker container ls -a
    # or
    docker ps -a
    ```

---

## 🗑️ Removing Containers and Images

- **Remove an image:**
    ```sh
    docker image rm <image_name>
    # or
    docker rmi <image_name>
    ```

- **Remove a container:**
    ```sh
    docker container rm <container_name>
    # or
    docker rm <container_name>
    ```

- **Remove all images:**
    ```sh
    docker image rm $(docker images -q)
    ```

- **Remove all containers:**
    ```sh
    docker container rm $(docker ps -aq)
    ```

- **Remove all stopped containers:**
    ```sh
    docker container prune
    ```

- **Remove all unused images:**
    ```sh
    docker image prune
    ```

- **Remove all unused containers and images:**
    ```sh
    docker system prune
    ```

---

## 🔍 Docker Inspect

- Get detailed info about a container or image:
    ```sh
    docker inspect <container_name_or_id>
    docker inspect <image_name_or_id>
    ```

---

## 📑 Docker Logs

- View logs of a running or stopped container:
    ```sh
    docker logs <container_name_or_id>
    ```

---

## 📝 Docker Commit

- Create a new image from a container's changes:
    ```sh
    docker commit <container_name_or_id> <new_image_name>
    ```

---

## 🆘 Docker Help

- Get help with Docker commands:
    ```sh
    docker --help
    docker <command> --help
    ```