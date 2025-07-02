# 1. Comparison Operators for Numerical Values (Evaluates to True or False):

### In Bash scripting, comparison operators are used to compare numerical values. Below are the operators and their usage:

| Operator | Description               | Example                  | Output |
|----------|---------------------------|--------------------------|--------|
| `-eq`    | Equal to                  | `[ "$a" -eq "$b" ]`      | True if `$a` is equal to `$b` |
| `-ne`    | Not equal to              | `[ "$a" -ne "$b" ]`      | True if `$a` is not equal to `$b` |
| `-gt`    | Greater than              | `[ "$a" -gt "$b" ]`      | True if `$a` is greater than `$b` |
| `-lt`    | Less than                 | `[ "$a" -lt "$b" ]`      | True if `$a` is less than `$b` |
| `-ge`    | Greater than or equal to  | `[ "$a" -ge "$b" ]`      | True if `$a` is greater than or equal to `$b` |
| `-le`    | Less than or equal to     | `[ "$a" -le "$b" ]`      | True if `$a` is less than or equal to `$b` |

### Example:
```bash
a=5
b=10

if [ "$a" -lt "$b" ]; then
   echo "$a is less than $b"
fi
```
**Output:**
```
5 is less than 10
```

---

# 2. Comparison Operators for String Values (Evaluates to True or False):

String comparison operators are used to compare string values. Below are the operators and their usage:

| Operator | Description               | Example                  | Output |
|----------|---------------------------|--------------------------|--------|
| `=` or `==` | Equal to               | `[ "$a" = "$b" ]`        | True if `$a` is equal to `$b` |
| `!=`    | Not equal to               | `[ "$a" != "$b" ]`       | True if `$a` is not equal to `$b` |
| `>`     | Greater than (lexicographically) | `[ "$a" \> "$b" ]` | True if `$a` is greater than `$b` |
| `<`     | Less than (lexicographically) | `[ "$a" \< "$b" ]` | True if `$a` is less than `$b` |


> **Note:** When using `<` or `>` inside `[ ]`, escape them as `\<` and `\>` to avoid shell redirection.

### Example:
```bash
a="apple"
b="banana"

if [ "$a" \< "$b" ]; then
   echo "$a comes before $b lexicographically"
fi
```
**Output:**
```
apple comes before banana lexicographically
```

---

# 3. Logical Operators (Evaluate to True or False):

Logical operators are used to combine multiple conditions.

| Operator | Description | Example                          | Output |
|----------|-------------|----------------------------------|--------|
| `&&`     | Logical AND | `[ "$a" -lt "$b" ] && [ "$b" -lt "$c" ]` | True if both conditions are true |
| `\|\|`   | Logical OR  | `[ "$a" -lt "$b" ] || [ "$b" -lt "$c" ]` | True if at least one condition is true |
| `!`      | Logical NOT | `! [ "$a" -eq "$b" ]`           | True if the condition is false |

### Example:
```bash
a=5
b=10
c=15

if [ "$a" -lt "$b" ] && [ "$b" -lt "$c" ]; then
   echo "Both conditions are true"
fi
```
**Output:**
```
Both conditions are true
```

---

# 4. File Operators (Evaluate to True or False):

File operators are used to test properties of files and directories.

| Operator | Description                        | Example                | Output                                                      |
|----------|------------------------------------|------------------------|-------------------------------------------------------------|
| `-f`     | Regular file                       | `[ -f "$file" ]`       | True if `$file` is a regular file and exists                |
| `-e`     | File exists                        | `[ -e "$file" ]`       | True if `$file` exists, regardless of type                  |
| `-d`     | Directory                          | `[ -d "$dir" ]`        | True if `$dir` is a directory                               |
| `-r`     | Readable                           | `[ -r "$file" ]`       | True if `$file` is readable                                 |
| `-w`     | Writable                           | `[ -w "$file" ]`       | True if `$file` is writable                                 |
| `-x`     | Executable                         | `[ -x "$file" ]`       | True if `$file` is executable                               |
| `-s`     | Non-empty file                     | `[ -s "$file" ]`       | True if `$file` exists and has a size greater than zero     |
| `-z`     | Empty string                       | `[ -z "$file" ]`       | True if `$file` is an empty string                          |
| `-L`     | Symbolic link                      | `[ -L "$file" ]`       | True if `$file` is a symbolic link                          |
| `-h`     | Symbolic link (same as `-L`)       | `[ -h "$file" ]`       | True if `$file` is a symbolic link                          |
| `-b`     | Block device                       | `[ -b "$file" ]`       | True if `$file` is a block device                           |
| `-c`     | Character device                   | `[ -c "$file" ]`       | True if `$file` is a character device                       |
| `-p`     | Named pipe (FIFO)                  | `[ -p "$file" ]`       | True if `$file` is a named pipe (FIFO)                      |
| `-S`     | Socket                             | `[ -S "$file" ]`       | True if `$file` is a socket                                 |
| `-u`     | Set-user-ID bit set                | `[ -u "$file" ]`       | True if `$file` has its set-user-ID bit set                 |
| `-g`     | Set-group-ID bit set               | `[ -g "$file" ]`       | True if `$file` has its set-group-ID bit set                |

### Example:
```bash
file="/tmp/example.txt"

if [ -e "$file" ]; then
   echo "$file exists"
else
   echo "$file does not exist"
fi
```
**Output:**
```
/tmp/example.txt exists
```

---

# Notes

- The difference between `(( ))` and `[ ]` in Bash lies in their purpose and usage:
  1. **`[ ]` (Test Command):**
     - Used for conditional expressions.
     - Supports string, file, and numerical comparisons.
     - Requires spaces around operators.
     - Example:
       ```bash
       [ "$a" -eq "$b" ]   # Numerical comparison
       [ "$a" = "$b" ]     # String comparison
       ```
  2. **`(( ))` (Arithmetic Evaluation):**
     - Specifically for arithmetic operations, incrementing/decrementing, and comparisons.
     - Does not require `$` for variables inside.
     - Example:
       ```bash
       (( a == b ))        # Numerical comparison
       (( a + b > 10 ))    # Arithmetic operation
       ```
     - **Key Difference:** `[ ]` is more general-purpose, while `(( ))` is optimized for arithmetic.

- When using `[ ]`, **spaces are required:** Always include spaces around the brackets, e.g., `[ "$a" -eq "$b" ]`.
- **Double brackets `[[ ]]`:** These provide additional features and are preferred for advanced conditions.

# Best Practices:

### 👉 (( )) use it `numbers handling`, arithmetic operations, and comparisons, does not require $ or " " for variables.

### 👉 [ ] is the old-style conditional command, requires $ and " " for variables, used for `string` comparisons and `file tests`.

### 👉 [[ ]] is the advanced conditional expression, recommended for `string` comparisons and `file tests`, recommends $ and " " for variables, allows more complex expressions.


### Examples

#### (( )) Arithmetic Command
```bash
a=5
b=10
if (( a < b )); then
   echo "a is less than b"
fi
```
#### [ ] Old-style Conditional Command
```bash
a="apple"
b="banana"
if [ "$a" = "$b" ]; then
   echo "Strings are equal"
fi
```

#### [[ ]] Advanced Conditional Expression
```bash
a="apple"
b="banana"
if [[ "$a" < "$b" ]]; then
   echo "$a comes before $b"
fi
```
