# ConfigMaps in K8s

## Overview

ConfigMaps are Kubernetes objects used to store non-confidential configuration data in key-value pairs. They decouple configuration from container images, enabling portable and reusable applications.

### Why Use ConfigMaps?

Instead of hardcoding configuration directly into containers, ConfigMaps provide three key benefits:

1. **Decoupling**: Configuration is managed separately from the application, following the separation of concerns principle.
2. **Environment-specific configuration**: The same pod can run across different environments (dev, staging, prod) with different configurations.
3. **Reusability**: Configuration can be shared across multiple pods without duplication.

ConfigMaps support three common patterns for passing configuration:
- Environment variables
- Configuration files
- Command-line arguments

## Example-1:
> Usual way to pass configuration data to a pod [env variables]:

```yaml
apiVersion: apps/v1
kind: Deployments
metadata:
    name: deploy-app
spec:
    replicas: 2
    contaienrs:
    - name: app
      image: app:v1
      env: 
        - name: "APP_MODE"
          value: "production"
        
        - name: "APP_PORT"
          value: "8080"
```

> lets now use ConfigMaps to do the same thing, but in a better way:
### 1. Create a ConfigMap with the configuration data:
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
    name: app-config
immutable: true # this means that the configMap is immutable, so if we want to update it, we have to delete it and create a new one.
data:
    APP_MODE: "production"
    APP_PORT: "8080"
``` 
Now we have a configMap named `app-config` with the configuration data.

```bash
k apply -f configMap.yaml
```
```bash
k get cm
```
```bash
k describe cm app-config
```

### 2. Create a deployment that uses this configMap:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
    name: deploy-app
spec:
    replicas: 2
    selector:
        matchLabels:
            app: app
    template:
        metadata:
            labels:
                app: app
        spec:
            containers:
            - name: app
              image: app:v1
              env:
                # means, For the key APP_MODE assigned the value of the APP_MODE key from the configMap named app-config 
                - name: "APP_MODE"
                  valueFrom:
                    configMapKeyRef:
                        name: app-config # the name of the configMap
                        key: APP_MODE    # the key in the configMap
                - name: "APP_PORT"
                  valueFrom:
                    configMapKeyRef:
                        name: app-config
                        key: APP_PORT

```

What if you have a large numbre of variables and you want to pass the env variables from the configMap to the pod, it is not logical to pass them one by one, so we can use the `envFrom` field to pass all the env variables from the configMap to the pod:
```yaml
spec:
    containers:
    - name: app
      image: app:v1
      envFrom:
        - configMapRef:
            name: app-config
```

Now the pod will have all the env variables from the configMap `app-config` without having to specify them one by one.

```bash
kubectl exec -it deployments/app-with-cm -- printenv                                  

APP_MODE=production
APP_PORT=8080
```
### Notes:
- To prevent any one from modifiying the configMap, we use `immutable: true` in the configMap definition, so that if we want to update the configMap, we have to delete it and create a new one.

## Example-2:
> Usual way to pass configuration data to a pod [configuration files]:

Usualy used with nginx 

the flow is that: 
- the configMap will contain the configuration file
- define a volume in the pod that will mount the configMap
- its mountPath is the configurations location
- the subPath used to mount only the file so that nginx will not mount the whole directory that will cause all already existing files to be gone
- declare a volume of type configMap
- as we define a volume of type config map it will directelly converts all the data in the configMap into files with the same name as the key in the configMap, and the content of the file will be the value of the key in the configMap.


1. create a configMap with the configuration data:
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
    name: nginx-configurations-cm
data:
    nginx.conf: | # This will be the file name that will mounted inside the pod
        server {
            listen 80;
            server_name app.com;
            location / {
                proxy_pass http://backend:8080;
            }
        }
```

2. Create a Deployment that the configMap was injected in
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
    name: deploy-app
spec:
    replicas: 2
    selector:
        matchLabels:
            app: nginx
    template:
        metadata:
            labels:
                app: nginx
        spec:
            containers:
            - name: nginx-container    
              image: nginx
              
              # mount this path /etc/nginx/nginx.conf to a configMap nginx-configurations-cm 
              volumeMounts:
              - name: nginx-configs
                mountPath: /etc/nginx/nginx.conf
                subPath: nginx.conf
            
            volumes:
            - name: nginx-configs
              configMap:
                name: nginx-configurations-cm
```
### Notes:
```yaml
subPath: nginx.conf
```
- only mount the file nginx.conf from the configMap.
- this is nessecary because the volumeMount will mount the whole directory, which will override the default nginx.conf file and the other nessecary files like mime.types, so we need to specify the file we want to mount.
- But as a tax, it prevent the pod to reload the configMap if it was updated, but we can solutions like:
    1. rolling restart the pod after updating the configMap.
        ```bash
        kubectl rollout restart deployment deploy-app
        ```
    2. mount the file to a different path to avoid overriding the default nginx.conf file with help of nginx directive `include /etc/nginx/conf.d/*.conf;` in the main nginx.conf file of the pod.

    3. Using Helm to manage the configMap and the deployment, so that when the configMap is updated, the deployment will be updated automatically.
    4. Using Reloaders like [Reloader](https://github.com/stakater/Reloader)
- Use `readOnly` mode for the volumeMount to prevent the pod from modifying the configMap. 
    ```yaml
    volumeMounts:
    - name: nginx-configs
      mountPath: /etc/nginx/nginx.conf
      subPath: nginx.conf
      readOnly: true
    ```


## Example-3:
> Usual way to pass configuration data to a pod [command-line arguments]:
1. create a configMap with the configuration data:
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-args-config
data:
  STARTUP_MSG: "Hello from DevOps Galaxy!"
  SERVER_PORT: "8080"
```

2. Create a Deployment that uses this configMap to pass command-line arguments to the container:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: test-args-deploy
spec:
  replicas: 1
  selector:
    matchLabels:
      app: test-app
  template:
    metadata:
      labels:
        app: test-app
    spec:
      containers:
      - name: test-container
        image: busybox
        
        #  scrape the values from the configMap and assign them to env variables 
        env:
          - name: STARTUP_MSG
            valueFrom:
              configMapKeyRef:
                name: app-args-config
                key: STARTUP_MSG
          - name: SERVER_PORT
            valueFrom:
              configMapKeyRef:
                name: app-args-config
                key: SERVER_PORT
        
        # use the env variables in the command-line arguments
        command: ["/bin/sh", "-c"]
        args: 
        - |
            echo $(STARTUP_MSG) && echo 'Starting server on port $(SERVER_PORT)' && sleep 3600

```


# ConfigMaps Command Reference
```bash
# Create a ConfigMap from a file
kubectl create configmap <configmap-name> --from-file=<path-to-file>

# Create a ConfigMap from literal values
kubectl create configmap <configmap-name> --from-literal=<key>=<value>

# Create a ConfigMap from an environment file
kubectl create configmap <configmap-name> --from-env-file=<path-to-env-file

# View all ConfigMaps in the current namespace
kubectl get configmaps

# View details of a specific ConfigMap
kubectl describe configmap <configmap-name>

# Delete a ConfigMap
kubectl delete configmap <configmap-name>

# Update a ConfigMap (requires re-creation of pods to apply changes)
kubectl apply -f <configmap-file.yaml>

# View the contents of a ConfigMap in YAML format
kubectl get configmap <configmap-name> -o yaml
```


<style>
body { font-size: 18px; }
</style>
