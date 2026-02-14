# 06: Redirection in Linux

## 1. Introduction
Redirection allows you to control where the output of a command goes (standard output) and where it gets input from (standard input).

## 2. File Descriptors
Linux assigns a number to each data stream:
-   **0**: Standard Input (`stdin`) - Keyboard input.
-   **1**: Standard Output (`stdout`) - Screen output.
-   **2**: Standard Error (`stderr`) - Error messages.

### Visual Guide
> ![I/O Redirection Overview](screens/infographic_redirection.png)

## 3. Redirection Operators

### A. Overwriting (`>`)
Replaces the file content with the new output.
-   `1>` or `>`: Redirect stdout.
-   `2>`: Redirect stderr.
-   `&>`: Redirect both stdout and stderr.

```bash
ls > file_list.txt      # Saves output to file (overwrites)
ls non_existent 2> error.log # Saves error to file
```

### B. Appending (`>>`)
Adds the new output to the end of the file without deleting existing content.
-   `1>>` or `>>`: Append stdout.
-   `2>>`: Append stderr.
-   `&>>`: Append both stdout and stderr.

```bash
echo "New Entry" >> debug.log
```

## 4. Examples
```bash
# Redirecting stdout and stderr to different files
ls /home /nothing 1> output.txt 2> error.txt

# Redirecting everything to the same file
ls /home /nothing &> all_logs.txt

# Discarding output (sending to the black hole)
command > /dev/null 2>&1
```

## 5. Key Takeaways
-   `>` overwrites, `>>` appends.
-   `2>` handles error messages separately.
-   `/dev/null` is used to silence output.
