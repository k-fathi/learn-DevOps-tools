# Select Command: Creating Interactive Menus

The `select` command in Bash is used to create interactive menus.  
Users can choose an option by typing its corresponding number.  
The selected value is stored in a variable, and the loop continues until explicitly broken.

```bash
select var in [LIST]
do
    # commands using $var
done
```

## Example 1: Simple Menu

```bash
select fruit in Apple Banana Orange Quit
do
    case $fruit in
        Apple|Banana|Orange)
            echo "You selected $fruit"
            ;;
        Quit)
            echo "Exiting..."
            break
            ;;
        *)
            echo "Invalid option"
            ;;
    esac
done
```

**Sample Output:**
```
1) Apple
2) Banana
3) Orange
4) Quit
#? 2
You selected Banana
#? 4
Exiting...
```

## Example 2: Menu with Numbers

```bash
select num in 10 20 30 Exit
do
    if [[ $num == "Exit" ]]; then
        echo "Goodbye!"
        break
    elif [[ -n $num ]]; then
        echo "You picked $num"
    else
        echo "Invalid choice"
    fi
done
```

**Sample Output:**
```
1) 10
2) 20
3) 30
4) Exit
#? 1
You picked 10
#? 4
Goodbye!
```