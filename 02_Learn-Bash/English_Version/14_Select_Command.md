# Select Command — Interactive Menus Made Easy

The `select` command builds a **numbered menu** from a list of options and waits for the user to pick one. It handles the numbering, display, and input loop automatically — saving you from writing tedious `echo` + `read` + validation code.

---

## Syntax

```bash
select variable in option1 option2 option3
do
    # ← $variable contains the SELECTED option's text
    # ← $REPLY contains the NUMBER the user typed
    # ← The loop keeps asking until you 'break' out
done
```

---

## Example 1: Simple Fruit Menu

```bash
#!/bin/bash
select fruit in Apple Banana Orange Quit
do
    case $fruit in
        Apple|Banana|Orange)
            echo "You selected: $fruit"
            ;;
        Quit)
            echo "Goodbye!"
            break           # ← Without break, the menu loops forever
            ;;
        *)
            echo "Invalid option. Try again."
            ;;
    esac
done
```

**What the user sees:**
```
1) Apple
2) Banana
3) Orange
4) Quit
#? 2                    ← User types the number
You selected: Banana
#? 4
Goodbye!
```

> **Key insight:** `select` automatically prints the numbered list and shows the `#?` prompt. This all happens for free — you don't need to write it.

---

## Example 2: Dynamic Menu from an Array

```bash
#!/bin/bash
options=("Start Server" "Stop Server" "View Logs" "Exit")

PS3="Choose an action: "   # ← PS3 customizes the select prompt (instead of #?)

select action in "${options[@]}"
do
    case $REPLY in          # ← $REPLY is the raw NUMBER, $action is the TEXT
        1) echo "Starting server..." ;;
        2) echo "Stopping server..." ;;
        3) echo "Showing last 20 log lines..."
           tail -20 /var/log/syslog 2>/dev/null || echo "No log access" ;;
        4) echo "Exiting."; break ;;
        *) echo "Invalid option: $REPLY" ;;
    esac
done
```

> **Pro tip:** `select` and `case` are natural partners. `select` handles the display and input, `case` handles the logic.

![Select Command Menu Flow](../images/en/14_en_img1.png)

![Select + Case Pattern](../images/en/14_en_img2.png)