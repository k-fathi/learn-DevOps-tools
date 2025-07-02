# Regular Expressions in Bash: A Powerful Tool for Pattern Matching and Text Manipulation

Regular expressions (regex) are used for searching, matching, and manipulating text based on patterns in Bash scripts and command-line tools.

---

## Syntax Example

```bash
if [[ $var =~ regular_expression ]]; then
    # code to execute
else
    # code to execute
fi
```

**Example:**  
```bash
if [[ $var =~ ^[0-9]+$ ]]; then
    # $var contains only numbers
fi
```

---

## Common Regular Expression Symbols

| Symbol      | Description                                                        | Example                                      |
|-------------|--------------------------------------------------------------------|----------------------------------------------|
| `[]`        | Character set or range                                             | `[aeiou]` matches any vowel; `[0-9]` matches any digit |
| `[^ ]`      | Negated set (matches any character not in the set)                 | `[^0-9]` matches any non-digit               |
| `*`         | Matches zero or more occurrences of the preceding character        | `fo*` matches `f`, `fo`, `foo`, `fooo`       |
| `+`         | Matches one or more occurrences (with `-E`/extended regex)         | `[0-9]+` matches `1`, `12`, `123`            |
| `?`         | Matches zero or one occurrence (with `-E`/extended regex)          | `colou?r` matches `color` and `colour`       |
| `{n}`       | Matches exactly n occurrences (with `-E`/extended regex)           | `[0-9]{3}` matches `123`                     |
| `.`         | Matches any single character except a newline                      | `a.c` matches `abc`, `a_c`, `a-c`            |
| `^`         | Matches the start of a line                                        | `^abc` matches `abc` at the start of a line  |
| `$`         | Matches the end of a line                                          | `abc$` matches `abc` at the end of a line    |
| `\`         | Escapes the following character                                    | `\.` matches a literal dot `.`               |

---

## Detailed Examples

### 1. Character Sets and Ranges: `[]`

```bash
# Check if the variable contains a vowel
var="hello"
if [[ $var =~ [aeiou] ]]; then
    echo "The variable contains a vowel."
fi
```

```bash
# Check if the variable contains a digit
var="abc123"
if [[ $var =~ [0-9] ]]; then
    echo "The variable contains a digit."
fi
```

```bash
# Check if the variable contains an alphabetic character, a digit, or an underscore
var="abc_123"
if [[ $var =~ [A-Za-z0-9_] ]]; then
    echo "The variable contains an alphabetic character, a digit, or an underscore."
fi
```

### 2. Negated Sets: `[^ ]`

```bash
# Check if the variable contains only alphabetic characters (no digits)
var="helloWorld"
if [[ $var =~ [^a-zA-Z] ]]; then
    echo "The variable contains non-alphabet characters."
else
    echo "This variable contains only alphabet characters."
fi
```

### 3. The Dot `.`

```bash
# Check if the variable contains any character followed by 'a' and then any character
var="bacon"
if [[ $var =~ .a. ]]; then
    echo "The variable contains any character followed by 'a' and then any character."
fi
```

### 4. Anchors: `^` and `$`

```bash
# Check if the variable starts with 'Hello'
var="HelloWorld"
if [[ $var =~ ^Hello ]]; then
    echo "The variable starts with 'Hello'."
fi
```

```bash
# Check if the variable ends with 'World'
var="HelloWorld"
if [[ $var =~ World$ ]]; then
    echo "The variable ends with 'World'."
fi
```

### 5. Greedy Quantifiers

```bash
# {}: Exactly n occurrences
var="123"
if [[ $var =~ [0-9]{3} ]]; then
    echo "The variable contains exactly 3 digits."
fi
```

```bash
# +: One or more occurrences (with -E)
var="abc123"
if [[ $var =~ [0-9]+ ]]; then
    echo "The variable contains one or more digits."
fi
```

```bash
# *: Zero or more occurrences
var="abc123"
if [[ $var =~ [0-9]* ]]; then
    echo "The variable contains zero or more digits."
fi
```

```bash
# ?: Zero or one occurrence (with -E)
var="abc"
if [[ $var =~ [0-9]? ]]; then
    echo "The variable contains zero or one digit."
fi
```

---

## Using Extended Regular Expressions

- The `-E` option is used with commands like `grep`, `sed`, and `awk` to enable extended regular expressions, allowing the use of `+`, `?`, and `{}` without escaping.

**Example:**
```bash
grep -E '^[a-zA-Z]+$' file.txt
```

---

## More Practical Examples

- Match a 3-digit number:  
  ```bash
  [[ $var =~ ^[0-9]{3}$ ]]
  ```
- Match a valid email address (simple):  
  ```bash
  [[ $email =~ ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$ ]]
  ```
- Match a line that starts with `#`:  
  ```bash
  [[ $line =~ ^# ]]
  ```
- Match a word ending with `ing`:  
  ```bash
  [[ $word =~ ing$ ]]
  ```

---

## Summary Table

| Symbol      | Description                                                        |
|-------------|--------------------------------------------------------------------|
| `[]`        | Character set or range                                             |
| `[^ ]`      | Negated set                                                        |
| `*`         | Zero or more occurrences                                           |
| `+`         | One or more occurrences (extended regex)                           |
| `?`         | Zero or one occurrence (extended regex)                            |
| `{n}`       | Exactly n occurrences (extended regex)                             |
| `.`         | Any single character except newline                                |
| `^`         | Start of a string/line                                             |
| `$`         | End of a string/line                                               |
| `\`         | Escape special character                                           |

---

**Tip:**  
- Use `[[ ... =~ ... ]]` in Bash for regex matching.
- Use `-E` with tools like `grep` for extended regex features.

---

Regular expressions are essential for efficient text processing and validation in Bash scripting!
