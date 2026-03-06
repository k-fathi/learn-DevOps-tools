# Bash Scripting - Command Cheat Sheet

Quick reference guide for essential Bash scripting concepts covered in this course.

---

## 📋 Table of Contents
- [Script Basics](#script-basics)
- [Variables & Expansion](#variables--expansion)
- [Arithmetic Operations](#arithmetic-operations)
- [User Input](#user-input)
- [Conditionals & Tests](#conditionals--tests)
- [Loops](#loops)
- [Arrays](#arrays)
- [Functions](#functions)
- [String Operations](#string-operations)
- [Regular Expressions](#regular-expressions)
- [SED](#sed)
- [AWK](#awk)
- [File Operations](#file-operations)
- [Scheduling](#scheduling)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [🏆 Master One-Liners](#-master-one-liners)

---

## 📜 Script Basics

| Syntax | Description | Example |
|--------|-------------|---------|
| `#!/bin/bash` | Shebang (first line of script) | `#!/bin/bash` |
| `chmod +x script.sh` | Make script executable | `chmod +x myscript.sh` |
| `./script.sh` | Run script | `./myscript.sh` |
| `bash script.sh` | Run without execute permission | `bash myscript.sh` |
| `$0` | Script name | `echo $0` |
| `$1, $2, ...` | Positional parameters | `echo $1` |
| `$#` | Number of arguments | `echo "Args: $#"` |
| `$@` | All arguments (as separate words) | `for arg in "$@"; do echo $arg; done` |
| `$*` | All arguments (as single string) | `echo $*` |
| `$$` | Current process PID | `echo $$` |
| `$?` | Exit status of last command | `echo $?` |
| `exit <n>` | Exit with status code | `exit 0` |

---

## 🔤 Variables & Expansion

| Syntax | Description | Example |
|--------|-------------|---------|
| `VAR=value` | Assign variable (no spaces!) | `NAME="Karim"` |
| `$VAR` or `${VAR}` | Use variable value | `echo "Hello $NAME"` |
| `readonly VAR` | Make variable read-only | `readonly PI=3.14` |
| `unset VAR` | Delete variable | `unset NAME` |
| `export VAR` | Export to child processes | `export PATH=$PATH:/opt/bin` |
| `local VAR=value` | Local variable (inside functions) | `local count=0` |
| `${VAR:-default}` | Use default if unset | `echo ${NAME:-"Guest"}` |
| `${VAR:=default}` | Assign default if unset | `echo ${NAME:="Guest"}` |
| `${VAR:+alt}` | Use alt if VAR is set | `echo ${NAME:+"exists"}` |
| `${VAR:?error}` | Error if unset | `echo ${NAME:?"Not set!"}` |
| `${#VAR}` | Length of string | `echo ${#NAME}` |
| `$(command)` | Command substitution | `FILES=$(ls)` |
| `` `command` `` | Command substitution (old style) | `` FILES=`ls` `` |

---

## 🔢 Arithmetic Operations

| Syntax | Description | Example |
|--------|-------------|---------|
| `$(( expr ))` | Arithmetic expansion | `echo $(( 5 + 3 ))` |
| `let "expr"` | Evaluate expression | `let "x = 5 + 3"` |
| `expr a + b` | External calculator | `expr 5 + 3` |
| `$(( a + b ))` | Addition | `echo $(( 10 + 5 ))` |
| `$(( a - b ))` | Subtraction | `echo $(( 10 - 5 ))` |
| `$(( a * b ))` | Multiplication | `echo $(( 10 * 5 ))` |
| `$(( a / b ))` | Division (integer) | `echo $(( 10 / 3 ))` |
| `$(( a % b ))` | Modulus (remainder) | `echo $(( 10 % 3 ))` |
| `$(( a ** b ))` | Exponentiation | `echo $(( 2 ** 8 ))` |
| `$(( a++ ))` | Post-increment | `echo $(( x++ ))` |
| `$(( ++a ))` | Pre-increment | `echo $(( ++x ))` |
| `bc -l` | Floating-point math | `echo "10/3" \| bc -l` |

---

## 📥 User Input

| Syntax | Description | Example |
|--------|-------------|---------|
| `read VAR` | Read input into variable | `read name` |
| `read -p "prompt" VAR` | Read with prompt | `read -p "Enter name: " name` |
| `read -s VAR` | Silent input (passwords) | `read -s -p "Password: " pass` |
| `read -t 5 VAR` | Timeout after 5 seconds | `read -t 5 answer` |
| `read -n 1 VAR` | Read single character | `read -n 1 choice` |
| `read -a ARRAY` | Read into array | `read -a fruits` |
| `read -r VAR` | Raw input (no backslash escape) | `read -r filepath` |

---

## 🔀 Conditionals & Tests

| Syntax | Description | Example |
|--------|-------------|---------|
| `if [ condition ]; then` | If statement | `if [ $x -gt 5 ]; then echo "big"; fi` |
| `[[ condition ]]` | Extended test (preferred) | `if [[ $name == "admin" ]]; then ...` |
| `if-elif-else-fi` | Full branching | see below |
| `case $VAR in` | Case/switch statement | see below |

### Numeric Comparisons
| Operator | Meaning | Example |
|----------|---------|---------|
| `-eq` | Equal | `[ $a -eq $b ]` |
| `-ne` | Not equal | `[ $a -ne $b ]` |
| `-gt` | Greater than | `[ $a -gt $b ]` |
| `-ge` | Greater or equal | `[ $a -ge $b ]` |
| `-lt` | Less than | `[ $a -lt $b ]` |
| `-le` | Less or equal | `[ $a -le $b ]` |

### String Comparisons
| Operator | Meaning | Example |
|----------|---------|---------|
| `=` or `==` | Equal | `[ "$a" = "$b" ]` |
| `!=` | Not equal | `[ "$a" != "$b" ]` |
| `-z` | String is empty | `[ -z "$a" ]` |
| `-n` | String is not empty | `[ -n "$a" ]` |

### File Tests
| Operator | Meaning | Example |
|----------|---------|---------|
| `-f` | Is regular file | `[ -f /etc/passwd ]` |
| `-d` | Is directory | `[ -d /tmp ]` |
| `-e` | Exists | `[ -e /path/to/file ]` |
| `-r` | Is readable | `[ -r file.txt ]` |
| `-w` | Is writable | `[ -w file.txt ]` |
| `-x` | Is executable | `[ -x script.sh ]` |
| `-s` | File is not empty | `[ -s file.txt ]` |

### Logical Operators
| Operator | Meaning | Example |
|----------|---------|---------|
| `&&` or `-a` | AND | `[ $a -gt 0 ] && [ $a -lt 10 ]` |
| `\|\|` or `-o` | OR | `[ $a -eq 0 ] \|\| [ $a -eq 1 ]` |
| `!` | NOT | `[ ! -f file.txt ]` |

### Case Statement
```bash
case $choice in
  1) echo "Option 1" ;;
  2|3) echo "Option 2 or 3" ;;
  *) echo "Default" ;;
esac
```

---

## 🔄 Loops

### For Loop
```bash
for i in 1 2 3 4 5; do
  echo "Number: $i"
done
```

### C-style For Loop
```bash
for (( i=0; i<10; i++ )); do
  echo $i
done
```

### While Loop
```bash
count=1
while [ $count -le 5 ]; do
  echo "Count: $count"
  ((count++))
done
```

### Until Loop
```bash
count=1
until [ $count -gt 5 ]; do
  echo "Count: $count"
  ((count++))
done
```

### Select Menu
```bash
select option in "Start" "Stop" "Quit"; do
  case $option in
    "Quit") break ;;
    *) echo "You chose: $option" ;;
  esac
done
```

### Flow Control
| Command | Description | Example |
|---------|-------------|---------|
| `break` | Exit loop | `break` |
| `break n` | Exit n levels of loops | `break 2` |
| `continue` | Skip to next iteration | `continue` |
| `continue n` | Skip in nth enclosing loop | `continue 2` |
| `shift` | Shift positional params left | `shift` |
| `shift n` | Shift by n positions | `shift 2` |

---

## 📦 Arrays

| Syntax | Description | Example |
|--------|-------------|---------|
| `arr=(a b c)` | Declare array | `fruits=("apple" "banana" "cherry")` |
| `${arr[0]}` | Access element | `echo ${fruits[0]}` |
| `${arr[@]}` | All elements | `echo ${fruits[@]}` |
| `${#arr[@]}` | Array length | `echo ${#fruits[@]}` |
| `arr[n]=value` | Set element | `fruits[3]="date"` |
| `arr+=(value)` | Append element | `fruits+=("elderberry")` |
| `unset arr[n]` | Remove element | `unset fruits[1]` |
| `${arr[@]:s:n}` | Slice (start:count) | `echo ${fruits[@]:1:2}` |
| `${!arr[@]}` | All indices | `echo ${!fruits[@]}` |

---

## 🧩 Functions

```bash
# Define function
function greet() {
  local name=$1
  echo "Hello, $name!"
  return 0
}

# Call function
greet "Karim"

# Capture return value
result=$(greet "World")
```

| Concept | Description | Example |
|---------|-------------|---------|
| `$1, $2, ...` | Function arguments | `func arg1 arg2` |
| `local VAR` | Local scope variable | `local count=0` |
| `return n` | Return exit status (0-255) | `return 0` |
| `$(func)` | Capture function output | `result=$(func)` |
| `source file.sh` | Load functions from file | `source utils.sh` |
| `. file.sh` | Same as source | `. utils.sh` |

---

## ✂️ String Operations

| Syntax | Description | Example |
|--------|-------------|---------|
| `${#str}` | String length | `echo ${#name}` |
| `${str:pos:len}` | Substring | `echo ${name:0:5}` |
| `${str#pattern}` | Remove shortest prefix | `echo ${file#*.}` |
| `${str##pattern}` | Remove longest prefix | `echo ${path##*/}` |
| `${str%pattern}` | Remove shortest suffix | `echo ${file%.*}` |
| `${str%%pattern}` | Remove longest suffix | `echo ${path%%/*}` |
| `${str/old/new}` | Replace first match | `echo ${str/foo/bar}` |
| `${str//old/new}` | Replace all matches | `echo ${str//foo/bar}` |
| `${str^^}` | Uppercase all | `echo ${name^^}` |
| `${str,,}` | Lowercase all | `echo ${name,,}` |

---

## 🔍 Regular Expressions

| Pattern | Description | Example |
|---------|-------------|---------|
| `.` | Any single character | `grep "h.t" file` |
| `*` | Zero or more of previous | `grep "ab*c" file` |
| `+` | One or more of previous (ERE) | `grep -E "ab+c" file` |
| `?` | Zero or one of previous (ERE) | `grep -E "ab?c" file` |
| `^` | Start of line | `grep "^Hello" file` |
| `$` | End of line | `grep "world$" file` |
| `[abc]` | Any character in set | `grep "[aeiou]" file` |
| `[^abc]` | Any character NOT in set | `grep "[^0-9]" file` |
| `[a-z]` | Range | `grep "[a-zA-Z]" file` |
| `{n}` | Exactly n times (ERE) | `grep -E "[0-9]{3}" file` |
| `{n,m}` | Between n and m times (ERE) | `grep -E "[0-9]{2,4}" file` |
| `\b` | Word boundary | `grep "\bword\b" file` |
| `(a|b)` | Alternation (ERE) | `grep -E "(cat|dog)" file` |
| `=~` | Bash regex match | `[[ $str =~ ^[0-9]+$ ]]` |

---

## 📝 SED

| Command | Description | Example |
|---------|-------------|---------|
| `sed 's/old/new/' file` | Replace first per line | `sed 's/http/https/' urls.txt` |
| `sed 's/old/new/g' file` | Replace all in line | `sed 's/foo/bar/g' file.txt` |
| `sed -i 's/old/new/g' file` | In-place edit | `sed -i 's/old/new/g' config.txt` |
| `sed -i.bak 's/old/new/g'` | In-place with backup | `sed -i.bak 's/v1/v2/g' conf.txt` |
| `sed 'nd' file` | Delete line n | `sed '5d' file.txt` |
| `sed '/pattern/d' file` | Delete matching lines | `sed '/^#/d' config.txt` |
| `sed -n 'np' file` | Print only line n | `sed -n '10p' file.txt` |
| `sed -n '/pattern/p' file` | Print matching lines | `sed -n '/error/p' log.txt` |
| `sed 'n,ms/old/new/'` | Replace in line range | `sed '2,5s/foo/bar/' file.txt` |
| `sed 'ni\text' file` | Insert before line n | `sed '1i\#!/bin/bash' script.sh` |
| `sed 'na\text' file` | Append after line n | `sed '1a\# Comment' script.sh` |

---

## 📊 AWK

| Command | Description | Example |
|---------|-------------|---------|
| `awk '{print $1}' file` | Print first column | `awk '{print $1}' log.txt` |
| `awk '{print $NF}' file` | Print last column | `awk '{print $NF}' log.txt` |
| `awk -F: '{print $1}'` | Custom delimiter | `awk -F: '{print $1}' /etc/passwd` |
| `awk '/pattern/' file` | Print matching lines | `awk '/error/' log.txt` |
| `awk 'NR==5' file` | Print specific line | `awk 'NR==5' file.txt` |
| `awk 'NR>=2 && NR<=5'` | Print line range | `awk 'NR>=2 && NR<=5' file.txt` |
| `awk '{sum+=$1} END{print sum}'` | Sum column | `awk '{sum+=$1} END{print sum}' nums.txt` |
| `awk '{print NR, $0}'` | Add line numbers | `awk '{print NR, $0}' file.txt` |
| `awk 'BEGIN{...} {...} END{...}'` | Full AWK program | see below |
| `awk -v var=val` | Pass variable to AWK | `awk -v n=5 '$1 > n' file.txt` |

### AWK Program Structure
```bash
awk 'BEGIN { FS=":"; print "User List" }
     { print $1, $3 }
     END { print "Total:", NR }' /etc/passwd
```

---

## 📂 File Operations

| Syntax | Description | Example |
|--------|-------------|---------|
| `while read line` | Read file line by line | see below |
| `< file` | Input redirection | `while read line; do ...; done < file` |
| `> file` | Output redirection (overwrite) | `echo "hello" > file.txt` |
| `>> file` | Output redirection (append) | `echo "hello" >> file.txt` |
| `2> file` | Redirect stderr | `cmd 2> errors.log` |
| `&> file` | Redirect both stdout & stderr | `cmd &> all.log` |
| `source file.sh` | Execute file in current shell | `source config.sh` |
| `. file.sh` | Same as source | `. config.sh` |

### Read File Line by Line
```bash
while IFS= read -r line; do
  echo "$line"
done < input.txt
```

---

## ⏰ Scheduling

### Cron Jobs
| Field | Values | Description |
|-------|--------|-------------|
| Minute | 0-59 | Minute of the hour |
| Hour | 0-23 | Hour of the day |
| Day | 1-31 | Day of the month |
| Month | 1-12 | Month of the year |
| Weekday | 0-7 | Day of the week (0 & 7 = Sunday) |

| Command | Description | Example |
|---------|-------------|---------|
| `crontab -e` | Edit cron jobs | `crontab -e` |
| `crontab -l` | List cron jobs | `crontab -l` |
| `crontab -r` | Remove all cron jobs | `crontab -r` |

### Cron Examples
```bash
# Every 5 minutes
*/5 * * * * /path/to/script.sh

# Daily at 2:30 AM
30 2 * * * /path/to/backup.sh

# Every Monday at 9 AM
0 9 * * 1 /path/to/report.sh

# First day of every month at midnight
0 0 1 * * /path/to/monthly.sh
```

### At Command
| Command | Description | Example |
|---------|-------------|---------|
| `at <time>` | Schedule one-time task | `at 10:00 AM` |
| `atq` | List pending at jobs | `atq` |
| `atrm <job>` | Remove at job | `atrm 3` |

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + C` | Terminate current process |
| `Ctrl + D` | Exit current shell |
| `Ctrl + Z` | Suspend current process |
| `Ctrl + L` | Clear screen |
| `Ctrl + R` | Search command history |
| `Ctrl + A` | Move to beginning of line |
| `Ctrl + E` | Move to end of line |
| `Ctrl + U` | Delete from cursor to beginning |
| `Ctrl + K` | Delete from cursor to end |
| `Alt + .` | Paste last argument |
| `Tab` | Auto-complete |
| `Tab Tab` | Show all completions |

---

## 🔐 Common Patterns

### Script Template
```bash
#!/bin/bash
set -euo pipefail  # Exit on error, unset var, pipe failure

# Usage
usage() {
  echo "Usage: $0 [-h] [-v] <argument>"
  exit 1
}

# Parse arguments
while getopts "hv" opt; do
  case $opt in
    h) usage ;;
    v) VERBOSE=true ;;
    *) usage ;;
  esac
done
shift $((OPTIND - 1))

# Main logic here
echo "Starting script..."
```

### Error Handling
```bash
command || { echo "Command failed!"; exit 1; }
```

### Check if Root
```bash
if [[ $EUID -ne 0 ]]; then
  echo "This script must be run as root"
  exit 1
fi
```

### Log Function
```bash
log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}
log "Script started"
```

---

## 🏆 Master One-Liners

### 🚀 Rename All Files (Change Extension)
```bash
for f in *.txt; do mv "$f" "${f%.txt}.md"; done
```

### 🧹 Find and Replace in Multiple Files
```bash
find . -name "*.conf" -exec sed -i 's/old_value/new_value/g' {} +
```

### 🔍 Count Lines of Code (Excluding Blanks)
```bash
find . -name "*.sh" -exec grep -cH "" {} + | awk -F: '{sum+=$2} END{print "Total:", sum}'
```

### 🌐 Quick CSV Column Extract
```bash
awk -F',' '{print $2}' data.csv | sort | uniq -c | sort -rn | head
```

### 📂 Parallel File Processing
```bash
find /logs -name "*.log" -print0 | xargs -0 -P 4 -I {} grep -l "ERROR" {}
```

---

## 📌 Pro Tips

1. **Always quote your variables to prevent word splitting:**
   ```bash
   echo "$filename"  # Correct
   echo $filename    # May break with spaces
   ```

2. **Use `set -euo pipefail` at the top of production scripts:**
   ```bash
   set -euo pipefail
   ```

3. **Use `shellcheck` to lint your scripts before running:**
   ```bash
   shellcheck myscript.sh
   ```

4. **Use `[[ ]]` instead of `[ ]` for tests (more features, fewer gotchas):**
   ```bash
   [[ -f "$file" && "$name" == "admin" ]]
   ```

5. **Use `printf` instead of `echo` for portable output:**
   ```bash
   printf "Name: %s\nAge: %d\n" "$name" "$age"
   ```

---

**For detailed explanations and examples, refer to the specific module files.**

[📚 Back to Main README](./README.md)
