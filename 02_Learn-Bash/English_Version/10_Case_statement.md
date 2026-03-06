# Case Statement — Clean Pattern Matching

The `case` statement is Bash's answer to long chains of `if/elif`. When you need to compare **one variable** against multiple possible values, `case` is cleaner, faster, and more readable.

---

## The Syntax

```bash
case $variable in
    pattern1)
        # ← Code to run if $variable matches pattern1
        ;;          # ← REQUIRED. Double semicolons mark the end of this block.
    pattern2 | pattern3)
        # ← Code to run if $variable matches pattern2 OR pattern3
        ;;
    *)
        # ← Default: runs if NONE of the above patterns matched
        # ← Think of * as the "else" branch
        ;;
esac                # ← "esac" closes the case block (it's "case" backwards)
```

> **Key rules to remember:**
> - Each pattern block MUST end with `;;`
> - Use `|` to combine multiple patterns (logical OR)
> - `*` is the wildcard catch-all (default case)
> - `esac` closes the block (just like `fi` closes `if`)

---

## Practical Examples

### Example 1: Simple Menu
```bash
#!/bin/bash
read -p "Choose a fruit (apple/banana/orange): " fruit

case $fruit in
    apple)
        echo "🍎 You chose apple — $0.99/kg"
        ;;
    banana)
        echo "🍌 You chose banana — $0.49/kg"
        ;;
    orange)
        echo "🍊 You chose orange — $1.29/kg"
        ;;
    *)
        echo "❌ Unknown fruit: '$fruit'. Please choose apple, banana, or orange."
        ;;
esac
```

### Example 2: Pattern Matching with OR
```bash
#!/bin/bash
read -p "Enter a number (1-10): " num

case $num in
    1|3|5|7|9)
        echo "$num is an ODD number"
        ;;
    2|4|6|8|10)
        echo "$num is an EVEN number"
        ;;
    *)
        echo "Out of range. Please enter 1-10."
        ;;
esac
```

### Example 3: Character Ranges
```bash
#!/bin/bash
read -p "Enter your grade (A-F): " grade

case $grade in
    [A-B])
        echo "Excellent! You passed with distinction."
        ;;
    [C-D])
        echo "Good. You passed."
        ;;
    F)
        echo "Sorry, you failed."
        ;;
    *)
        echo "Invalid grade. Please enter A through F."
        ;;
esac
```

### Example 4: Handling script arguments (very common pattern)
```bash
#!/bin/bash
# ← Usage: ./deploy.sh start|stop|restart|status

case $1 in
    start)
        echo "Starting the service..."
        ;;
    stop)
        echo "Stopping the service..."
        ;;
    restart)
        echo "Restarting..."
        $0 stop     # ← Call itself with "stop"
        $0 start    # ← Then call itself with "start"
        ;;
    status)
        echo "Service is running."
        ;;
    *)
        echo "Usage: $0 {start|stop|restart|status}"
        exit 1
        ;;
esac
```

---

## When to Use `case` vs `if`

| Situation | Use |
|-----------|-----|
| Comparing ONE variable against many fixed values | `case` ✅ |
| Building a menu or processing script arguments | `case` ✅ |
| Complex conditions with arithmetic or multiple variables | `if` ✅ |
| File/directory existence checks | `if` ✅ |
| Combining conditions with AND/OR logic | `if` ✅ |

![Case Statement Structure](../images/en/10_en_img1.png)

![Case vs If Decision Guide](../images/en/10_en_img2.png)
