# `shift` Command in Bash

The `shift` command is used in shell scripts to shift the positional parameters to the left, effectively discarding the first argument and reassigning new IDs to the remaining arguments.

## How It Works

Before using `shift`:
```
args: arg1 arg2 arg3 arg4 arg5
IDs :  $1   $2   $3   $4   $5
```

After `shift`:
```
args: arg2 arg3 arg4 arg5
IDs :  $1   $2   $3   $4
```

You can also shift by `n` positions using `shift n`.

## Usage

```bash
shift [n]
```
- If `n` is not specified, it defaults to 1.
- `shift` removes the first `n` positional parameters (`$1`, `$2`, ..., `$n`), and the remaining parameters are renumbered (`$1` becomes the next argument, and so on).
- Useful in scripts that process arguments in a loop, allowing you to handle each argument and then remove it from the list.
- If you try to shift more positions than there are arguments, the positional parameters are unset.

## Example 1: Basic Shift

```bash
#!/bin/bash
echo "Before shift: $1 $2 $3"
shift
echo "After shift: $1 $2 $3"
```

**Run:**
```bash
./script.sh apple banana cherry
```

**Output:**
```
Before shift: apple banana cherry
After shift: banana cherry
```

## Example 2: Shift by 2

```bash
#!/bin/bash
echo "Before shift: $1 $2 $3 $4"
shift 2
echo "After shift: $1 $2"
```

**Run:**
```bash
./script.sh one two three four
```

**Output:**
```
Before shift: one two three four
After shift: three four
```

## When to Use

- When processing command-line arguments in a loop.
- To discard already-processed arguments and focus on the remaining ones.
