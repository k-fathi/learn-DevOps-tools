# Bash Scripting: The `source` Command

Using the `source` Command to Include One Script in Another.
The `source` command (or `.`) allows you to run a script in the current shell, making its functions and variables available. This is useful for sharing functions, variables, or configuration between scripts.

---

## Example Structure

Suppose you have two scripts:

### `src1.sh`

```bash
#!/bin/bash
f1() {
    echo "Hello from f1 in src1.sh"
}

MY_VAR="This is a variable from src1.sh"
```

### `src2.sh`

```bash
#!/bin/bash
source ./src1.sh

f1  # Call f1 here
echo "$MY_VAR"
```

---

## Example Usage and Output

Make both scripts executable:

```bash
chmod +x src1.sh src2.sh
```

Run `src2.sh`:

```bash
./src2.sh
```

**Output:**
```
Hello from f1 in src1.sh
This is a variable from src1.sh
```

---

## Key Points

- `source ./src1.sh` (or `. ./src1.sh`) runs `src1.sh` in the current shell, so all functions and variables become available.
- If you used `bash ./src1.sh` instead, the functions and variables would not be available in `src2.sh`'s shell.

---

## Alternative Syntax

You can use the dot (`.`) as a shorthand for `source`:

```bash
. ./src1.sh
```

Both commands behave the same way.

---

## When to Use

- Sharing utility functions across multiple scripts.
- Loading environment variables or configuration settings.
- Modularizing your shell scripts for better organization.
