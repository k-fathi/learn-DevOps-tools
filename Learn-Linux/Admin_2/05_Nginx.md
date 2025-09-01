# Nginx Administration

This document provides an overview of essential Nginx administration tasks, including installation, configuration, and management commands. Follow these steps to get started:

---

## 🚀 Installation

**On Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install nginx
```

**On CentOS/RHEL:**
```bash
sudo yum install epel-release
sudo yum install nginx
```

---

## ⚙️ Basic Commands

- **Start Nginx:**  
    `sudo systemctl start nginx`
- **Stop Nginx:**  
    `sudo systemctl stop nginx`
- **Restart Nginx:**  
    `sudo systemctl restart nginx`
- **Check status:**  
    `sudo systemctl status nginx`

---

## 📝 Configuration

Nginx configuration files are located at:

- `/etc/nginx/nginx.conf` — Main configuration file
- `/etc/nginx/sites-available/` — Site-specific configs
- `/etc/nginx/sites-enabled/` — Enabled site configs (symlinks)

**To test configuration changes:**
```bash
sudo nginx -t
```

**Reload Nginx after changes:**
```bash
sudo systemctl reload nginx
```

---

## 📁 Typical Setup Steps

1. **Edit Main Config:**  
     `/etc/nginx/nginx.conf`  
     *This is the main configuration file for Nginx.*

2. **Create Site Config:**  
     `/etc/nginx/sites-available/<your-site-config>`  
     ```nginx
     server {
             listen <listen-port>;
             root   <path-to-view>;
             index  index.html;
     }
     ```

3. **Enable Site:**  
     Create a symbolic link in `/etc/nginx/sites-enabled/`  
     ```bash
     sudo ln -s /etc/nginx/sites-available/<your-site-config> /etc/nginx/sites-enabled/
     ```

4. **Add Content:**  
     Place your site files in `<path-to-view>/index.html`

5. **Restart Nginx:**  
     ```bash
     sudo systemctl restart nginx
     ```

6. **Access Site:**  
     Visit `http://localhost:<your-site-port>`

---

## 🛠️ Troubleshooting Tips

- Check error logs:  
    `/var/log/nginx/error.log`
- Check access logs:  
    `/var/log/nginx/access.log`
- Use `nginx -t` to validate config before restarting.

---

## 📚 Useful Resources

- [Nginx Documentation](https://nginx.org/en/docs/)
- [DigitalOcean Nginx Guide](https://www.digitalocean.com/community/tutorials/how-to-install-nginx-on-ubuntu-20-04)
- [Nginx Beginner’s Guide](https://www.nginx.com/resources/wiki/start/)

---

> **Tip:** Always backup your configuration files before making changes!