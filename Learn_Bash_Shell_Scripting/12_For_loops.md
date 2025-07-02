# For Loops

## Syntax:
```bash
for var in item1 item2 item3 ... itemN
do
   # code
done
```

**Example:**
```bash
for color in red green blue
do
   echo "Color: $color"
done
```

Output:
```
Color: red
Color: green
Color: blue
```

---

## For with arrays:

- `for i in ${#arr[@]}`  
  Iterates once with the number of elements (length of array).

  **Example:**
  ```bash
  arr=(apple banana cherry)
  for i in ${#arr[@]}
  do
     echo "Length: $i"
  done
  ```
  Output:
  ```
  Length: 3
  ```

- `for i in ${!arr[@]}`  
  Iterates over the indices of the array.

  **Example:**
  ```bash
  arr=(apple banana cherry)
  for i in ${!arr[@]}
  do
     echo "Index: $i, Value: ${arr[$i]}"
  done
  ```
  Output:
  ```
  Index: 0, Value: apple
  Index: 1, Value: banana
  Index: 2, Value: cherry
  ```

- `for i in ${arr[@]}`  
  Iterates over the values of the array.

  **Example:**
  ```bash
  arr=(apple banana cherry)
  for fruit in "${arr[@]}"
  do
     echo "Fruit: $fruit"
  done
  ```
  Output:
  ```
  Fruit: apple
  Fruit: banana
  Fruit: cherry
  ```

- With or without quotes (`"${#arr[@]}"` vs `${#arr[@]}`)  
  Both work for getting the length.

---

## For with files

- Iterate with the contents of a file

  **Example:**
  ```bash
  echo "W X Y Z" > file.txt
  var=$(cat file.txt)
  for i in $var
  do
     echo "Letter: $i"
  done
  ```
  Output:
  ```
  Letter: W
  Letter: X
  Letter: Y
  Letter: Z
  ```

  **Line-by-line iteration:**
  ```bash
  while read line; do
     echo "Line: $line"
  done < file.txt
  ```

---
