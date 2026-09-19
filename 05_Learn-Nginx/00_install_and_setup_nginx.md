# NGINX Installation & Basic Setup Guide

## Table of Contents

- [Prerequisites](#1-prerequisites)
- [Step-by-Step Installation](#2-step-by-step-installation)
- [Adjusting the Firewall](#3-adjusting-the-firewall)
- [Managing the NGINX Service](#4-managing-the-nginx-service)

---

# 1. Prerequisites

Before you begin, you will need:
* A server running a modern Linux distribution (this guide covers Debian/Ubuntu and CentOS/RHEL).
* Access to a user account with `sudo` or root privileges.
* A domain name pointed at your server's public IP address (optional, for the final setup step).

---

# 2. Step-by-Step Installation

First, you need to install the NGINX package. The commands differ based on your operating system's package manager.

## On Ubuntu / Debian (`apt`)

1.  **Update your package sources:**
    ```bash
    sudo apt update
    ```

2.  **Install NGINX:**
    ```bash
    sudo apt install nginx
    ```

## On CentOS / RHEL (`yum` or `dnf`)

1.  **Install the EPEL repository (if not already installed):**
    ```bash
    sudo yum install epel-release
    ```
    *(For modern CentOS/RHEL versions, you might use `dnf` instead of `yum`)*

2.  **Install NGINX:**
    ```bash
    sudo yum install nginx
    ```

---

3. Adjusting the Firewall

You must allow web traffic through your server's firewall.

### For `ufw` (common on Ubuntu)

1.  **List available application profiles:**
    ```bash
    sudo ufw app list
    ```
    You will see an output like this:
    ```
    Available applications:
      NGINX Full
      NGINX HTTP
      NGINX HTTPS
      OpenSSH
    ```
    * `NGINX HTTP`: Opens port 80 (standard, unencrypted web traffic).
    * `NGINX HTTPS`: Opens port 443 (TLS/SSL encrypted traffic).
    * `NGINX Full`: Opens both port 80 and 443.

2.  **Allow traffic (choose 'NGINX Full' for flexibility):**
    ```bash
    sudo ufw allow 'NGINX Full'
    ```

3.  **Verify the change:**
    ```bash
    sudo ufw status
    ```

### For `firewalld` (common on CentOS/RHEL)

1.  **Allow HTTP and HTTPS traffic permanently:**
    ```bash
    sudo firewall-cmd --permanent --add-service=http
    sudo firewall-cmd --permanent --add-service=https
    ```

2.  **Reload the firewall to apply the changes:**
    ```bash
    sudo firewall-cmd --reload
    ```

## Managing the NGINX Service

NGINX is managed using `systemctl`.

* **Start the NGINX service:**
    ```bash
    sudo systemctl start nginx
    ```

* **Enable NGINX to start on boot:**
    ```bash
    sudo systemctl enable nginx
    ```

* **Check the status of the service:**
    ```bash
    sudo systemctl status nginx
    ```
    If it's running correctly, you should see `active (running)`.

* **To stop the service:**
    ```bash
    sudo systemctl stop nginx
    ```

* **To restart the service:**
    ```bash
    sudo systemctl restart nginx
    ```

* **To reload configurations without dropping connections:**
    ```bash
    sudo systemctl reload nginx
    ```

## Using `Docker Containers`
```bash
docker run --name nginx -p 80:80 -d nginx
```


At this point, you should be able to navigate to your server's IP address in a web browser and see the default NGINX welcome page.

