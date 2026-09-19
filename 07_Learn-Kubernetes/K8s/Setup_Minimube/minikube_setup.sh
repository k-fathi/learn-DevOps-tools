#!/bin/bash

set -e

# Install kubectl 
echo "--- Downloading latest stable kubectl ---"
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"

echo "--- Installing kubectl ---"
chmod +x ./kubectl
sudo install ./kubectl /usr/local/bin/kubectl


# Install minikube 
echo "--- Downloading latest minikube ---"
curl -Lo minikube https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64

echo "--- Installing minikube ---"
chmod +x ./minikube
sudo install ./minikube /usr/local/bin/minikube


# Cleanup 
echo "--- Cleaning up downloaded files ---"
rm ./kubectl
rm ./minikube

# make aliase for kubectl and minikube
echo "--- Adding aliases to ~/.bashrc ---"
echo 'alias k=kubectl' >> ~/.bashrc
echo 'alias mk=minikube' >> ~/.bashrc
source ~/.bashrc

echo " kubectl and minikube installed successfully!"
echo "You can now start a local cluster with: minikube start"