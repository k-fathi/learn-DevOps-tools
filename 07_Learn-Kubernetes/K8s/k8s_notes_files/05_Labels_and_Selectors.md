<div align="center">
<img src="../images/kubernetes.png" width="120" height="120" alt="Kubernetes logo" align="right"/>
</div>

# Labels & Selectors

## Table of Contents
- [Overview](#overview)
- [1. Labels](#1-labels)
- [2. Selectors](#2-selectors)
  - [2.1 Equality-Based Selectors](#21-equality-based-selectors)
  - [2.2 Set-Based Selectors](#22-set-based-selectors)
- [3. Selectors in Practice: `matchLabels` vs. `matchExpressions`](#3-selectors-in-practice-matchlabels-vs-matchexpressions)

---

## Overview

**Labels** are key/value pairs you attach to objects for organization. **Selectors** are how you filter/target objects based on those labels. Together, they're the mechanism behind almost everything that "groups" resources in Kubernetes — which Pods a Deployment manages, which Pods a Service routes to, which nodes a Pod can be scheduled onto, and so on.

---

## 1. Labels

**Defined declaratively, in YAML:**
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: alpine-pod
  labels:
    environment: production
    tier: backend
spec:
  containers:
    - name: alpine-cont
      image: alpine
```

**Managing labels imperatively, via `kubectl`:**

| Command | What it does |
|---|---|
| `kubectl run alpine-pod --image=alpine --labels="environment=production,tier=backend"` | Creates a new Pod with labels attached from the start |
| `kubectl label pods alpine-pod environment=production tier=backend` | Adds labels to an existing Pod |
| `kubectl label pods alpine-pod environment=production tier=backend --overwrite` | Same, but overwrites labels that already exist (required if the key is already set) |
| `kubectl label pods alpine-pod tier-` | Removes the `tier` label (note the trailing `-`) |
| `kubectl label deployment alpine-deploy env=testing` | Labels aren't Pod-only — works on any resource type |
| `kubectl label node worker-node-1 env=testing` | ...including Nodes themselves |

**Viewing labels:**
```bash
kubectl get pods --show-labels
```
```bash
kubectl describe pod alpine-pod
```
> Note: `--show-labels` is a flag on `kubectl get`, not on `kubectl describe` — `describe` already prints labels by default, no extra flag needed.

---

## 2. Selectors

Selectors filter objects based on their labels, so operations (get, delete, route traffic, etc.) can target exactly the right set of resources.

### 2.1 Equality-Based Selectors

Match on an **exact** label value — supports `=`, `==`, and `!=`.

```bash
kubectl get pods -l env=prod
kubectl get pods --selector env!=dev
```

| Expression | Matches |
|---|---|
| `environment=production` | Objects where `environment` is exactly `production` |
| `environment==production` | Same as above — `=` and `==` are interchangeable |
| `environment!=production` | Objects where `environment` is anything *other than* `production` |

### 2.2 Set-Based Selectors

Match against a **set** of possible values, or just check whether a label key exists at all — supports `in`, `notin`, and existence checks.

```bash
kubectl get pods -l 'environment in (production, staging)'
kubectl get pods --selector 'tier notin (frontend)'
kubectl get pods -l 'tier'      # matches any Pod that has a "tier" label, regardless of its value
kubectl get pods -l '!tier'     # matches any Pod that does NOT have a "tier" label at all
```

| Expression | Matches |
|---|---|
| `environment in (production, staging)` | `environment` is either `production` or `staging` |
| `tier notin (frontend)` | `tier` exists but is not `frontend` |
| `tier` | Has a `tier` label, with any value |
| `!tier` | Does not have a `tier` label |

---

## 3. Selectors in Practice: `matchLabels` vs. `matchExpressions`

CLI filtering with `-l`/`--selector` is one thing — but the more important, everyday use of selectors is **inside YAML specs**, where Deployments and Services use them to find the Pods they're supposed to manage or route to.

| Field | Syntax style | Supports set-based operators? | Used by |
|---|---|---|---|
| `spec.selector.matchLabels` | Simple flat key-value map (equality only) | ❌ No | `Deployment`, `ReplicaSet`, `StatefulSet` |
| `spec.selector.matchExpressions` | `key` / `operator` / `values` list | ✅ Yes (`In`, `NotIn`, `Exists`, `DoesNotExist`) | Same objects — usually combined with `matchLabels` |
| `spec.selector` (plain map) | Simple flat key-value map only | ❌ No | `Service` — always equality-based, no `matchExpressions` option at all |

**`matchLabels`** — the simple, common case:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-deployment
spec:
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app   # ⚠️ must match spec.selector exactly, or the Deployment is rejected
    spec:
      containers:
        - name: my-container
          image: my-image
```

**`matchExpressions`** — for set-based logic (e.g. targeting several environments, or Pods missing a label):
```yaml
spec:
  selector:
    matchExpressions:
      - key: environment
        operator: In
        values: ["production", "staging"]
      - key: tier
        operator: Exists
```

<style>
body {font-size: 16px; line-height: 1.6;}
</style>