# User Input and Output

## 1. `echo` Command:
The `echo` command is used to display messages or output text. Here are some common options:

- `-n`: Prevents a newline from being added at the end of the output.
- `-e`: Enables interpretation of backslash escapes:
   - `\t`: Inserts a horizontal tab.
   - `\v`: Inserts a vertical tab.
   - `\a`: Triggers an alert sound.
   - `\n`: Inserts a newline.
### Examples:
```bash
# Example 1: Basic echo
echo "Hello, World!"
# Output:
# Hello, World!

# Example 2: Using -n to prevent a newline
echo -n "Processing..."
# Output:
# Processing...[user@host]$ 

# Example 3: Using -e for special characters
echo -e "Column1\tColumn2\nRow1\tRow2"
# Output:
# Column1    Column2
# Row1       Row2

# Example 4: Using -e with multiple special characters
echo -e "Line1\nLine2\tTabbed\vVertical"
# Output:
# Line1
# Line2    Tabbed
#          Vertical
```

---

## 2. `read` Command:
The `read` command is used to capture user input. Below are some common use cases:

### Basic Syntax:
```bash
$ read var_name1 var_name2 var_name3 ...
# Every enterd word will be assigned to a variable.
```

### Options:
- `-s`: Reads sensitive information (e.g., passwords) and hides the user input.
- `-t <seconds>`: Sets a timeout for user input.
- `-p "Message"`: Displays a message to prompt the user.

### Examples:

# Example 1: Basic read
```bash
# Example 1: Basic read
read name
echo "Hello, $name!"
# Input: Alice
# Output:
# Hello, Alice!
```

# Example 2: Using -p to display a prompt
```bash
read -p "Enter your age: " age
echo "You are $age years old."
# Input: 25
# Output:
# Enter your age: 25
# You are 25 years old.
```
# Example 3: Using -s for sensitive input

```bash
read -s -p "Enter your password: " password
echo -e "\nPassword saved."
# Input: (hidden)
# Output:
# Enter your password: 
# Password saved.
```
# Example 4: Using -t for a timeout

```bash
read -t 5 -p "Enter your favorite color: " color
echo "Your favorite color is $color."
# Input: Blue (within 5 seconds)
# Output:
# Enter your favorite color: Blue
# Your favorite color is Blue.
```


# Brace Expansion:
Brace expansion is a feature in Bash that allows you to generate arbitrary strings. It is often used to create sequences of characters or numbers.
### Examples:
```bash
# Example 1: Basic brace expansion
echo {A,B,C}
# Output:
# A B C
# Example 2: Numeric range
echo {1..5}
# Output:
# 1 2 3 4 5
# Example 3: Combining strings and numbers
echo file{1..3}.txt
# Output:
# file1.txt file2.txt file3.txt
# Example 4: Nested brace expansion
echo {A,B{1,2},C}
# Output:
# A B1 B2 C
# Example 5: Using brace expansion with commands
echo {-5..5..2}
# Output:
# -5
# -3
# -1
# 1
# 3
# 5
```