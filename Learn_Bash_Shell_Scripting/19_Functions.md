# Functions in Bash

Functions should be declared at the beginning of your script.

## Function Syntax

```bash
function func_name() {
    local var1=value    # Local variable inside function
    # code
    # $1 ==> arg1
    # $2 ==> arg2
}
```

## Calling a Function:
```bash
# Call the function with arguments
func_name arg1 arg2
```
> Look: don't use `()` after the function name when calling it, just use the name itself.
## Example 1: Simple Greeting Function

```bash
greet() {
    local name=$1
    echo "Hello, $name!"
}

greet "Alice"
```

**Output:**
```
Hello, Alice!
```

---

## Example 2: Function with Multiple Arguments

```bash
add_numbers() {
    local sum=$(( $1 + $2 ))
    echo "Sum: $sum"
}

add_numbers 5 7
```

**Output:**
```
Sum: 12
```

---

## Example 3: Returning Values

```bash
get_length() {
    local str=$1
    echo ${#str}
}

length=$(get_length "BashScripting")
echo "Length: $length"
```

**Output:**
```
Length: 13
```

---

> **Tip:**  
> Use `local` to limit variable scope inside functions and `$1`, `$2`, etc., to access arguments.

