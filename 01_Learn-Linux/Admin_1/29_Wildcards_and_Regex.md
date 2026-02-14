# 29: Wildcards and Regular Expressions

## 1. Introduction
Pattern matching is essential in Linux. Understanding the difference between **Wildcards** and **Regular Expressions** is crucial:

-   **Wildcards (Globbing):** Used by the **Shell** to match **filenames**.
-   **Regular Expressions (Regex):** Used by **Text Processing Tools** (grep, sed, awk) to match **text content**.

## 2. Wildcards (Shell Globbing)
The shell interprets these patterns **before** running commands.

| Symbol | Meaning | Example | Matches |
| :--- | :--- | :--- | :--- |
| `*` | Any number of chars | `*.txt` | `a.txt`, `file.txt`, `my.file.txt` |
| `?` | Exactly one char | `file?.txt` | `file1.txt`, `fileA.txt` |
| `[]` | Specific range/set | `file[1-3].txt` | `file1.txt`, `file2.txt`, `file3.txt` |
| `{}` | Set of terms | `file{A,B}.txt` | `fileA.txt`, `fileB.txt` |
| `[!]` | Not in set | `file[!1].txt` | `file2.txt`, `file3.txt` (Not file1) |

**Example Usage:**
```bash
ls *.log                # List all .log files
rm temp[123].txt        # Delete temp1.txt, temp2.txt, temp3.txt
cp file{1,2,3}.txt backup/  # Copy file1, file2, file3 to backup/
```

## 3. Regular Expressions (Regex)
Used by text processing tools to search **inside files**.

## 5. Summary
-   `*` : Any string.
-   `?` : One char.
-   `[]` : Set/Range.
-   `{}` : Sequence/List.

---

## 6. 🏆 Master Example: Complex File Organization
**Scenario:** You have a `downloads` folder full of mixed files. You want to organize them into folders by year and type: `2023/images`, `2024/docs`, etc. using strict matching.

```bash
# 1. Move 2023 JPG images to 2023/images
# Matches: report-2023-photo.jpg
mkdir -p 2023/images
mv *2023*.jpg 2023/images/

# 2. Move files named "data_a.csv", "data_b.csv" ... "data_e.csv"
# Matches set [a-e]
mkdir -p data/small_sets
mv data_[a-e].csv data/small_sets/

# 3. Create backup folders for next 5 years
# Pattern: backup_2025, backup_2026...
mkdir backup_{2025..2029}

# Verify
ls -d backup_*
```

> **Efficiency:** You organized hundreds of files with 3 commands using wildcards and brace expansion.
| Symbol | Meaning | Example | Matches |
| :--- | :--- | :--- | :--- |
| `.` | Any single char | `a.c` | `abc`, `adc`, `a9c` |
| `^` | Start of line | `^Error` | Lines starting with "Error" |
| `$` | End of line | `done$` | Lines ending with "done" |
| `*` | Zero or more of **preceding** char | `ab*` | `a`, `ab`, `abb`, `abbb` |
| `+` | One or more of **preceding** char | `ab+` | `ab`, `abb` (Not `a`) |
| `\d` | Any digit | `file\d+` | `file1`, `file123` |
| `[0-9]` | Digit range | `[0-9]{3}` | `123`, `999` |

**Example Usage:**
```bash
grep "^Error" /var/log/syslog     # Find lines starting with "Error"
grep "fail$" logfile.txt          # Find lines ending with "fail"
grep "port [0-9]\+" config.txt    # Find lines with "port" followed by numbers
```

## 4. Character Classes
Standard classes usable in **both** Wildcards and Regex (with `[:class:]` syntax).

-   `[:digit:]`: Numbers (0-9).
-   `[:alpha:]`: Letters (a-Z).
-   `[:alnum:]`: Alphanumeric.
-   `[:space:]`: Whitespace.
-   `[:lower:]`: Lowercase letters.
-   `[:upper:]`: Uppercase letters.

**Example:**
```bash
# Wildcard (filename matching)
ls *[[:digit:]].jpg
# Matches: image1.jpg, photo9.jpg

# Regex (text matching)
grep "[[:alpha:]]\+" file.txt
# Matches: lines containing alphabetic characters
```

## 5. Key Differences

| Aspect | Wildcards | Regex |
| :--- | :--- | :--- |
| **Used By** | Shell (bash, zsh) | Tools (grep, sed, awk, vim) |
| **Operates On** | Filenames | Text content |
| **`*` Meaning** | Any characters | Zero or more of **previous** character |
| **Example** | `ls *.txt` | `grep "ab*" file` |

> [!IMPORTANT]
> **Common Mistake:** Using wildcards in `grep` or regex in `ls` won't work as expected.
> - `ls ^file*` ❌ (Regex doesn't work in ls)
> - `grep *.log` ❌ (Wildcard expands before grep sees it)
> - `grep "Error" *.log` ✅ (Wildcard for filename, regex for pattern)

## 6. Key Takeaways
-   **Wildcards** = Shell filename expansion (`ls`, `cp`, `rm`).
-   **Regex** = Text pattern matching (`grep`, `sed`, `awk`).
-   `*` behaves **differently** in each context.
-   Learn both—they're fundamental to Linux mastery.