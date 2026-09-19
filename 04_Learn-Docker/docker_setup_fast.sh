curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh ./get-docker.sh
docker version
sudo usermod -aG docker $USER
newgrp docker