# `case` Statement

The `case` statement in Bash allows you to execute different blocks of code based on pattern matching.

```bash
case $var1 in
    pattern1 | pattern2 | pattern3 )
        # code for pattern1, pattern2, or pattern3
        ;;
    pattern4)
        # code for pattern2
        ;;
    pattern5)
        # code for pattern3
        ;;
    *)
        # default code (if no pattern matches)
        ;;
esac
```

- Use `|` to separate multiple patterns (acts as logical OR).
- `[x-y]` matches any single character from `x` to `y`.
    - Example: `7[5-9]` matches `75`, `76`, `77`, `78`, or `79`.
- Last pattern does not need a `;;` at the end, but it's good practice to include it for consistency.
## Examples

### Example 1: Simple Menu

```bash
echo "Enter a fruit (apple, banana, orange):"
read fruit

case $fruit in
    apple)
        echo "You chose apple."
        ;;
    banana)
        echo "You chose banana."
        ;;
    orange)
        echo "You chose orange."
        ;;
    *)
        echo "Unknown fruit."
        ;;
esac
```

### Example 2: Matching Multiple Patterns

```bash
echo "Enter a number between 1 and 10:"
read num

case $num in
    1|3|5|7|9)
        echo "You entered an odd number."
        ;;
    2|4|6|8|10)
        echo "You entered an even number."
        ;;
    *)
        echo "Number is out of range."
        ;;
esac
```

### Example 3: Using Character Ranges

```bash
echo "Enter a grade (A-F):"
read grade

case $grade in
    [A-C])
        echo "Excellent!"
        ;;
    [D-E])
        echo "Good."
        ;;
    F)
        echo "Needs improvement."
        ;;
    *)
        echo "Invalid grade."
        ;;
esac
```

## Difference Between `case` and `if` Statements

- The `case` statement is ideal for matching a single variable or value against multiple patterns, making it concise and readable for menu selections or pattern-based branching.
- The `if` statement is more flexible, allowing for complex logical conditions, arithmetic comparisons, and combining multiple variables or expressions.
- Use `case` when you have many possible discrete values or patterns to check; use `if` for more general-purpose conditionals.
