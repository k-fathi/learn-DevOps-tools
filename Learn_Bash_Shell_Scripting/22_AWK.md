# AWK: A Powerful Text Processing Tool

## AWK Syntax

```bash
awk 'BEGIN {Commands} {Commands} END {Commands}' INPUT_FILE
```

- `BEGIN {Commands}`: (optional) Commands executed before processing any input lines.
- `{Commands}`: Main commands executed for each line (record) in the input file.
   * (eg.,) `{print}`: Prints the current line (similar to `cat`).
- `END {Commands}`: (optional) Commands executed after all input lines are processed.

AWK processes input line by line, so you can think of it as a loop where each iteration represents a line:

```bash
$ awk 'BEGIN {i=0} {i++} END {print i}' file.txt  # Prints the number of lines
```

You can also set field and output separators:

```bash
$ awk 'BEGIN {FS=":"; OFS="-"} {print; print "\n"}' awk4.txt
```

---

## AWK Variables

- **NR**: Number of Records (line number).  
   Example: `NR` is 1 for the first line, 2 for the second, etc.
- **NF**: Number of fields in the current record.  
   Example: `$1` is field 1, `$2` is field 2, etc.
- **$0**: The entire current line.
- **FS**: Field separator (default: whitespace).
- **OFS**: Output field separator (default: whitespace).
- **RS**: Record separator (default: newline `\n`).
- **ORS**: Output record separator (default: newline `\n`).
### The variables are defined in the BEGIN{} filed.
---

## Examples

```bash
$ tail -10 /etc/passwd | awk 'BEGIN {FS=":"; OFS=" -> "} {print $1, $7}' > awk3.txt
$ tail -10 /etc/passwd | awk -F : 'BEGIN {OFS=" -> "} {print $1, $7}' > awk3.txt

$ awk 'BEGIN {FS=":"; OFS="->"; RS="\n"; ORS="\n"} {print NR, $1, $7}' awk4.txt
```

---

## AWK Operations

- Search for a word:
   ```bash
   $ awk '/word/' INPUT_FILE
   ```
- Search and print specific fields:
   ```bash
   $ awk '/word/ {print $1, $3}' INPUT_FILE
   $ awk '/^char/ {print $1, $3}' INPUT_FILE
   $ awk '/char$/ {print $1, $3}' INPUT_FILE
   ```
- Search for a pattern in a specific field:
   ```bash
   $ awk '$1 ~ /Sa/ {print $0}' awk5.txt      # Field 1 contains 'Sa'
   $ awk '$1 !~ /Sa/ {print $0}' awk5.txt     # Field 1 does NOT contain 'Sa'
   ```
- Numeric comparison:
   ```bash
   $ awk '$3 < 30000 {print $0}' awk5.txt     # Field 3 less than 30000
   ```
- Arithmetic in BEGIN:
   ```bash
   $ awk 'BEGIN {print 5+5}' awk5.txt
   ```
- Variables can be assigned in the END section.

---

## AWK if Statement

```bash
awk '
{
    if (condition) {
         # code to execute
    } else {
         # code to execute
    }
}
' INPUT_FILE
```

---

## AWK for Loop

```bash
awk '{
    for (variable in collection) {
         # action
    }
}' INPUT_FILE
```