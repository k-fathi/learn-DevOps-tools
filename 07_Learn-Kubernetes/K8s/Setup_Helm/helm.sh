#!/usr/bin/bash
RELEASE_NAME=$1   
REPO_NAME=$2      
REPO_URL=$3       
CHART_NAME=$4     
PORT=$5


if [[ -z $RELEASE_NAME ]] || [[ -z $PORT ]] || [[ -z $REPO_URL ]] || [[ -z $CHART_NAME ]] || [[ -z $REPO_NAME ]]; then
    echo "Usage: $0 <release-name> <repo-name> <repo-url> <chart-name> <forwarded-port>"
    exit 1
fi

{
    read -r HOST
    read -r API_SERVER

} <<< "$(minikube status | grep -ie host -ie apiserver | awk '{print $2}')"

if [[ "$HOST" == "Running" ]] && [[ "$API_SERVER" == "Running" ]]; then
    MINIKUBE_STATUS="Running"
else
    MINIKUBE_STATUS="Stopped"
fi

helm version &> /dev/null 

HELM_STATUS=$(echo $?)

if [[ "$MINIKUBE_STATUS" != "Running" ]]; then
    
    echo "------------ Starting Minikube -----------------"
    minikube start --driver=docker
    INGRESS_STATUS=$(minikube addons list | grep ingress | awk '{print $2}')
    METRICS_STATUS=$(minikube addons list | grep metrics-server | awk '{print $2}')
  
    if [[ $INGRESS_STATUS != "enabled" ]]; then
        minikube addons enable ingress
    fi 
    if [[ "$METRICS_STATUS" != "enabled" ]]; then
        minikube addons enable metrics-server
    fi
    echo "------------ Minikube Started -----------------"
fi

if [[ "$HELM_STATUS" -ne 0 ]]; then
   
    echo "------------ Installing Helm -----------------"
    curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3
    chmod +x get_helm.sh
    ./get_helm.sh
    echo "Helm Version: $(helm version)" 
    echo "------------ Helm Installed -----------------"
fi 

echo "> Add Release:$1 From Repo:$3"
helm repo add $REPO_NAME $REPO_URL

echo "------------ Updating Helm Repositories -----------------"
helm repo update 

echo "------------ Installing Release:$1 -----------------"
if helm list | grep -q $RELEASE_NAME; then
    echo "Release $RELEASE_NAME already exists. Upgrading..."
    helm upgrade $RELEASE_NAME $REPO_NAME/$CHART_NAME &> /dev/null  # --set targetPort=$TARGET_PORT
else
    echo "Release $RELEASE_NAME does not exist. Installing..."
    helm install $RELEASE_NAME $REPO_NAME/$CHART_NAME   &> /dev/null # --set targetPort=$TARGET_PORT
fi

sleep 10

echo "------------ Forwarding Release:$1 to localhost:$5 -----------------"
SERVICE_NAME=$(kubectl get svc | grep -i "$RELEASE_NAME" | awk '{print $1}' | head -n 1)

TARGET_PORT=$(kubectl get svc "$SERVICE_NAME" -o jsonpath='{.spec.ports[0].port}')


if [[ -z "$TARGET_PORT" ]] || ! [[ "$TARGET_PORT" =~ ^[0-9]+$ ]]; then
    TARGET_PORT=80
fi
helm show values $REPO_URL/$CHART_NAME > $PWD/$RELEASE_NAME/$CHART_NAME-values.yaml

nohup kubectl -n default port-forward svc/$SERVICE_NAME $PORT:$TARGET_PORT &

sleep 3

echo "------------ Opening Browser to http://localhost:$PORT -----------------"

brave-browser http://localhost:$PORT &> /dev/null &
