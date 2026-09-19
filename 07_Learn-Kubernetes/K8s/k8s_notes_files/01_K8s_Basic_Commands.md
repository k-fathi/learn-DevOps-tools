<div align="center">
<img src="../images/kubernetes.png" width="120" height="120" alt="Kubernetes logo" align="right"/>
</div>

# Kubernetes Commands — Pods

## Table of Contents
- [1. Minikube Cluster Commands](#1-minikube-cluster-commands)
- [2. Cluster & Resource Discovery](#2-cluster--resource-discovery)
- [3. Pod Lifecycle Commands](#3-pod-lifecycle-commands)
- [4. Interacting with a Running Pod](#4-interacting-with-a-running-pod)
- [5. Local Docker Images with Minikube](#5-local-docker-images-with-minikube)

---

## 1. Minikube Cluster Commands

| Command | What it does |
|---|---|
| `minikube start --driver=docker` | Starts a local cluster, running Kubernetes **inside a Docker container** on your machine — no VM or cloud infrastructure needed. This is the standard setup for local development and testing. |
| `minikube start --cpus=4 --memory=8192 --disk-size=20g` | Same as above, but with specific resource limits allocated to the cluster. |
| `minikube status` | Checks whether the cluster's components (host, API server, etc.) are running. |
| `minikube dashboard` | Opens the Kubernetes web dashboard in your browser. |
| `minikube delete --profile=minikube` | Deletes the cluster (container/VM, config, and all associated resources) for the given profile. Omit `--profile` to delete the default cluster. |

---

## 2. Cluster & Resource Discovery

| Command | What it does |
|---|---|
| `kubectl api-resources` | Lists every resource **kind** the cluster supports (pods, deployments, services, etc.), along with their short names and API groups. |
| `kubectl explain <kind>.<subresource>.<subsubresource>` | Prints the built-in schema/documentation for a resource's fields — drill into nested fields by chaining them with dots. |
| `kubectl cluster-info` | Shows the addresses of the cluster's control plane and core services. |

---

## 3. Pod Lifecycle Commands

**Reading Pods:**

| Command | What it does |
|---|---|
| `kubectl get pods` | Lists Pods in the current namespace. |
| `kubectl get pods -o wide` | Same, with extra columns (node, IP, etc.). |
| `kubectl get pods -o yaml` | Full Pod definitions as YAML. |
| `kubectl get pods -o json` | Full Pod definitions as JSON. |
| `kubectl describe pod <pod-name>` | Detailed status, events, and configuration for one Pod. |
| `kubectl describe pods --all-namespaces` | Same, across every namespace. |

**Creating & Modifying Pods:**

| Command | What it does |
|---|---|
| `kubectl run <pod-name> --image=<image-name>` | Creates and runs a single Pod directly from an image (imperative). |
| `kubectl apply -f <file-name>.yaml` | Creates or updates resources defined in a YAML file (declarative — the standard approach). |
| `kubectl edit pod <pod-name>` | Opens the Pod's live spec in your default editor for direct edits. |
| `kubectl run <pod-name> --image=<image-name> --dry-run=client -o yaml > pod.yaml` | Generates a Pod's YAML manifest **without actually creating it** — a fast way to scaffold a starting YAML file. |

**Removing Pods:**

| Command | What it does |
|---|---|
| `kubectl delete pod <pod-name>` | Deletes a specific Pod. |
| `kubectl delete pods --all` | Deletes every Pod in the current namespace. |

---

## 4. Interacting with a Running Pod

| Command | What it does |
|---|---|
| `kubectl exec -it <pod-name> -- /bin/sh` | Opens an interactive shell inside the Pod's container. |
| `kubectl exec -it <pod-name> -- /bin/bash` | Same, using `bash` if the container's image includes it. |
| `kubectl logs <pod-name>` | Prints the container's logs. |
| `kubectl logs <pod-name> -f` | Follows the logs live, as new lines are written. |
| `kubectl logs <pod-name> --previous` | Prints the logs from the **previous** instance of the container (useful after a restart/crash). |
| `kubectl port-forward <pod-name> <local-port>:<container-port>` | Forwards a local port on your machine straight to a port inside the Pod, so you can reach it in a browser without a Service. |

---

## 5. Local Docker Images with Minikube

When you're testing an image you built locally (rather than one pulled from a public registry), Minikube needs its own copy of it — your local Docker daemon and Minikube's internal one are separate:

```bash
minikube image load <image-name>
```

This loads the image directly into Minikube's Docker environment, so Pods can use it without needing any registry at all.

> ⚠️ **This only works reliably if `imagePullPolicy` won't try to re-pull the image from a registry.** Kubernetes' *default* `imagePullPolicy` depends on the image tag:
>
> | Image tag | Default `imagePullPolicy` | Effect |
> |---|---|---|
> | `latest` (or no tag at all) | `Always` | Kubernetes **always** tries to pull from a registry, ignoring any local copy — this will fail for an image that only exists locally |
> | Any other tag (e.g. `v1.0.0`) | `IfNotPresent` | Kubernetes uses the local image if it's already present, and only pulls if it's missing |
>
> So to make sure your locally-loaded image is actually used: either **tag it with anything other than `latest`**, or explicitly set `imagePullPolicy: IfNotPresent` in the Pod spec regardless of tag.

**Building images directly inside Minikube's Docker environment** (an alternative to `image load` — build straight into the cluster's own Docker daemon):

```bash
eval $(minikube docker-env)
# Points your shell's docker commands at Minikube's internal Docker daemon,
# so any image you build is immediately available to the cluster — no load step needed.

eval $(minikube docker-env -u)
# Unsets it, returning your shell to your regular local Docker daemon.
```

<style>
body {font-size: 16px; line-height: 1.6;}
</style>