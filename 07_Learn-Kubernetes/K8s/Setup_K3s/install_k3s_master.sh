# for master node
curl https://get.k3s.io | K3S_TOEKN=<put your token here> sh 

# 1) copy kubeconfig (use tee if direct copy fails)
sudo mkdir -p /home/ubuntu/.kube
sudo cp /etc/rancher/k3s/k3s.yaml /home/ubuntu/.kube/config 2>/dev/null || \
  (sudo cat /etc/rancher/k3s/k3s.yaml | sudo tee /home/ubuntu/.kube/config >/dev/null)

# 2) set owner & perms
sudo chown ubuntu:ubuntu /home/ubuntu/.kube/config
sudo chmod 600 /home/ubuntu/.kube/config

# 3) make kubectl use it and add alias (for the ubuntu user)
echo 'export KUBECONFIG=$HOME/.kube/config' >> /home/ubuntu/.bashrc
echo 'alias k=kubectl' >> /home/ubuntu/.bashrc

# 4) reload bashrc (or just open a new shell)
source /home/ubuntu/.bashrc

# 5) test (no sudo)
k get nodes
