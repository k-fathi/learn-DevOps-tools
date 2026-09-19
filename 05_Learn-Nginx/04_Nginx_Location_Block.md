# NGINX: Location Blocks

## `Location BLocks`
- `location` specifies the location block for a specific URL path. This allows you to define different settings for different parts of your website.
    Syntax:
    ```nginx
    location [optional modifier] [URI] {
        # Configuration for this location
    }
    ```
    Example:
    ```nginx
    server {
        listen 80;
        server_name devops-galaxy.me www.devops-galaxy.me;
        root /var/www/devops-galaxy;
        error_page 404 /404.html;
        location / {
            index index.html index.htm index.php;
        }

        location /images/ {
            root /var/www/devops-galaxy; 
        }
    }
    ```
    * The `location` directive is used to define a block of configuration that applies to a specific URL path. In this example, we have two location blocks: one for the root path `/` and one for the `/images/` path.
    
    * The first location block specifies that when a user requests the root path `/`, NGINX will look for the `index.html` or `index.htm` file in the root directory specified by the `root` directive.
    * The second location block specifies that when a user requests the `/images/` path, NGINX will look for files in the `/var/www/devops-galaxy/images` directory instead of the root directory specified by the `root` directive. This allows you to serve different content for different parts of your website.
    
    * The root directive here is optional, as it will inherit the root from the server block if not specified.
    * Nginx will stick the /images/ path to the root path, so it will look for images in /var/www/devops-galaxy/images/
    * We can use `alias` directive instead of `root` to specify a different directory for the /images/ path.
    ```nginx
    location /images/ {
        alias /var/www/devops-galaxy/images/;
    }
    ```
    * Here's the **trick**: NGINX knows the root path is `/var/www/devops-galaxy`, so it automatically appends the `/images/` path to it, even if the `location /images/ {}` block is empty. This means NGINX will look for images in `/var/www/devops-galaxy/images/`. Since the location block is empty and adds no additional configuration, you can omit it entirely if you don't need custom settings for that path.

    ```mermaid
    graph TD
    User([User types devops-galaxy.me]) --> DNS{DNS Server}
    DNS -- Returns IP Address --> Browser[Browser]
    
    Browser -- "HTTP Request to IP + Port 80<br>Host Header: devops-galaxy.me" --> NGINX[NGINX Server]
    
    subgraph NGINX_Architecture [NGINX Internal Routing]
        NGINX --> MatchHost{Matches Host Header<br>with server_name}
        MatchHost -- "If match found" --> ServerBlock[Enters the Server Block]
        ServerBlock --> RootDir[Sets Base Root:<br>/var/www/devops-galaxy]
        
        RootDir --> LocationMatch{Looks for matching Location}
        
        LocationMatch -- "If user requests /" --> LocRoot[location /]
        LocRoot --> IndexDir[Index Directive:<br>Looks for index.html, falls back to others]
        
        LocationMatch -- "If user requests /images/" --> LocImages[location /images/]
        LocImages --> ServeImages[Appends URI to Root<br>Serves from /var/www/devops-galaxy/images/]
    end
    ```
    ### Location with modifiers
    NGINX allows you to use modifiers in the `location` directive to control how it matches the requested URI. The available modifiers are:
        - if you add any characters after `/images/`, like `http://devops-galaxy.me/imagesxxx`, NGINX will still use the `/images/` location block because it starts with `/images/`, but it will continue to check for regex matches in other location blocks if they exist.
    
    - `=`: **Exact match**. The location block will only be used if the requested URI exactly matches the specified URI.
        * Example:
        - The server block was configured like this:
        ```nginx
        server {
            listen 80;
            server_name devops-galaxy.me www.devops-galaxy.me;
            root /var/www/devops-galaxy;
            error_page 404 /404.html;
            location = / {
                index index.html index.htm index.php;
            }
            location = /images/ {
                root /var/www/devops-galaxy; 
            }
        }
        ```
        - and you enter in browser: `http://devops-galaxy.me/images/`, NGINX will check the location block with `= /images/` and serve the content from `/var/www/devops-galaxy/images/`.
        - if you add any characters after `/images/`, NGINX will `NOT` use this location block because it requires an exact match.

    - `^~`: **Prefix match**. If the requested URI starts with the specified URI, this location block will be used, and NGINX will not check for any regex matches.
        * Example:
        - The server block was configured like this:
        ```nginx
        server {
            listen 80;
            server_name devops-galaxy.me www.devops-galaxy.me;
            root /var/www/devops-galaxy;
             error_page 404 /404.html;
            location = / {
                index index.html index.htm index.php;
            }
            location ^~ /images/ {
                root /var/www/devops-galaxy; 
            }
        }
        ```
        - and you enter in browser: `http://devops-galaxy.me/images/`, NGINX will check the location block with `^~ /images/` and serve the content from `/var/www/devops-galaxy/images/`.
        - if you add any characters after `/images/`, like `http://devops-galaxy.me/imagesxxx`, NGINX will still use the `/images/` location block because it starts with `/images/`, and it will not check for any regex matches in other location blocks.

    - `~`: **Case-sensitive regex match**. The location block will be used if the requested URI matches the specified regex pattern.
        * Example:
        - The server block was configured like this:
        ```nginx
        server {
            listen 80;
            server_name devops-galaxy.me www.devops-galaxy.me;
            root /var/www/devops-galaxy;
            error_page 404 /404.html;
            location ~ \.(jpg|jpeg|png|gif)$ {
                root /var/www/devops-galaxy/images/;
            }
        }
        ```
        - and you enter in browser: `http://devops-galaxy.me/images/picture.jpg`, NGINX will check the location block with `~ \.(jpg|jpeg|png|gif)$` and serve the content from `/var/www/devops-galaxy/images/picture.jpg`.
        - if you enter in browser: `http://devops-galaxy.me/images/picture.JPG`, NGINX will `NOT` use this location block because it is case-sensitive and the regex pattern does not match.   

    - `~*`: **Case-insensitive regex match**. The location block will be used if the requested URI matches the specified regex pattern, ignoring case.
        * Example:
        - The server block was configured like this:
        ```nginx
        server {
            listen 80;
            server_name devops-galaxy.me www.devops-galaxy.me;
            root /var/www/devops-galaxy;
            error_page 404 /404.html;
            location ~* \.(jpg|jpeg|png|gif)$ {
                root /var/www/devops-galaxy/images/;
            }
        }
        ```
        - and you enter in browser: `http://devops-galaxy.me/images/picture.JPG`, NGINX will check the location block with `~* \.(jpg|jpeg|png|gif)$` and serve the content from `/var/www/devops-galaxy/images/picture.JPG`.
        - if you enter in browser: `http://devops-galaxy.me/images/picture.txt`, NGINX will `NOT` use this location block because the regex pattern does not match.


    - `none`: **No modifier**. If the requested URI starts with the specified URI, this location block will be used, but NGINX will continue to check for regex matches.
        * Examples: 
        - The server block was configured like this:
        ```nginx
        server {
            listen 80;
            server_name devops-galaxy.me www.devops-galaxy.me;
            root /var/www/devops-galaxy;
            error_page 404 /404.html;
            location / {
                index index.html index.htm index.php;
            }

            location /images/ {
                root /var/www/devops-galaxy; 
            }
        }
        ```
        - and you enter in browser: `http://devops-galaxy.me/images/`, NGINX will check the location block with `/images/` and serve the content from `/var/www/devops-galaxy/images/`.
