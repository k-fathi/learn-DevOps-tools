# NGINX Redirecting and Forwarding

## 1. `return` directive
`return` directive is used to redirect the client to a different URL. It can be used for both permanent and temporary redirects.

```nginx
server {
    listen 80;
    server_name example.com;

    location / {
        return 301 https://www.example.com$request_uri; # Permanent redirect
    }
}
```
- that means if the client requests the server on `http://example.com/some/path`, they will be redirected to `https://www.example.com/some/path`.
- `301` means permanent redirect, while `302` means temporary redirect.
- permanent redirect means that the client should update their bookmarks and search engines should update their index, while temporary redirect means that the client should not update their bookmarks and search engines should not update their index.


## 2. `rewrite` directive
`rewrite` directive is used to modify the URL before passing it to the backend server. It can be used to change the URL path, query string, or both.

```nginx
server {
    listen 80;
    server_name example.com;
    location / {
        rewrite ^/old-path/(.*)$ /new-path/$1 permanent; # Permanent redirect
    }
}
```
- that means if the client requests the server on `http://example.com/old-path/some/path`, they will be redirected to `http://example.com/new-path/some/path`.
- `permanent` means permanent redirect, while `redirect` means temporary redirect.

