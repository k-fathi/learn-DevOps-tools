# NGINX: Reverse Proxy

## `Reverse Proxy`
A reverse proxy is a server that sits between client devices and a web server, forwarding client requests to the web server and returning the server's response to the clients. NGINX can be configured as a reverse proxy to distribute incoming traffic across multiple backend servers, improving performance, scalability, and security
> ### proxy_pass <service_name:port> is the directive that tells NGINX to forward requests to a backend server. The backend server can be another web server, an application server, or any other service that can handle HTTP requests.

Example:
```nginx
server {
    listen 80;
    server_name example.com;
    location / {
        proxy_pass http://backend_server:8080; # Here is the line we concerned about
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```
- `proxy_pass` specifies the backend server to which NGINX will forward client requests.
- `proxy_set_header` directives are used to set or modify HTTP headers in the request sent to the backend server. This is important for preserving client information and ensuring proper communication between NGINX and the backend server.


### Example of a reverse proxy setup with PHP-FPM and NGINX:
```nginx
server {
    listen 80;
    server_name example.com;
    root /var/www/example.com;

    location / {
        index index.php index.html index.htm;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php7.4-fpm.sock; # Adjust the PHP version as needed
     
        include fastcgi_params;
        include snippets/fastcgi-php.conf;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
    }
}
```
- **`How PHP-FPM works with NGINX?`**:
    - FPM stands for FastCGI Process Manager, which is a PHP implementation designed to handle high loads and improve performance.
    - It manages a pool of worker processes that can handle multiple PHP requests concurrently.
    - It cann't understand the HTTP protocol, so it needs a web server like NGINX to handle the HTTP requests and forward them to PHP-FPM for processing.
    - So we use `fastcgi_pass` directive to forward the request to PHP-FPM instead of using `proxy_pass` directive. 
    - When a client requests a PHP file, NGINX forwards the request to the PHP-FPM process using the `fastcgi_pass` directive.
    - PHP-FPM processes the PHP script and generates the output (HTML, JSON, etc.).
    - The output is sent back to NGINX, which then returns it to the client.
