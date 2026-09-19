# StatefulSets

## State Types

### Stateless Applications
- Pods are created and destroyed without regard for application state
- Each pod is independent and replaceable at any time
- Each request is completely new and independent
- No data persistence concerns
- **Example**: Web applications (they don't store data requiring preservation across restarts)

### Stateful Applications
- Pods are created and destroyed with regard for application state
- Each pod has a unique, persistent identity maintained across restarts
- Data persistence is critical
- **Example**: Databases (store data that must persist across restarts)

**Typical Architecture**: Stateless apps (web tier) connect to stateful apps (database tier)

---

## Deployment vs StatefulSets

| Aspect | Deployment | StatefulSet |
|--------|-----------|-------------|
| Use Case | Stateless applications | Stateful applications |
| Pod Identity | Random, interchangeable | Stable, unique per pod |
| Network Identity | Dynamic | Stable DNS names |
| Scaling Behavior | Simple, no data sync | Preserves data on scale |
| Pod Replacement | Any pod can be replaced | Same pod identity maintained |

---

## Why StatefulSets?

### Challenges with Deployment for Stateful Apps

**Problem 1: Pod Naming**
- Deployments create pods with random hashed names
- Applications can't reliably reference specific pods

**Problem 2: Data Consistency on Scaling**
- When scaling from 3 to 5 replicas: do new replicas get existing data or start empty?
- How do replicas synchronize state?

**Problem 3: Pod Communication**
- Without stable identities, applications can't maintain persistent connections

### StatefulSet Solutions

- **Stable Network Identity**: Each pod gets a predictable DNS name
- **Data Preservation**: Pod names remain consistent across restarts
- **Ordered Scaling**: Pods scale up/down in predictable order
- **Persistent Storage**: Each pod can have dedicated storage

---

## Example: StatefulSet YAML

```yaml
# Create a Headless Service for Stable Network Identity
apiVersion: v1
kind: Service
metadata:
    name: mysql
spec:
    clusterIP: None # Headless service for stable DNS
    selector:
        app: mysql
    ports:
        - port: 3306
        - port: 33060
---
# StatefulSet Definition
apiVersion: apps/v1
kind: StatefulSet
metadata:
    name: mysql
spec:
    serviceName: mysql
    replicas: 1 # more than 1 required sync between pods, so start with 1 to avoid complexity
    selector:
        matchLabels:
            app: mysql
    template:
        metadata:
            labels:
                app: mysql
        spec:
            containers:
            - name: mysql
                image: mysql:8.0
                ports:
                - containerPort: 3306
                volumeMounts:
                - name: data
                    mountPath: /var/lib/mysql
    # request a storage for each pod from default storage class with capacity = 10Gi 
    volumeClaimTemplates:
    - metadata:
            name: data
        spec:
            accessModes: [ "ReadWriteOnce" ]
            resources:
                requests:
                    storage: 10Gi
```

