# Bash Scripting: Until Loop

`until` loop is the opposite of while loop.
# Basic Syntax

```bash
until [ condition ]   
do  
  # code  
done
# as long as the condition is false, the code block will execute
# once the condition becomes true, the loop will exit
```

## Example 1: Simple Counter

```bash
count=1
until [ $count -gt 5 ]
do
    echo "Count is $count"
    ((count++))
done
```

**Output:**
```
Count is 1
Count is 2
Count is 3
Count is 4
Count is 5
```

## Example 2: Waiting for a File

```bash
until [ -f /tmp/ready.txt ]
do
    echo "Waiting for /tmp/ready.txt to exist..."
    sleep 2
done
echo "File found!"
```