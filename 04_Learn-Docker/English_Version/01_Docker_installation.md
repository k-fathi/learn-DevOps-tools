# Docker Installation

## Docker can be installed with two main methods: Docker Desktop & Docker Engine.


# 1. Install the Docker Desktop
```bash
# prereequisites
sudo apt update
sudo apt install gnome-terminal

# Download the Docker Desktop .deb package
wget https://desktop.docker.com/linux/main/amd64/docker-desktop-amd64.deb?utm_source=docker&utm_medium=webreferral&utm_campaign=docs-driven-download-linux-amd64

# isntall the downloaded package
sudo apt install ./docker-desktop-amd64.deb
```

# Steps for any tool/service to isntall 
1. install the dependinces
1. add the GPG/PGP key 
1. add it to the linux repository
1. update the repository
1. install the main service
1. enable the service 
1. add the user to the service group

# When we use this way?
- In normal cases, we do `sudo apt install <service_name>` to install any service.
- But some services are not available in the linux repository (or have very outdated versions)
- So we have to add their official repository manually and then install them.
- But if you do that directly without security checks, you expose your server to a massive security risk (like Man-in-the-Middle attacks).
- A hacker could pretend to be the official server and provide you with a malicious or compromised package.
- To prevent this, we MUST add the **GPG Key** (Public Key) first. 
- Linux uses this GPG Key to verify the digital signature of the downloaded package before installing it.
- If the signature matches the key, it proves the package genuinely came from the original source (e.g., Docker) and hasn't been tampered with.
- Only then will Linux allow the installation.


# 2. Install Docker Engine (without GUI)
## a. via apt repository
```bash

# 1. Install the dependencies
sudo apt update
sudo apt install ca-certificates curl

# 2. Add the GPG/PGP key
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# 3. Add it to the linux repository
sudo tee /etc/apt/sources.list.d/docker.sources <<EOF
Types: deb
URIs: https://download.docker.com/linux/ubuntu
Suites: $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}")
Components: stable
Signed-By: /etc/apt/keyrings/docker.asc
EOF

# 4. Update the repository
sudo apt update

# 5. Install the main service
sudo apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin   

# 6. Enable the service
sudo systemctl enable docker
sudo systemctl status docker
sudo systemctl start docker

# 7. Add the user to the service group
sudo groupadd docker
sudo usermod -aG docker $USER
newgrp docker

# run your first docker command to verify the installation:
docker run hello-world
```

### Why Here we didn't use the GPG Key and Repository method for the .deb package[[1]]? 
[1]: #1-install-the-docker-desktop 

- Look carefully at the link after `wget` command, it's a direct link to the official Docker site, not a repository.
- It starts with `https://desktop.docker.com` which is `https`, means there is a security certificate (SSL/TLS Certificate) that acts like an "ID card" for the server.
- So, actually we don't need to use GPG key here, it is just only one connection to the Docker site, no need of `apt update` to update the repository, and no need to add the repository itself.
- This method is simpler and faster for installing Docker Desktop, but it is not suitable for installing Docker Engine because we need to keep it updated regularly, and for that we need to add the repository and GPG key to ensure we get the latest updates securely.

## via convenience script
```bash
# Download the convenience script:
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh ./get-docker.sh    
# sudo sh ./get-docker.sh --dry-run --> can be used to see what the script will do without actually installing Docker 
```