#  Secrets in Kubernetes (K8s)

##  Overview
**Secrets** are Kubernetes objects used to store sensitive information like passwords, tokens, and SSH keys. They are structurally similar to `ConfigMaps` but are specifically designed to handle confidential data securely. 
>  **Note:** The maximum size of a Secret is strictly limited to **1MB** to prevent API server memory exhaustion.

---

##  The Scenario: The Disaster of Hardcoding

Let's imagine a scenario where we have a backend pod that needs to connect to a database. A junior developer might hardcode the credentials directly in the Pod/Deployment spec:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: lumo-backend
spec:
  replicas: 1
  selector:
    matchLabels:
      app: lumo-backend
  template:
    metadata:
      labels:
        app: lumo-backend
    spec:
      containers:
      - name: backend
        image: lumo-backend:v1
        env:
          - name: DB_HOST
            value: "mysql-service"
          - name: DB_USER
            value: "root"
          
          # ==== ❌ DISASTROUS PRACTICE ❌ ====
          - name: DB_PASSWORD              
            value: "SuperSecretP@ssw0rd!"  
          # ===================================
```            
**Why is this disastrous?** 
If the Pod spec is exposed (via source code repositories or `kubectl get deploy`), the credentials are automatically compromised. We **must** use Kubernetes Secrets to decouple this sensitive data from the application code.

---

## The Solution: Creating a Secret Object

Let's create a Secret to store the database credentials properly.

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: db-credentials
type: Opaque
data:
    DB_PASSWORD: "U3VwZXJTZWNyZXRQQHNzdzByZCE=" # Base64 encoded value of "SuperSecretP@ssw0rd!"
```

###  Types of Secrets:
1. `Opaque`: The default type, used for arbitrary user-defined key-value pairs.
2. `kubernetes.io/service-account-token`: Automatically created for ServiceAccounts.
3. `kubernetes.io/dockercfg`: Used to store private Docker registry credentials.
4. `kubernetes.io/basic-auth`: Used for basic authentication credentials.
5. `kubernetes.io/ssh-auth`: Used for storing SSH keys.

---

###  The Technical Truth About the `data` Field & Base64

The `data` field requires all values to be **Base64 encoded**. 

> **TRAP:** 
> **Base64 is NOT encryption!** It is merely *encoding*. Kubernetes requires Base64 because it ensures that binary data or special characters (like `@`, `!`, or `\n`) do not break the JSON/YAML structure during API transport. 
> By default, Kubernetes stores these Secrets in its `etcd` database as **plain text** (Base64 decoded).

To encode your secret securely in Linux without adding a trailing newline:
```bash
echo -n "SuperSecretP@ssw0rd!" | base64
```

---

##  Connecting Secrets to the Application

Now we need to inject this Secret into our Deployment so the Pod can utilize it.

### Method 1: Injecting a Specific Key (`valueFrom`)
```yaml
        env:
          - name: DB_HOST
            value: "mysql-service"
          # ✅ SECURE WAY ✅
          - name: DB_PASSWORD
            valueFrom:
              secretKeyRef:
                name: db-credentials
                key: DB_PASSWORD            
                # Imports the value of `DB_PASSWORD` from the secret `db-credentials` and assigns it to the environment variable `DB_PASSWORD` in the container.
```

### Method 2: Injecting All Keys at Once (`envFrom`)
If you have multiple secrets, passing them one by one is inefficient. Use `envFrom` to load all key-value pairs as environment variables automatically:
```yaml
      envFrom:
        - secretRef:
            name: db-credentials
```

---

## The `stringData` Shortcut (For Testing Only)

To avoid manually encoding multiple variables, Kubernetes provides the `stringData` field. It allows you to write plain text, and Kubernetes will automatically Base64-encode it upon creation.

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: db-credentials
type: Opaque
stringData:
    DB_PASSWORD: "SuperSecretP@ssw0rd!"
    DB_USER: "root"
```
>  **Warning:** But as you expected, The secret is still exposed as plain text inside this YAML file. Do not use this method if the file will be committed to a Version Control System (like Git).

---

## Production Security & GitOps: What is the Best Practice?

Now that the application is ready, you might think about pushing this YAML file to your Source Code Management (SCM) like GitHub. 
**Wait!** You have a file containing easily decodable Base64 strings or plain text `stringData`. Pushing this is a massive security breach.

How should you handle this situation in a Production environment? You can choose from two main approaches:

### 1. The Declarative / Advanced Approach (GitOps Friendly)
If you must store Secret manifests in Git, you **must encrypt the file itself**:
* Use external encryption tools like **Sealed Secrets (Bitnami)** or **SOPS (Mozilla)** before pushing to Git.
* Integrate Kubernetes with an external secure vault (e.g., **AWS Secrets Manager**, **Azure Key Vault**, or **HashiCorp Vault**) via the *External Secrets Operator*.

### 2. The Imperative Approach (Quick & Git-less)
Do not create a YAML file for the Secret at all. Instead, create it directly inside the cluster using the CLI so the password never touches your hard drive or Git repository:
```bash
kubectl create secret generic db-credentials --from-literal=DB_PASSWORD="SuperSecretP@ssw0rd!"
```

### Cluster-Level Security (Encryption at Rest)
To secure the `etcd` database from physical theft or backend hacks, the Kubernetes Admin must configure **Encryption at Rest** by passing an `EncryptionConfiguration` file to the `kube-apiserver`, ensuring all Secrets are cryptographically scrambled before being written to disk.


## `imagePullSecrets`