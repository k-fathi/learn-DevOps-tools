# 10: Variables in Linux

## 1. Introduction
Variables store data (strings, numbers) that can be reused by the shell or scripts. They are classified into **User-Defined Variables** (Local) and **Environment Variables** (Global).

## 2. User-Defined Variables
Variables created by the user in the current session.
-   **Syntax:** `VAR_NAME=value` (No spaces around `=`).
-   **Access:** `$VAR_NAME`.

```bash
name="Karim"
echo "Hello, $name"
# Output: Hello, Karim
```

## 3. Environment Variables
System-wide variables that affect system behavior.
-   **PATH:** Directories where the shell looks for commands.
-   **USER:** Current logged-in user.
-   **HOME:** User's home directory.
-   **SHELL:** Path to the current shell.

```bash
echo $HOME
# Output: /home/karim
```

### The `PS1` Variable (Prompt String)
Defines the appearance of your command prompt.
```bash
echo $PS1
# Example output: \u@\h:\w\$
```
-   `\u`: Username
-   `\h`: Hostname
-   `\w`: Current Working Directory

## 4. Exporting Variables
By default, variables are **local** to the current shell. To make them available to **child processes** (sub-shells or scripts), you must `export` them.

```bash
# Local variable (not visible to child scripts)
my_var="local"

# Exported variable (visible to child scripts)
export MY_GLOBAL="global"
```

> [!NOTE]
> `export` makes a variable available to child processes, but child processes **cannot** modify variables in the parent shell.

## 5. Variable Management
| Command | Description |
| :--- | :--- |
| `set` | List all variables (shell & env) and functions. |
| `env` / `printenv` | List only environment (exported) variables. |
| `unset <name>` | Delete a variable. |

## 6. Summary
-   **Local Vars:** `VAR=value` (Shell only).
-   **Env Vars:** `export VAR=value` (Shell + Children).
-   **Persistence:** `~/.bashrc` or `/etc/environment`.

---

## 7. 🏆 Master Example: 12-Factor App Configuration
**Scenario:** Modern applications (like those in Docker) use Environment Variables for configuration, not hardcoded files. You are setting up a database connection string.

```bash
# 1. Set variables securely (space before command prevents history logging)
 export DB_HOST="db.prod.local"
 export DB_USER="admin"
 export DB_PASS="s3cr3t!"

# 2. Create a connection string using variables
APP_CONN_STR="mysql://$DB_USER:$DB_PASS@$DB_HOST:3306/webapp"

# 3. Verify
echo "Connecting to: $APP_CONN_STR"
# Output: Connecting to: mysql://admin:s3cr3t!@db.prod.local:3306/webapp

# 4. Make it persistent for the 'webapp' user only
echo 'export DB_HOST="db.prod.local"' >> /home/webapp/.bashrc
```

> **Why?** This keeps secrets out of your code and makes changing environments (Dev vs Prod) as easy as changing a variable.

## 8. Key Takeaways
-   `VAR=value` to set.
-   `$VAR` to read.
-   `export VAR` to share with child processes.
-   `PATH` is the most critical environment variable for executing commands.