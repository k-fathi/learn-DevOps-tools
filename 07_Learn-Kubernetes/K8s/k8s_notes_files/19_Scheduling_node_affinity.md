# Scheduling in K8s - Node Affinity
Node Affinity is another K8s scheduling technique.

With node affinity, user can control where the pods can be scheduled.


# Node Affinity Types:
## 1. `Required`DuringSchedulingIgnoredDuringExecution.


```yaml
apiVersion: v1
kind: Pod
metadata:
    name: pod-1
spec:
    contaienrs:
    - name: nginx-cont
      image: nginx
    
    affinity:
        nodeAffinity:
            requiredDuringSchedulingIgnoredDuringExecution:
                nodeSelectorTerm:
                    - matchExpressions:
                      - key: <> # must mach the node label key
                        operator: In
                        values:
                        - <value> # must mach the node label value
```
### Required vs Ignored:
- `Required` means, the condition of [key-value] must be satisfied, or the pod will be in Pending state.    
- `Ignored` means, in case of any issue in the node, k8s will host this pod in any node else.

### Operators:
1. `In`: means, We need to schedule this pod in the node with this label key and value
2. `NotIn`: means, We need to schedule this pod at any node that have the node key and not the node value.
3. `Exists`: means, We need to schedule this pod at any node that This key, no matter the value is.


## 2. `Preferrd`DuringSchedulingIgnoredDuringExecution
```yaml
apiVersion: v1
kind: Pod
metadata:
    name: pod-1
spec:
    contaienrs:
    - name: nginx-cont
      image: nginx
    
    affinity:
        nodeAffinity:
            preferredDuringSchedulingIgnoredDuringExecution:
                - weight: 1 # node score 1:100
                  preference: 
                    matchExpressions:
                        - key: <> # must mach the node label key
                          operator: In
                          values:
                          - <value> # must mach the node label value
```

### preferred & Ignored:
- `preferred`: means, in case of k8s didn't find a node this node label, k8s will ignore the specified role and host the pod in any other node
- `Ignored` means, in case of any issue in the node, k8s will host this pod in any node else.

See: [Node Affinity](../k8s_yaml_files/14_scheduling_node_affinity.yaml)



## Why Use Both Node Affinity and Tolerations?
1. The most common use case is to use both node affinity and tolerations together.
2. Node affinity is used to ensure that pods are scheduled on nodes with specific labels.
3. Tolerations are used to allow pods to be scheduled on nodes that have taints, even if the pods don't have matching tolerations.

```YAML
# Taint & Toliration and Node Affinity:
# 1. Taint the node: kubectl taint node node1 database=mysql:NoSchedule
# 2. Label The node: kubectl label node node1 disktype=ssd
apiVersion: v1
kind: Pod
metadata:
  name: test-pod
  labels:
    app: java-spring-petclinic
spec:
  containers:
    - name: test-pod-cont
      image: nginx
  tolerations:
  - key: "database"
    operator: "Equal"
    value: "mysql"
    effect: "NoSchedule"
  
  affinity:
    nodeAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
        nodeSelectorTerms:
        - matchExpressions:
          - key: "disktype"
            operator: "In"
            values:
            - ssd

```