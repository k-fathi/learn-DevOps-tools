# 30: Text Processing Tools

## 1. Introduction
Linux excels at text processing. Tools like `cut`, `tr`, and `tee` allow you to manipulate data streams efficiently from the command line.
> ![Linux Pipes & Redirection](screens/infographic_pipes.png)

## 2. Cut (`cut`)
Extract sections from each line of input.

**Options:**
-   `-d`: Delimiter (Default is tab).
-   `-f`: Fields to extract.
-   `-c`: Characters to extract.

```bash
# Extract usernames (1st field) from /etc/passwd (delimiter :)
cut -d ':' -f 1 /etc/passwd

# Extract characters 1-5 from each line
echo "Hello World" | cut -c 1-5
# Output: Hello

# Extract multiple fields
cut -d ',' -f 1,3 data.csv
```

## 3. Translate (`tr`)
Translate or delete characters. Reads from **Standard Input only** (use with pipes).

```bash
# Convert to uppercase
echo "hello" | tr 'a-z' 'A-Z'
# Output: HELLO

# Delete numbers
echo "pass123word" | tr -d '0-9'
# Output: password

# Squeeze repeated spaces (VERY USEFUL)
echo "Too    many    spaces" | tr -s ' '
# Output: Too many spaces

# Replace spaces with underscores
echo "my file name.txt" | tr ' ' '_'
# Output: my_file_name.txt
```

## 4. Tee (`tee`)
Read from Stdin and write to **both** Stdout (screen) **and** a file simultaneously.

**Options:**
-   `-a`: Append instead of overwrite.

```bash
# View output and save to log
ls -la | tee output.log

# Append to existing file
echo "New entry" | tee -a logfile.txt
```

### **Writing to Protected Files with `sudo`**
This is one of the most practical uses of `tee`.

> [!IMPORTANT]
> **Standard redirection (`>`) fails with `sudo`:**
> ```bash
> sudo echo "127.0.0.1 site.local" > /etc/hosts
> # ❌ Permission denied (because > runs as your user, not root)
> ```
> 
> **Correct approach using `tee`:**
> ```bash
> echo "127.0.0.1 site.local" | sudo tee -a /etc/hosts
> # ✅ Works! (tee runs as root)
> ```
> 
> **Why it works:** The `tee` command itself is executing with `sudo`, so it has permission to write to `/etc/hosts`.

**Common Real-World Examples:**
```bash
# Add entry to /etc/hosts
echo "192.168.1.100 server.local" | sudo tee -a /etc/hosts

# Modify sysctl settings
echo "net.ipv4.ip_forward=1" | sudo tee /etc/sysctl.d/99-custom.conf

# Append to protected log
echo "[$(date)] Deployment complete" | sudo tee -a /var/log/deploy.log
```

## 9. Summary
-   **cut:** Extract columns.
-   **sort:** Order lines.
-   **uniq:** Remove duplicates.
-   **wc:** Count lines/words.
-   **tr:** Translate/Delete chars.
-   **sed:** Stream Editor (Replace).
-   **awk:** Pattern scanning & processing (Advanced).

---

## 10. 🏆 Master Example: Generating an Access Report
**Scenario:** Generate a CSV report of the **Top 5 User Agents** accessing your website from the access log, converting spaces to underscores for the CSV format.

```bash
# Log format: IP - - [Date] "GET / HTTP/1.1" 200 1234 "-" "Mozilla/5.0..."

# 1. Extract User Agent (approximate, often fields 12+)
# 2. Sort to group them
# 3. Count occurrences
# 4. Sort by count (descending)
# 5. Take top 5
# 6. Replace spaces with underscores for CSV compatibility

cat access.log | cut -d '"' -f 6 | sort | uniq -c | sort -nr | head -n 5 | tr -s ' ' | tr ' ' ',' > top_agents.csv
```

> **Power:** You just built a custom log analytics tool using standard Linux utilities!

## 11. Key Takeaways
-   **`cut`** slices columns or characters from structured text.
-   **`tr`** transforms or deletes characters (case conversion, cleanup).
-   **`tee`** splits output to both screen and file(s).
-   **Use `sudo tee` to write to protected files** (never `sudo echo >`).
