# 09: Gaining Superuser Access

## 1. Introduction
The **Superuser** (root) has unlimited privileges. Linux restricts administrative tasks to this user to prevent accidental system damage. Standard users must request permission to run administrative commands.

## 2. The Sudoers File
Permissions are defined in `/etc/sudoers`.

### Editing the File
> [!WARNING]
> Typically, you should **NEVER** edit `/etc/sudoers` directly with `vim`. Syntax errors can lock everyone out of root access.

**Always use:**
```bash
sudo visudo
```
This tool checks for syntax errors before saving.

### Syntax Format
```bash
User    Machine=(TargetUser:TargetGroup)    Commands
root    ALL=(ALL:ALL)                       ALL
```

**Fields:**
1.  **User:** The username granting permission.
2.  **Machine:** Hostname (usually `ALL`).
3.  **TargetUser:** Who the command runs as (usually `ALL` or `root`).
4.  **Commands:** List of allowed commands (absolute paths recommended).

#### Example: Password-less Sudo
```bash
# Allow 'karim' to run apt without a password
karim ALL=(ALL) NOPASSWD: /usr/bin/apt
```

## 3. Adding Users to Sudo Group
Instead of editing the sudoers file, it's safer to add the user to the administrative group (`sudo` on Debian/Ubuntu, `wheel` on RedHat/CentOS).

```bash
# Debian/Ubuntu
sudo usermod -aG sudo username

# RedHat/CentOS
sudo usermod -aG wheel username
```
*Changes require the user to logout and login again.*

## 4. Switching Users (`su`)
| Command | Description |
| :--- | :--- |
| `su <user>` | Switch user (keeps current environment vars). |
| `su - <user>` | Switch user (loads target user's full environment). **Recommended**. |
| `sudo -i` | Open a root shell (best practice for extended root sessions). |

## 5. Real-World Scenarios

### Scenario 1: Granting Limited Sudo Access
**Problem:** You want a developer to restart nginx without full root access.

**Solution:**
```bash
# Edit sudoers with visudo
developer ALL=(ALL) NOPASSWD: /usr/bin/systemctl restart nginx, /usr/bin/systemctl status nginx
```

### Scenario 2: Troubleshooting "user is not in the sudoers file"
**Problem:** User cannot run sudo commands.

**Solution:**
```bash
# As root, add user to sudo group
usermod -aG sudo username  # Debian/Ubuntu
usermod -aG wheel username # RedHat/CentOS

# User must logout and login for changes to take effect
```

### Scenario 3: Passwordless Sudo for Automation
**Problem:** Automated scripts need sudo without password prompts.

**Solution:**
```bash
# Use visudo to add:
automation_user ALL=(ALL) NOPASSWD: /usr/bin/apt update, /usr/bin/apt upgrade
```

> [!WARNING]
> Only grant NOPASSWD to specific, audited commands. Never grant `ALL` with NOPASSWD for security reasons.

## 6. Security Best Practices
-   Never share root password.
-   Use `sudo` for administrative tasks.
-   Check logs `/var/log/auth.log` for suspicious activity.

---

## 7. 🏆 Master Example: Granular Sudo Access
**Scenario:** You have a `junior_admin` who needs to restart the `httpd` service but should **NOT** have full root access or be able to edit configuration files.

```bash
# 1. Edit sudoers file safely
sudo visudo

# 2. Add this rule:
# User     Host=(RunAs)    Command
junior_admin ALL=(root) /bin/systemctl restart httpd

# 3. Verify
# junior_admin tries to run systemctl restart httpd -> WORKS
# junior_admin tries to run systemctl stop httpd    -> DENIED
# junior_admin tries to run vi /etc/httpd.conf     -> DENIED
```

> **Principle of Least Privilege:** Give users exactly the permissions they need, and nothing more.
-   Prefer adding users to the `sudo`/`wheel` group over editing `/etc/sudoers` manually.
-   See [12_Managing_Local_Users.md](./12_Managing_Local_Users.md) for user creation details.

## 8. Key Takeaways
-   Use `sudo <command>` for single administrative tasks.
-   Use `sudo visudo` to edit permissions.
-   Prefer adding users to the `sudo`/`wheel` group over editing `/etc/sudoers` manually.
-   See [12_Managing_Local_Users.md](./12_Managing_Local_Users.md) for user creation details.
