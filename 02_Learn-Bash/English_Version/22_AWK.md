# AWK — A Text Processing Language

`awk` is more than a command — it's a **mini programming language** built specifically for processing structured text data (like tables, logs, and CSV files). While `sed` works on whole lines, `awk` works on **columns** (fields).

---

## How AWK Thinks

AWK processes input **line by line**, splitting each line into fields. By default, fields are separated by whitespace.

```bash
# Given this input line: "John 30 Engineer"
# AWK sees:  $1="John"  $2="30"  $3="Engineer"  $0="John 30 Engineer" (whole line)
```

---

## Syntax: The Three Blocks

```bash
awk 'BEGIN { setup } { per-line-code } END { cleanup }' file
```

| Block | When It Runs | Use Case |
|-------|-------------|----------|
| `BEGIN { }` | Once, BEFORE reading any lines | Set separators, print headers, initialize variables |
| `{ }` | Once per EACH line in the file | Main processing logic |
| `END { }` | Once, AFTER all lines are processed | Print totals, summaries |

```bash
# ← Count lines in a file (AWK's way):
awk 'BEGIN {count=0} {count++} END {print "Total lines:", count}' file.txt
```

---

## Built-In Variables

```bash
awk '{print NR, $0}' file.txt     # ← NR = current line Number. Adds line numbers!
```

| Variable | Meaning | Default |
|----------|---------|---------|
| `$0` | The entire current line | — |
| `$1, $2...` | Field 1, Field 2, etc. | — |
| `NR` | Current line number (Number of Records) | — |
| `NF` | Number of fields in current line | — |
| `FS` | Input Field Separator | whitespace |
| `OFS` | Output Field Separator | space |
| `RS` | Input Record (line) Separator | `\n` |
| `ORS` | Output Record Separator | `\n` |

---

## Practical Examples

### Extract Columns from /etc/passwd
```bash
# ← /etc/passwd uses ":" as separator. Get username and shell:
awk -F: '{print $1, $7}' /etc/passwd
# Output: root /bin/bash
#         daemon /usr/sbin/nologin
#         ...

# ← With a custom output separator:
awk -F: 'BEGIN {OFS=" → "} {print $1, $7}' /etc/passwd
# Output: root → /bin/bash
```

### Search and Filter
```bash
# ← Print lines containing "error":
awk '/error/' logfile.txt

# ← Print only the timestamp and message from matching lines:
awk '/error/ {print $1, $2, $NF}' logfile.txt

# ← Filter by a specific field:
awk '$3 > 1000 {print $1, $3}' data.txt     # ← Lines where field 3 > 1000

# ← Pattern matching on a field:
awk '$1 ~ /^Sa/ {print $0}' employees.txt    # ← Field 1 starts with "Sa"
awk '$1 !~ /admin/ {print $0}' users.txt     # ← Field 1 does NOT contain "admin"
```

### Calculations
```bash
# ← Sum a column:
awk '{sum += $3} END {print "Total:", sum}' sales.txt

# ← Average:
awk '{sum += $3; count++} END {print "Average:", sum/count}' sales.txt

# ← Quick calculator (no input file needed):
awk 'BEGIN {print 355/113}'     # ← Output: 3.14159
```

---

## AWK with If/Else and For Loops

AWK has its own programming constructs:

```bash
# ← If/else inside AWK:
awk '{
    if ($3 > 50000) 
        print $1, "HIGH SALARY"
    else 
        print $1, "normal salary"
}' employees.txt

# ← For loop inside AWK:
awk '{
    for (i=1; i<=NF; i++)          # ← Loop through every field in the line
        print "Field", i, "=", $i
}' data.txt
```

![AWK Processing Model](../images/en/22_en_img1.png)

![AWK Field Extraction](../images/en/22_en_img2.png)