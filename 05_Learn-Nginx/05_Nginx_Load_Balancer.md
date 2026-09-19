# NGINX: Load Balancer

##  `Load Balancing with NGINX`
Load balancing is a technique used to distribute incoming network traffic across multiple servers to ensure no single server becomes overwhelmed, improving performance, reliability, and availability of applications. NGINX can be configured as a load balancer to distribute traffic among multiple backend servers, providing better resource utilization and fault tolerance.
### Load Balancing Methods
NGINX supports several load balancing methods, each with its own advantages and use cases. The most common methods are:
1. **Round Robin (default)**: This is the default load balancing method in NGINX. It distributes incoming requests evenly across all available backend servers in a circular order. This method is simple and effective for most use cases, especially when all backend servers have similar performance characteristics.
2. **Least Connections**: This method directs incoming requests to the backend server with the fewest active connections. It is particularly useful when backend servers have varying performance levels or when some servers may be handling long-running requests. By directing traffic to the least busy server, this method helps maintain optimal performance and responsiveness.
3. **IP Hash**: This method uses the client's IP address to determine which backend server will handle the request. It ensures that requests from the same client are consistently directed to the same backend server, which can be beneficial for session persistence. However, it may lead to uneven load distribution if a large number of clients share the same IP address or if the client base is not evenly distributed.

Example of a load balancing configuration using the Round Robin method:
```nginx
http {
    upstream backend_servers {
        server backend1.example.com;
        server backend2.example.com;
        server backend3.example.com;
    }
    server {
        listen 80;
        server_name example.com;

        location / {
            proxy_pass http://backend_servers;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }
    }
}
```
- In this example, we define an `upstream` block named `backend_servers`, which contains three backend servers: `backend1.example.com`, `backend2.example.com`, and `backend3.example.com`. The `proxy_pass` directive in the `location /` block forwards incoming requests to the `backend_servers` upstream group, distributing the load among the three backend servers using the Round Robin method by default. The `proxy_set_header` directives ensure that the original client information is preserved when forwarding requests to the backend servers.

**How can we use the load balancing methods?**
- To use the Least Connections method, you can add the `least_conn` parameter to the `upstream` block:
```nginx
upstream backend_servers {
    least_conn;
    server backend1.example.com;
    server backend2.example.com;
    server backend3.example.com;
}
```
- To use the IP Hash method, you can add the `ip_hash` parameter to the `upstream` block:

```nginx
upstream backend_servers {
    ip_hash;
    server backend1.example.com;
    server backend2.example.com;
    server backend3.example.com;
}
```
> The `Round Robin` method is the default load balancing method in NGINX, so you don't need to specify it explicitly. If you don't include any parameters in the `upstream` block, NGINX will use the Round Robin method by default.


In most cases we use load balancer with reverse proxy, to forward the resuests to a container service that has many repliacas:
```nginx
http {
    upstream backend_servers {
        server backend:8080;
    }
    server {
        listen 80;
        server_name example.com;

        location / {
            proxy_pass http://backend_servers;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }
    }
}
```

NGINX commands[-t|-T|-s], HTTP status codes, 