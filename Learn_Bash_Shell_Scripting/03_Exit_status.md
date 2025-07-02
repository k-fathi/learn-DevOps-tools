# **Understanding Exit command and Exit Status in Bash**

In Bash scripting, the **exit status** of a command indicates whether it was executed successfully or if an error occurred.

- **Successful execution**: Exit status = `0`
- **Failure**: Exit status ≠ `0`

---

## How to Check the Exit Status

You can check the exit status of the **last executed command** using the special variable `$?`. For example:

```bash
$ echo $?
```

This will print the exit status of the most recently executed command.

---

## Common Exit Status Codes

Here are some commonly encountered exit statuses in Bash:

| Exit Code | Meaning                                      |
|-----------|----------------------------------------------|
| `0`       | The command or script executed successfully. |
| `1`       | General error or unspecified failure.        |
| `2`       | Incorrect usage or invalid argument.         |
| `126`     | Command invoked but cannot execute.          |
| `127`     | Command not found.                           |
| `130`     | Script terminated by Ctrl+C (SIGINT).        |
| `255`     | Exit status out of range or custom exit code.|

---

## Why Exit Status Matters

Exit statuses are essential for:

1. **Debugging**: Quickly identifying issues in your scripts or commands.
2. **Scripting Logic**: Writing conditional statements based on success or failure.

For example, you can use exit statuses in an `if` statement:

```bash
if command; then
    echo "Command succeeded."
else
    echo "Command failed with exit status $?."
fi
```

> **Note:** Always handle exit statuses carefully, especially in production scripts, to ensure robust error handling and debugging.


--- 

## The `exit` Command

The `exit` command is used to terminate a script or shell session. It can also return an exit status, which is a numeric value that indicates the success or failure of the script or command.

### Syntax
```bash
exit [n]
```
- `n` is an optional numeric argument. If omitted, the exit status of the last executed command is used.

### Common Use Cases
1. **Exiting a Script**:
    ```bash
    #!/bin/bash
    echo "This is a script."
    exit 0
    ```
    The script exits with a status of `0`, indicating success.

2. **Error Handling**:
    ```bash
    if [ ! -f "/path/to/file" ]; then
         echo "File not found!"
         exit 1
    fi
    ```
    The script exits with a status of `1`, indicating an error.


### Example
```bash
#!/bin/bash
echo "Starting script..."
if [ "$1" -eq "0" ]; then
     echo "Exiting with success."
     exit 0
else
     echo "Exiting with failure."
     exit 1
fi
echo "This line will not be executed."
# A bsolute Exit Status, not just break the if statement, but also exit the script.
```