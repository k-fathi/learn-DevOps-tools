# 07: Pipelining in Linux

## 1. Introduction
Pipelining (`|`) is a powerful feature that connects the **Standard Output (stdout)** of one command to the **Standard Input (stdin)** of another command. It allows you to chain commands together to perform complex tasks.

## 2. Syntax
```bash
command1 | command2 | command3
```
*Data flows from left to right.*

### Visual Workflow
> ![Linux Pipes Workflow](screens/infographic_pipes.png)

## 3. Common Examples
```bash
# Filter output: List files and grep for a pattern
ls -la | grep "conf"

# Count lines: Count the number of files in a directory
ls | wc -l

# Sort output: View running processes sorted by memory
ps aux | sort -nk 4
```

## 4. The `xargs` Command
Some commands (like `rm`, `kill`, `mkdir`) do **not** accept input from standard input (stdin); they expect arguments. Use `xargs` to convert stdin into arguments.

### Comparing Standard Pipe vs. `xargs`
| Scenario | Command | Result |
| :--- | :--- | :--- |
| **Accepts stdin** | `cat file | grep "text"` | Works (grep reads content) |
| **Expects args** | `echo file | rm` | Fails (rm doesn't read filenames from stdin) |
| **Using xargs** | `echo file | xargs rm` | Works (xargs passes "file" as an argument to rm) |

### Common `xargs` Use Cases
```bash
# Delete all .log files found by find
find . -name "*.log" | xargs rm

# Create directories listed in a file
cat folders.txt | xargs mkdir
```

## 5. Key Takeaways
-   **Piping (`|`)** connects output to input.
-   **Redirection (`>`)** connects output to a file.
-   Use **`xargs`** when the receiving command expects arguments, not an input stream.