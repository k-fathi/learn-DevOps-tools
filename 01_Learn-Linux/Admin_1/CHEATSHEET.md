# Linux Admin 1 - Command Cheat Sheet

Quick reference guide for essential Linux commands covered in this course.

---

## 📋 Table of Contents
- [Navigation & Files](#navigation--files)
- [Text Processing](#text-processing)
- [Users & Permissions](#users--permissions)
- [Processes](#processes)
- [Networking](#networking)
- [Package Management](#package-management)
- [System Administration](#system-administration)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [🏆 Master One-Liners](#-master-one-liners)

---

## 🗂️ Navigation & Files

| Command | Description | Example |
|---------|-------------|---------|
| `pwd` | Print working directory | `pwd` |
| `cd <dir>` | Change directory | `cd /var/log` |
| `cd -` | Go to previous directory | `cd -` |
| `ls -la` | List all files (detailed) | `ls -lthr` |
| `tree -L 2` | Show directory tree (depth 2) | `tree -L 2 /etc` |
| `mkdir -p` | Create nested directories | `mkdir -p dir1/dir2/dir3` |
| `cp -r` | Copy recursively | `cp -r /src /dest` |
| `mv` | Move or rename | `mv old.txt new.txt` |
| `rm -rf` | Remove recursively (DANGEROUS) | `rm -rf /tmp/test` |
| `find` | Search for files | `find /home -name "*.log"` |
| `locate` | Fast file search (uses DB) | `locate passwd` |

---

## 📄 Text Processing

| Command | Description | Example |
|---------|-------------|---------|
| `cat file` | Display file | `cat /etc/passwd` |
| `less file` | View file (paginated) | `less /var/log/syslog` |
| `head -n 10` | First 10 lines | `head -n 10 file.txt` |
| `tail -f` | Follow file (real-time) | `tail -f /var/log/apache2/access.log` |
| `grep <pattern>` | Search in file | `grep "error" logfile.txt` |
| `grep -ri` | Recursive, case-insensitive | `grep -ri "failed" /var/log` |
| `cut -d: -f1` | Extract columns | `cut -d: -f1 /etc/passwd` |
| `tr 'a-z' 'A-Z'` | Translate characters | `echo "hello" \| tr 'a-z' 'A-Z'` |
| `sort` | Sort lines | `sort file.txt` |
| `uniq` | Remove duplicates | `sort file.txt \| uniq` |
| `wc -l` | Count lines | `wc -l file.txt` |
| `sed 's/old/new/'` | Replace text | `sed 's/http/https/' config.txt` |
| `awk '{print $1}'` | Print column | `awk '{print $1}' file.txt` |

---

## 👥 Users & Permissions

| Command | Description | Example |
|---------|-------------|---------|
| `whoami` | Current user | `whoami` |
| `id username` | User details | `id karim` |
| `sudo <cmd>` | Run as root | `sudo apt update` |
| `sudo -i` | Root shell | `sudo -i` |
| `su - user` | Switch user | `su - karim` |
| `useradd -m` | Create user + home | `sudo useradd -m john` |
| `usermod -aG group user` | Add user to group | `sudo usermod -aG docker karim` |
| `userdel -r` | Delete user + home | `sudo userdel -r john` |
| `passwd user` | Change password | `sudo passwd karim` |
| `chage -l user` | View password policy | `sudo chage -l karim` |
| `groupadd group` | Create group | `sudo groupadd devs` |
| `chmod 755 file` | Change permissions (octal) | `chmod 755 script.sh` |
| `chmod u+x file` | Add execute permission | `chmod u+x script.sh` |
| `chown user:group file` | Change ownership | `sudo chown karim:karim file.txt` |
| `umask 022` | Set default permissions | `umask 022` |

### Permission Quick Reference
| Octal | Symbol | Meaning |
|-------|--------|---------|
| 7 | rwx | Read, Write, Execute |
| 6 | rw- | Read, Write |
| 5 | r-x | Read, Execute |
| 4 | r-- | Read only |
| 0 | --- | No permissions |

**Example:** `chmod 755 script.sh` = `rwxr-xr-x` (Owner: full, Group/Others: read+execute)

---

## ⚙️ Processes

| Command | Description | Example |
|---------|-------------|---------|
| `ps aux` | List all processes | `ps aux` |
| `ps -ef` | Alternative format | `ps -ef` |
| `pstree` | Process tree | `pstree -p` |
| `top` | Process monitor | `top` |
| `htop` | Better process monitor | `htop` |
| `pgrep name` | Find PID by name | `pgrep -a ssh` |
| `kill PID` | Terminate process | `kill 1234` |
| `kill -9 PID` | Force kill | `kill -9 1234` |
| `pkill name` | Kill by name | `pkill firefox` |
| `killall name` | Kill all instances | `killall chrome` |
| `command &` | Run in background | `./script.sh &` |
| `jobs` | List background jobs | `jobs` |
| `fg %1` | Bring job to foreground | `fg %1` |
| `bg %1` | Resume job in background | `bg %1` |
| `nice -n 10 cmd` | Start with low priority | `nice -n 10 ./script.sh` |
| `renice -5 -p PID` | Change priority | `sudo renice -5 -p 1234` |

### systemd Services
| Command | Description | Example |
|---------|-------------|---------|
| `systemctl start service` | Start service | `sudo systemctl start nginx` |
| `systemctl stop service` | Stop service | `sudo systemctl stop nginx` |
| `systemctl restart service` | Restart service | `sudo systemctl restart nginx` |
| `systemctl reload service` | Reload config | `sudo systemctl reload nginx` |
| `systemctl enable service` | Auto-start at boot | `sudo systemctl enable nginx` |
| `systemctl disable service` | Disable auto-start | `sudo systemctl disable nginx` |
| `systemctl status service` | Check status | `systemctl status sshd` |
| `systemctl list-units --type=service` | List all services | `systemctl list-units --type=service` |

---

## 🌐 Networking

| Command | Description | Example |
|---------|-------------|---------|
| `ip a` | Show IP addresses | `ip a` |
| `ip link show` | Show network interfaces | `ip link show` |
| `ip route` | Show routing table | `ip route` |
| `ss -tuln` | Show listening ports | `ss -tuln` |
| `ping host` | Test connectivity | `ping -c 4 google.com` |
| `traceroute host` | Trace route | `traceroute google.com` |
| `nmcli` | Network Manager CLI | `nmcli connection show` |
| `nmcli con up <name>` | Activate connection | `nmcli con up "WiFi"` |
| `ssh user@host` | Connect via SSH | `ssh root@192.168.1.10` |
| `ssh-keygen` | Generate SSH keys | `ssh-keygen -t rsa -b 4096` |
| `ssh-copy-id user@host` | Copy SSH key to server | `ssh-copy-id user@192.168.1.10` |
| `scp file user@host:/path` | Copy file over SSH | `scp file.txt user@server:/tmp/` |
| `rsync -av src/ dest/` | Sync directories | `rsync -av /data/ backup/` |

---

## 📦 Package Management

### Debian/Ubuntu (apt)
| Command | Description | Example |
|---------|-------------|---------|
| `apt update` | Update package list | `sudo apt update` |
| `apt upgrade` | Upgrade packages | `sudo apt upgrade` |
| `apt install pkg` | Install package | `sudo apt install nginx` |
| `apt remove pkg` | Remove package | `sudo apt remove nginx` |
| `apt purge pkg` | Remove + config | `sudo apt purge nginx` |
| `apt search keyword` | Search packages | `apt search python` |
| `apt show pkg` | Show package info | `apt show nginx` |
| `dpkg -l` | List installed packages | `dpkg -l` |
| `dpkg -i pkg.deb` | Install .deb file | `sudo dpkg -i package.deb` |

### RedHat/CentOS (dnf/yum)
| Command | Description | Example |
|---------|-------------|---------|
| `dnf update` | Update packages | `sudo dnf update` |
| `dnf install pkg` | Install package | `sudo dnf install httpd` |
| `dnf remove pkg` | Remove package | `sudo dnf remove httpd` |
| `dnf search keyword` | Search packages | `dnf search python` |
| `dnf info pkg` | Show package info | `dnf info httpd` |
| `rpm -qa` | List installed packages | `rpm -qa` |
| `rpm -ivh pkg.rpm` | Install .rpm file | `sudo rpm -ivh package.rpm` |

---

## 🛠️ System Administration

### Logs
| Command | Description | Example |
|---------|-------------|---------|
| `journalctl` | View systemd logs | `journalctl` |
| `journalctl -f` | Follow logs | `journalctl -f` |
| `journalctl -u service` | Logs for specific service | `journalctl -u sshd` |
| `journalctl -xe` | Recent logs with explanations | `journalctl -xe` |
| `journalctl --since "1 hour ago"` | Time-filtered logs | `journalctl --since "1 hour ago"` |
| `tail -f /var/log/syslog` | Follow syslog | `tail -f /var/log/syslog` |

### Disk & Filesystem
| Command | Description | Example |
|---------|-------------|---------|
| `df -h` | Disk space usage | `df -h` |
| `du -sh directory` | Directory size | `du -sh /var/log` |
| `lsblk` | List block devices | `lsblk` |
| `mount` | Show mounted filesystems | `mount` |
| `mount /dev/sdb1 /mnt` | Mount filesystem | `sudo mount /dev/sdb1 /mnt/usb` |
| `umount /mnt` | Unmount filesystem | `sudo umount /mnt/usb` |
| `mount -a` | Mount all from fstab | `sudo mount -a` |

### Archiving & Compression
| Command | Description | Example |
|---------|-------------|---------|
| `tar -czf archive.tar.gz dir/` | Create gzip archive | `tar -czf backup.tar.gz /data/` |
| `tar -xzf archive.tar.gz` | Extract gzip archive | `tar -xzf backup.tar.gz` |
| `tar -cJf archive.tar.xz dir/` | Create xz archive | `tar -cJf backup.tar.xz /data/` |
| `tar -tf archive.tar.gz` | List archive contents | `tar -tf backup.tar.gz` |
| `gzip file` | Compress file | `gzip largefile.log` |
| `gunzip file.gz` | Decompress file | `gunzip largefile.log.gz` |

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + C` | Terminate current process |
| `Ctrl + D` | Exit current shell |
| `Ctrl + Z` | Suspend current process |
| `Ctrl + L` | Clear screen |
| `Ctrl + R` | Search command history |
| `Ctrl + A` | Move to beginning of line |
| `Ctrl + E` | Move to end of line |
| `Ctrl + U` | Delete from cursor to beginning |
| `Ctrl + K` | Delete from cursor to end |
| `Alt + .` | Paste last argument |
| `Tab` | Auto-complete |
| `Tab Tab` | Show all completions |

---

## 🔐 Common Patterns

### Silent Command Execution
```bash
command > /dev/null 2>&1
```

### Writing to Protected Files (with sudo)
```bash
echo "content" | sudo tee -a /etc/hosts
```

### Find and Delete Files
```bash
find /tmp -name "*.tmp" -type f -delete
```

### Monitor Log in Real-Time
```bash
tail -f /var/log/syslog | grep --color=auto "error"
```

### Count Files in Directory
```bash
ls -1 | wc -l
```

### Check Port Usage
```bash
ss -tuln | grep :80
```

---

---

## 🏆 Master One-Liners

### 🚀 Log Analysis (Top 404 Errors)
```bash
cat access.log | grep "404" | awk '{print $1}' | sort | uniq -c | sort -nr | head -n 5
```

### 🧹 System Cleanup (Old Temp Files)
```bash
find /tmp -name "*.tmp" -type f -mtime +30 -print0 | xargs -0 rm -v
```

### 🔍 Security Audit (SSH Failures)
```bash
journalctl -u ssh --since "1 hour ago" | grep "Failed password" | awk '{print $(NF-3)}' | sort | uniq -c
```

### 🌐 Instant Web Server (Python)
```bash
python3 -m http.server 8000
```

### 📂 Quick Backup (Archive & Compress)
```bash
tar -czvf "backup_$(date +%F).tar.gz" /var/www/html --exclude='cache'
```

---

## 📌 Pro Tips

1. **Always use `-i` (interactive) when learning to use destructive commands:**
   ```bash
   rm -i file.txt
   ```

2. **Test regex patterns before using them with sed/awk:**
   ```bash
   grep "pattern" file.txt  # test first
   sed 's/pattern/replacement/' file.txt  # then modify
   ```

3. **Always backup before editing critical files:**
   ```bash
   sudo cp /etc/fstab /etc/fstab.backup
   ```

4. **Use `history` to find commands you ran before:**
   ```bash
   history | grep "ssh"
   ```

5. **Check syntax before rebooting with configuration changes:**
   ```bash
   sudo mount -a  # Test fstab
   sudo nginx -t  # Test nginx config
   ```

---

**For detailed explanations and examples, refer to the specific module files.**

[📚 Back to Main README](./README.md)
