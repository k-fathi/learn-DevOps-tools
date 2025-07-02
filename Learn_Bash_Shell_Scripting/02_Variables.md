# **Variables in Bash**

## 1- Local Variables
### Syntax: `$ Var_Name=name`
- Written without any spaces.
- No special characters in variable names.
- Variable names are case-sensitive.
- Cannot start with a number (e.g., `1_script` is invalid).

#### Example:
- To set and view a specific variable, use:
```bash
Var_Name="Heisenberg"
echo $Var_Name  # Output: Heisenberg
```

- Local variables are accessible only in the current bash terminal.
- If a new terminal is opened, the variables will not exist.
- When running a script, the script opens a new shell, so `any local variables` defined outside the script `will not work`.

---

## 2-Environment Variables
- Variables that are predefined and created by the operating system.
- Examples:
    - `PATH`: Directories the shell searches for executable programs.
    - `HOME`: Current user's home directory.
    - `USER`: Current username.
    - `PWD`: Current working directory path.
    - `SHELL`: Current shell path.

### Commands to view environment variables:
```bash
env       # Lists all environment variables
printenv  # Lists all environment variables
set       # Displays all shell variables and functions
```

### Example:
```bash
echo $PATH   # Output: /usr/local/bin:/usr/bin:/bin
echo $HOME   # Output: /home/Heisenberg
```

---

## 3- Difference Between Global Variables and System-Wide Variables:

### Global Variables:
- Defined using the `export` command.
- Accessible in the current shell and any `child` shells/subshells.
- Exist only for the duration of the shell session or script execution.
- `Not persistent` across system reboots or new terminal sessions.

### Syntax: `$ export Var_Name=name`
- Global variables are accessible in the current shell and any `child` shells/subshells.

#### Commands:
- `$ export`: Prints all global variables.
- `$ unset Var_Name`: Deletes a global variable.

#### Example:
```bash
export Var_Name="GlobalValue"
echo $Var_Name  # Output: GlobalValue
bash            # Opens a subshell
echo $Var_Name  # Output: GlobalValue
unset Var_Name
```


### System-Wide Variables:
- Defined in system configuration files like `/etc/profile`, `/etc/bashrc`, or `/etc/environment`.
- `Available` to all users and `persist` across reboots.
- Automatically loaded when a new shell session starts.

#### Example:
1. Add the following line to `/etc/profile` (requires root privileges):
    ```bash
    export SYSTEM_VAR="System_Wide_Variable"
    ```
2. Reload the profile or restart the terminal:
    ```bash
    source /etc/profile
    # Note: The `source` command is used to execute commands from a file in the current shell.
    # It is equivalent to `.` (dot) command, but `.` opens a new shell and requires the file to be executable.
    
    ```
3. Verify the variable:
    ```bash
    echo $SYSTEM_VAR  # Output: System_Wide_Variable
    ```

---

## About `/etc/profile`
- A system-wide configuration file executed for login shells.
- Used to set environment variables and execute commands for all users.
- Variables defined here are available to all users and persist across sessions.

### Example:
1. Add the following to `/etc/profile`:
    ```bash
    export APP_HOME="/usr/local/myapp"
    ```
2. Reload the profile:
    ```bash
    source /etc/profile
    ```
3. Verify the variable:
    ```bash
    echo $APP_HOME  # Output: /usr/local/myapp
    ```

### Notes:
- Use `/etc/profile` for variables that should apply to all users.
- For user-specific variables, use `~/.bash_profile` or `~/.bashrc`.
- Avoid defining sensitive information (e.g., passwords) in `/etc/profile` as it is accessible to all users.
- Changes to `/etc/profile` require administrative privileges.
- For non-login shells, consider using `/etc/bashrc` instead.
- `To ensure changes take effect, users may need to log out and log back in.`

---


## 4- Predefined Variables
- Special variables defined by the shell, available for use during script execution.
 
### Examples:
- `$0`: Name of the current script.
- `$#`: Number of arguments passed to the script.
- `$*`: All arguments as a single string (e.g., `"$*"` expands to `"arg1 arg2 arg3"`).
- `$@`: All arguments as separate strings (e.g., `"$@"` expands to `"arg1"` `"arg2"` `"arg3"`).
- `$1-$9`: First 9 arguments to the script.
- `$!`: Process ID of the last background command.

#### Difference between `$*` and `$@`:
- When unquoted, both expand to all positional parameters separated by the first character of the IFS variable (usually a space).
- When quoted:
    - `"$*"` expands to a single string with all arguments separated by the first character of IFS.
    - `"$@"` expands to separate quoted strings for each argument, preserving spaces within arguments.


### Example:
```bash
#!/bin/bash
echo "Script Name: $0"
echo "Number of Arguments: $#"
echo "All Arguments: $*"
```

---

## Quotes & Bash Variables
- `" "`: Prints the string but evaluates variables.
    ```bash
    myname="Heisenberg"
    echo "My Name is $myname"  # Output: My Name is Heisenberg
    ```

- `' '`: Prints the string as-is, without evaluating variables.
    ```bash
    echo 'My Name is $myname'  # Output: My Name is $myname
    ```

- `\`: Escape sequence to ignore the next character.
    ```bash
    echo "My name is \$myname"  # Output: My name is $myname
    ```

---


## Difference Between `/etc/profile`, `.bashrc`, `/etc/bashrc`, and `/etc/environment`

### `/etc/profile`
- A system-wide configuration file executed for login shells.
- Used to set environment variables and execute commands for all users.
- Variables defined here are available to `all users` and `persist` across sessions.
- Changes require administrative privileges and may need users to `log out and log back in` to take effect.
- 
### `.bashrc`
- A user-specific configuration file executed for non-login interactive shells.
- Used to set aliases, functions, and shell-specific configurations for a single user.
- Located in the user's home directory (`~/.bashrc`).
- Changes take effect immediately after running `source ~/.bashrc`.
- `.bashrc` changes are `not persistent` across login shells unless explicitly sourced.
### `/etc/bashrc`
- A system-wide configuration file executed for non-login interactive shells.
- Used to define functions, aliases, and shell settings for all users.
- Variables defined here are available to all users but only in non-login shells.
- `/etc/bashrc` changes are `persistent` for all users in non-login shells.

### `/etc/environment`
- A system-wide configuration file used to set environment variables.
- Variables defined here are available to all users and persist across sessions.
- Unlike `/etc/profile`, it is not a script and does not support shell commands.
- Changes require a system reboot or re-login to take effect.
- `/etc/environment` changes are `persistent` across all sessions and reboots.

### Summary Table:

| File              | Scope       | Shell Type       | Purpose                                   |
|-------------------|-------------|------------------|-------------------------------------------|
| `/etc/profile`    | System-wide | Login shells     | Set environment variables for all users. |
| `.bashrc`         | User-specific | Non-login shells | Configure aliases and functions for a specific user. |
| `/etc/bashrc`     | System-wide | Non-login shells | Define settings for all users.           |
| `/etc/environment`| System-wide | All shells       | Set environment variables persistently.  |
