# While loop : loop as long as the condition is true

## Syntax

```bash
while [ condition ]
do
    # commands
    ((var--))  # example command
done
```

- To create an infinite loop, use `while :` or `while true`:

```bash
while :
do
    # commands
done
```

## Examples

### Example 1: Countdown from 5 to 1

```bash
count=5
while [ $count -gt 0 ]
do
    echo "Countdown: $count"
    ((count--))
done
echo "Liftoff!"
```

**Output:**
```
Countdown: 5
Countdown: 4
Countdown: 3
Countdown: 2
Countdown: 1
Liftoff!
```

### Example 2: Infinite loop (press Ctrl+C to stop)

```bash
while true
do
    echo "This will run forever"
    sleep 1
done
```

**Output:**
```
This will run forever
This will run forever
This will run forever
...
```
