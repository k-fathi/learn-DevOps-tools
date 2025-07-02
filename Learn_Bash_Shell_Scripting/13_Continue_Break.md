# Continue and Break used to control the flow of the Script 
	- Used within loops
	 
## Continue:
- Used in loops to skip the current iteration and go back again to the beginning of the loop statement

```bash
for i in {1..5}
do
	 if [ $i -eq 3 ] 
	 then 
		  continue
	 fi
	 echo "Number: $i"
done
```
**Output:**
```
Number: 1
Number: 2
Number: 4
Number: 5
```

### Example: Skipping Even Numbers

```bash
for i in {1..6}
do
	 if [ $((i % 2)) -eq 0 ]
	 then
		  continue
	 fi
	 echo "Odd Number: $i"
done
```
**Output:**
```
Odd Number: 1
Odd Number: 3
Odd Number: 5
```

## Break:
- Used to break the loop

```bash
for i in {1..5}
do
	 if [ $i -eq 3 ] 
	 then 
		  break
	 fi
	 echo "Number: $i"
done
```
**Output:**
```
Number: 1
Number: 2
```

### Example: Stop on First Negative Number

```bash
numbers="4 7 -2 8 3"
for n in $numbers
do
	 if [ $n -lt 0 ]
	 then
		  echo "Negative number found: $n"
		  break
	 fi
	 echo "Number: $n"
done
```
**Output:**
```
Number: 4
Number: 7
Negative number found: -2
```
