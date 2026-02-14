# 11: Shell Files and Scripts

## 1. Introduction
When you login or open a terminal, specific configuration files are executed to set up your shell environment (variables, aliases, functions).

## 2. Shell Configuration Files

### A. System-Wide Configurations (Admin)
Applied to all users on the system.
-   `/etc/profile`: Environment variables and startup programs.
-   `/etc/bashrc`: Functions and aliases.
-   `/etc/profile.d/`: Modular configuration scripts.

### B. User-Specific Configurations
Applied only to the specific user.
-   `~/.bash_profile` or `~/.profile`: Login shell configuration.
-   `~/.bashrc`: Non-login shell configuration (aliases, local functions).
-   `~/.bash_logout`: Executed when logging out.

## 3. Login vs. Non-Login Shells

### Login Shell
Triggered when you log in manually (e.g., SSH, GUI Login).
-   **Order:** `/etc/profile` → `~/.bash_profile` → `~/.bashrc` → `/etc/bashrc`.

### Non-Login Shell
Triggered when you open a new terminal window or run a script.
-   **Order:** `~/.bashrc` → `/etc/bashrc`.

### Initialization Flow Diagram
```
┌─────────────────────────────────────────────────────────────┐
│                    User Action                              │
└──────────────────────┬──────────────────────────────────────┘
                       │
        ┌──────────────┴──────────────┐
        │                             │
        ▼                             ▼
   LOGIN SHELL               NON-LOGIN SHELL
   (SSH/Console)             (bash command)
        │                             │
        ├─► /etc/profile             ├─► /etc/bash.bashrc
        │                             │
        ├─► ~/.bash_profile           └─► ~/.bashrc
        │   (sources ~/.bashrc)
        │
        └─► ~/.bashrc
            ├─► Functions
            ├─► Aliases
            └─► Environment variables
```

## 4. Changing Your Shell
Users can change their default shell using `chsh`.

```bash
# Change to Bash
chsh -s /bin/bash

# Change to Zsh
chsh -s /bin/zsh
```
*Note: Changes take effect after logout.*

## 5. Key Takeaways
-   **`~/.bashrc`**: Best place for user aliases and custom prompts.
-   **`/etc/profile`**: Best for system-wide environment variables.
-   **Login Shells** read full profile configurations; **Non-Login Shells** mostly read `.bashrc`.