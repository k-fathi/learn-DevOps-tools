# Command Substitution

Command substitution allows you to capture the output of a command and use it as part of another command or store it in a variable for future use.

### Syntax
- Using `$()` (preferred):
      ```bash
      file=$(date)
      ```
- Using backticks (legacy):
      ```bash
      file=`date`
      ```

### Example
If the `date` command is executed, the variable `file` will store the output:
```bash
file=$(date)
echo $file
# Output: Thu Mar  6 16:55:08 EET 2025

name=`whoami`
echo $name
# Output: Heisenberg 
```

### Notes
- The `$()` syntax is recommended over backticks because it is more readable and supports nesting.
- Always ensure proper syntax to avoid errors.
- Command substitution is a powerful feature in shell scripting for dynamic data handling.