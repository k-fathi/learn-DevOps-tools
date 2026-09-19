# for worker node

# K3S_URL is the URL of the master node, and K3S_TOKEN is the same token used in the master node installation.
curl -sfL https://get.k3s.io | K3S_URL=https://<master-node-ip>:6443 K3s_TOKEN=<put the same token here> sh -
