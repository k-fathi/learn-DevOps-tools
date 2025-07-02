# Wildcards in Linux

Wildcards are special characters used in Linux to represent patterns in filenames or text. They are commonly used with commands like `ls`, `cp`, `mv`, and `rm`.

## Common Wildcards

### 1. `*` (Asterisk)
- Matches zero or more characters.
- Example:
    ```bash
    ls *.txt
    ```
    Lists all files with a `.txt` extension.

### 2. `?` (Question Mark)
- Matches exactly one character.
- Example:
    ```bash
    ls file?.txt
    ```
    Lists files like `file1.txt`, `file2.txt`, but not `file10.txt`.

### 3. `[]` (Square Brackets)
- Matches any one character inside the brackets.
- Example:
    ```bash
    ls file[1-3].txt
    ```
    Lists files like `file1.txt`, `file2.txt`, and `file3.txt`.

### 4. `[^]` (Negated Set)
- Matches any one character not inside the brackets.
- Example:
    ```bash
    ls file[^1-3].txt
    ```
    Lists files like `file4.txt`, but not `file1.txt`, `file2.txt`, or `file3.txt`.

### 5. `{ }` (Curly Braces)
- Used to specify a set of comma-separated options.
- Example:
    ```bash
    ls file{1,2,3}.txt
    ```
    Lists files like `file1.txt`, `file2.txt`, and `file3.txt`.

- Can also define ranges:
    ```bash
    touch file{1..5}.txt
    ```
    Creates files `file1.txt`, `file2.txt`, `file3.txt`, `file4.txt`, and `file5.txt`.

- Supports nested patterns:
    ```bash
    echo {a,b}{1,2}
    ```
    Outputs: `a1 a2 b1 b2`.

## Combining Wildcards
Wildcards can be combined to create complex patterns.
Example:
```bash
ls *[a-c]?.txt
```
Lists files that:
- Start with any characters.
- Contain `a`, `b`, or `c` as the second-to-last character.
- End with `.txt`.

## Escaping Wildcards
To use a wildcard as a literal character, escape it with a backslash (`\`).
Example:
```bash
ls file\*.txt
```
Lists files named `file*.txt`.

## Practical Examples
1. Delete all `.log` files:
     ```bash
     rm *.log
     ```
2. Copy all `.jpg` files to a backup directory:
     ```bash
     cp *.jpg /backup/
     ```
3. Find files starting with `test` and ending with `.sh`:
     ```bash
     ls test*.sh
     ```

## Additional Notes
- Wildcards are interpreted by the shell, not the commands themselves. Ensure your shell supports the wildcard syntax you are using.
- Be cautious when using wildcards with destructive commands like `rm` to avoid accidental data loss.


# 👉 Wildcards are powerful tools for managing files efficiently in Linux.