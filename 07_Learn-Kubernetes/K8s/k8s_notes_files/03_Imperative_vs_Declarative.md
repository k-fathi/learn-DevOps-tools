<div align="center">
<img src="../images/kubernetes.png" width="120" height="120" alt="Kubernetes logo" align="right"/>
</div>

# Imperative vs. Declarative

## Table of Contents
- [Overview](#overview)
- [1. Imperative](#1-imperative)
- [2. Declarative](#2-declarative)
- [3. Dry Run](#3-dry-run)
- [4. Bridging Both: Generate, Then Apply](#4-bridging-both-generate-then-apply)

---

## Overview

Kubernetes supports two different styles of telling the cluster what you want. The difference isn't just syntax — it changes how repeatable, trackable, and safe your changes are.

| | Imperative | Declarative |
|---|---|---|
| You tell Kubernetes... | **How** to do something, step by step | **What** the end state should look like |
| Executed via | `kubectl` commands directly | Config files (YAML/JSON) + `kubectl apply` |
| Repeatable / trackable in Git? | ❌ Not really — it's a one-off command | ✅ Yes — the file itself *is* the source of truth |
| Good for | Quick tests, one-off debugging, learning | Anything real: apps, environments, anything you'll need to reproduce or change later |

---

## 1. Imperative

Imperative commands tell Kubernetes **how** to do something, directly, right now — no file involved.

```bash
kubectl run <pod-name> --image=<image-name>
```

This creates the Pod immediately. There's no record of *how* it was configured beyond your shell history — if you need to recreate it exactly, you have to remember (or re-type) the same command.

---

## 2. Declarative

Declarative configuration tells Kubernetes **what** the desired end state should be — written down in a YAML (or JSON) file — and lets Kubernetes figure out how to get there and keep it that way.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: <pod-name>
spec:
  containers:
    - name: <container-name>
      image: <image-name>
```

```bash
kubectl apply -f pod.yaml
```

The file is the source of truth. It can be committed to Git, reviewed, diffed, and reapplied identically at any time — which is why this is the standard approach for anything beyond quick one-off testing.

---

## 3. Dry Run

Dry run lets you **preview** what a command or file would create, without actually touching the cluster — useful for validating a configuration before committing to it.

```bash
kubectl run <pod-name> --image=<image-name> --dry-run=client -o yaml
```

This generates and prints the resulting YAML, without creating anything in the cluster.

**Real example:**
```bash
kubectl run pod --image=nginx:kube --dry-run=client -o yaml
```

**Output:**
```yaml
apiVersion: v1
kind: Pod
metadata:
  creationTimestamp: null
  labels:
    run: pod
  name: pod
spec:
  containers:
    - image: nginx:kube
      name: pod
      resources: {}
  dnsPolicy: ClusterFirst
  restartPolicy: Always
status: {}
```

### The Two Types of Dry Run

| Mode | Where validation happens | What it catches |
|---|---|---|
| `--dry-run=client` | Entirely on your machine, before anything is sent to the cluster | Syntax errors, malformed YAML/structure |
| `--dry-run=server` | Sent to the API server, which validates it as if applying for real — but doesn't persist it | Everything `client` catches, **plus** conflicts with existing cluster state (e.g. admission webhooks, quota limits, existing resource conflicts) |

> `--dry-run=none` is the (implicit) default — an actual, real change.

### Output Formats (`-o` / `--output`)

`-o` isn't limited to `yaml` — common options include:

| Value | Output |
|---|---|
| `yaml` | YAML manifest |
| `json` | JSON manifest |
| `name` | Just the resource name (e.g. `pod/my-pod`) |
| `wide` | Extra columns in table view (only for `get`, not dry-run generation) |
| `jsonpath=<template>` | Extract specific fields using a JSONPath expression |
| `jsonpath-file=<file>` | Same, reading the JSONPath expression from a file |
| `go-template=<template>` | Extract/format fields using a Go template expression |
| `go-template-file=<file>` | Same, reading the Go template from a file |
| `template` / `templatefile` | Legacy aliases for the Go template options above |

---

## 4. Bridging Both: Generate, Then Apply

The most practical workflow combines both styles: use an **imperative** command with `--dry-run=client -o yaml` to quickly *generate* a starting manifest, save it to a file, then manage it **declaratively** from that point on.

```bash
# 1. Generate the YAML imperatively, without creating anything yet
kubectl run pod --image=nginx:kube --dry-run=client -o yaml > K8s/k8s_yaml_files/01_pods.yaml

# 2. From here on, manage it declaratively
kubectl apply -f K8s/k8s_yaml_files/01_pods.yaml

# 3. Confirm it's running
kubectl get pods
```

This gets you the best of both: the speed of an imperative command to avoid hand-writing YAML from scratch, and the trackability of a real file you can commit, edit, and reapply going forward.

<style>
body {font-size: 16px; line-height: 1.6;}
</style>