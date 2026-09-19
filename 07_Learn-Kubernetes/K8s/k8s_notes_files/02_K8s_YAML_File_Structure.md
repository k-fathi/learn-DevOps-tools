<div align="center">
<img src="../images/kubernetes.png" width="120" height="120" alt="Kubernetes logo" align="right"/>
</div>

# K8s YAML File Structure

## Table of Contents
- [Overview](#overview)
- [1. `apiVersion`](#1-apiversion)
- [2. `kind`](#2-kind)
- [3. `metadata`](#3-metadata)
- [4. `spec`](#4-spec)
- [5. Putting It All Together](#5-putting-it-all-together)

---

## Overview

Every valid Kubernetes YAML manifest needs **4 required top-level fields**. Miss any of them, and `kubectl apply` will reject the file outright.

| Field | Answers |
|---|---|
| `apiVersion` | Which version of the Kubernetes API defines this kind of object? |
| `kind` | What type of object is this? |
| `metadata` | What is this object called, and how is it identified/organized? |
| `spec` | What is the desired state/configuration of this object? |

---

## 1. `apiVersion`

Specifies **which version of the Kubernetes API** the resource belongs to — this tells the API server which API endpoint/schema to use when creating or validating it.

- Written in **camelCase**, and the field name itself is case-sensitive (`apiVersion`, not `apiversion` or `APIVersion`).
- The correct version to use depends entirely on the resource **kind** — different resource types live in different API groups.
- To see every API version your cluster actually supports: `kubectl api-versions`.

| API Group / Version | Used for these `kind`s |
|---|---|
| `v1` (the "core" group — no prefix) | `Pod`, `Service`, `Namespace`, `ConfigMap` |
| `apps/v1` | `Deployment`, `DaemonSet`, `ReplicaSet`, `StatefulSet` |
| `networking.k8s.io/v1` | `Ingress`, `NetworkPolicy` |
| `storage.k8s.io/v1` | `StorageClass` |

> Using the wrong `apiVersion` for a given `kind` is one of the most common causes of a manifest being rejected outright.

### Finding the Right `apiVersion` Yourself

You don't need to memorize the table above — `kubectl api-resources` gives you this exact mapping straight from your own cluster:

```bash
kubectl api-resources
```

```
NAME                    SHORTNAMES   APIVERSION                        NAMESPACED   KIND
pods                    po           v1                                true         Pod
services                svc          v1                                true         Service
namespaces              ns           v1                                false        Namespace
configmaps              cm           v1                                true         ConfigMap
deployments             deploy       apps/v1                           true         Deployment
daemonsets              ds           apps/v1                           true         DaemonSet
replicasets             rs           apps/v1                           true         ReplicaSet
statefulsets            sts          apps/v1                           true         StatefulSet
ingresses               ing          networking.k8s.io/v1              true         Ingress
networkpolicies         netpol       networking.k8s.io/v1              true         NetworkPolicy
storageclasses          sc           storage.k8s.io/v1                false        StorageClass
```

| Column | What it tells you |
|---|---|
| `NAME` | The resource's plural name, as used in `kubectl get <NAME>` |
| `SHORTNAMES` | Handy abbreviations you can use instead (`po` for pods, `svc` for services, `deploy` for deployments...) |
| `APIVERSION` | **Exactly what to put in your manifest's `apiVersion` field** for this resource |
| `NAMESPACED` | `true` if the resource lives inside a namespace, `false` if it's cluster-scoped (like `Namespace` or `StorageClass` themselves) |
| `KIND` | **Exactly what to put in your manifest's `kind` field** — already in the correct PascalCase |

To look up just one resource instead of scrolling the whole list:

```bash
kubectl api-resources | grep <resource-name>
# e.g.
kubectl api-resources | grep deployment
```

> This is genuinely the fastest way to answer "what `apiVersion` and `kind` do I write for X?" — faster than searching docs, and it reflects your **actual cluster's** installed API versions (which can differ slightly between Kubernetes versions or distros).

---

## 2. `kind`

Specifies **the type of resource** being defined — this tells the API server how the object should be created, validated, and managed.

- Written in **PascalCase** (first letter of every word capitalized, no spaces), and is case-sensitive.

```yaml
kind: Pod
kind: Service
kind: Deployment
```

| `kind` | What it represents |
|---|---|
| `Pod` | A single instance of a containerized application |
| `Service` | A stable network identity + policy for reaching a set of Pods |
| `Deployment` | A managed set of replica Pods, with rollout/rollback behavior |

---

## 3. `metadata`

Holds the information used to **identify and organize** the resource within the cluster — not its behavior, just "who it is."

| Field | Purpose |
|---|---|
| `name` | The resource's name — must be unique within its namespace |
| `namespace` | Which namespace it belongs to — defaults to `default` if omitted |
| `labels` | Key-value pairs used for **selection** — Services, Deployments, etc. use label selectors to find the Pods they target |
| `annotations` | Key-value pairs for **arbitrary metadata** — not used for selection, just informational, often read by tools/scripts |

```yaml
metadata:
  name: my-pod
  namespace: my-namespace
  labels:
    app: my-app
  annotations:
    description: This is my pod
```

> **Labels vs. annotations, in one line:** if something needs to *find* this resource by matching on it, it's a **label**. If it's just descriptive info for humans or tooling, it's an **annotation**.

---

## 4. `spec`

Holds the **desired state** of the resource — the actual configuration and behavior you want. Unlike `metadata`, the fields inside `spec` are entirely different depending on the `kind`.

| `kind` | Common `spec` fields |
|---|---|
| `Pod` | `containers` (what to run), `volumes` (what to mount), `restartPolicy`, `nodeSelector` (where to run) |
| `Deployment` | `replicas` (how many), `selector` (which Pods it manages), `template` (the Pod spec to stamp out) |
| `Service` | `selector` (which Pods to route to), `ports`, `type` (`ClusterIP` / `NodePort` / `LoadBalancer`) |

```yaml
spec:
  containers:
    - name: my-container
      image: my-image
      ports:
        - containerPort: 80
  restartPolicy: Always
```

---

## 5. Putting It All Together

All 4 fields combined into one valid, minimal Pod manifest:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-pod
  namespace: my-namespace
  labels:
    app: my-app
  annotations:
    description: This is my pod
spec:
  containers:
    - name: my-container
      image: my-image
      ports:
        - containerPort: 80
  restartPolicy: Always
```

| Field | This example's value | Why |
|---|---|---|
| `apiVersion` | `v1` | `Pod` is a core resource |
| `kind` | `Pod` | We're defining a single Pod |
| `metadata` | `name`, `namespace`, `labels`, `annotations` | Identifies and organizes this specific object |
| `spec` | `containers`, `restartPolicy` | The actual desired configuration for this Pod |

<style>
body {font-size: 16px; line-height: 1.6;}
</style>