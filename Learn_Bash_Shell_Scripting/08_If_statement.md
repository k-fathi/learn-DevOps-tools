# Using `if` Statements to Control Script Flow

Bash `if` statements allow you to execute code conditionally based on the evaluation of expressions.

**General Syntax:**
```bash
if [ condition1 ]; then
   # code to execute if condition1 is true
elif [ condition2 ]; then
   # code to execute if condition2 is true
else
   # code to execute if none of the above conditions are true
fi
```

**Alternative Formatting:**
```bash
if [ condition1 ]
then
   # code
elif [ condition2 ]
then
   # code
else
   # code
fi
```

Use either style based on your preference or script readability.

---

## Examples of `if` Statements

**Example 1: Check if a file exists**
```bash
if [ -f "myfile.txt" ]; then
    echo "File exists."
else
    echo "File does not exist."
fi
```

**Example 2: Using `elif` for multiple conditions**
```bash
read -p "Enter a number: " num
if [ "$num" -gt 0 ]; then
    echo "Positive number"
elif [ "$num" -lt 0 ]; then
    echo "Negative number"
else
    echo "Zero"
fi
```

## Using the `command` Built-in

The `command` built-in in Bash is used to run a command, bypassing any shell functions or built-ins with the same name. This ensures that the external command is executed.

**Syntax:**
```bash
command [options] command_name [arguments]
```

**Example:**
```bash
command ls -l
```
This runs the external `ls` command directly, even if a shell function named `ls` exists.

**Common Options:**
- `-v`: Display the location or description of the command.
- `-V`: Display detailed information about the command.
- `-p`: Use a default value for `$PATH` to find the command.


**Example 2: Check if a command exists**
```bash
if command -v git 1&2> /dev/null; then
    echo "Git is installed."
else
    echo "Git is not installed."
fi
# the use of `1&2> /dev/null` suppresses output, making the check silent.
# This is useful for scripts where you only want to know if the command exists without printing anything.
```
**Example 3: Check if a command exists without silencing output**
```bash
if command -v git; then
    echo "Git is installed."
else
    echo "Git is not installed."
fi
# output:
   # /usr/bin/git
   # Git is installed.
```
---
