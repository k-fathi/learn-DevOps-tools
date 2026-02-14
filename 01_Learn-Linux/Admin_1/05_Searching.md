# 05: Searching in Linux

## 1. Introduction
Linux offers powerful tools to find commands, files, and text patterns within files. This module covers the essential searching utilities.

## 2. Searching for Commands
These tools help you locate executable binaries and their manual pages.

### `whereis`
Locates the binary, source, and manual page files for a command.
```bash
whereis ls
# Output: ls: /usr/bin/ls /usr/share/man/man1/ls.1.gz
```

### `whatis`
Displays a one-line description of what a command does (from the man page).
```bash
whatis ls
# Output: ls (1) - list directory contents
```

## 3. Searching for Files
### `locate`
-   **Mechanism:** Searches a pre-built database (`mlocate.db`).
-   **Pros:** Extremely fast.
-   **Cons:** Results may be outdated if the database hasn't been updated.
-   **Update:** Run `sudo updatedb` to refresh the database.

```bash
locate *.conf
```

### `find`
-   **Mechanism:** Searches the live file system in real-time.
-   **Pros:** Accurate, powerful filtering options.
-   **Cons:** Slower than `locate`.

**Syntax:**
```bash
find <path> <criteria> <action>
```

**Common Criteria:**
-   `-name "pattern"`: Search by name (case-sensitive).
-   `-iname "pattern"`: Search by name (case-insensitive).
-   `-type f`: Search for files.
-   `-type d`: Search for directories.
-   `-size +10M`: Files larger than 10MB.
-   `-user <name>`: Files owned by a specific user.
-   `-mtime -7`: Modified in the last 7 days.

**Example:**
```bash
# Find all .log files in /var/log modified in the last 24 hours
find /var/log -name "*.log" -mtime -1
```

## 4. Searching Text Content (`grep`)
The `grep` command searches for patterns (strings or Regular Expressions) inside files.

**Syntax:**
```bash
grep [options] "pattern" [file]
```

**Options:**
-   `-i`: Ignore case.
-   `-r`: Recursive search (search all files in directories).
-   `-v`: Invert match (show lines that do **not** match).
-   `-n`: Show line numbers.
-   `-w`: Match whole words only.
-   `-l`: List only filenames containing the match.

**Example:**
```bash
# Search for "error" (case-insensitive) in all files under /var/log
grep -r -i "error" /var/log
```

## 5. Identifying File Types
In Linux, file extensions are optional. Use the `file` command to determine the actual type of a file based on its content/header.

```bash
file my_script.sh
# Output: Bourne-Again shell script, ASCII text executable
```

## 6. Key Takeaways
-   Use `locate` for speed, `find` for precision.
-   Use `grep` to search **inside** files.
-   Use `file` to check what kind of data a file contains.
---

## 4. 🏆 Master Example: Automated System Cleanup
Combine `find` with `xargs` to perform powerful bulk operations.

**Scenario:** Find all temporary files (`.tmp`) inside `/var/app` that are **larger than 50MB** and have not been modified in **over 30 days**, then delete them safely.

```bash
find /var/app -name "*.tmp" -type f -size +50M -mtime +30 -print0 | xargs -0 rm -v
```

### Breakdown:
1.  **`/var/app`**: Where to start searching.
2.  **`-name "*.tmp"`**: Matches files ending in .tmp.
3.  **`-type f`**: Ensures we only match files (not directories).
4.  **`-size +50M`**: Filters files larger than 50 Megabytes.
5.  **`-mtime +30`**: Filters files modified more than 30 days ago.
6.  **`-print0`**: Output file names separated by a `null` character (handles spaces in names safely).
7.  **`| xargs -0`**: Reads the null-separated list and passes it to the next command.
8.  **`rm -v`**: Removes the files and prints (**v**erbose) what it deleted.

> **Why `xargs`?** It's more efficient than `-exec` because it builds a command line for many arguments at once, rather than running a new process for every single file.
