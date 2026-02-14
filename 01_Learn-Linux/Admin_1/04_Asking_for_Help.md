# 04: Asking for Help in Linux

## 1. Introduction
Linux provides powerful built-in documentation tools. You do not always need an internet connection to find command syntax or configuration details.

## 2. Quick Help (`--help`)
Most commands support the `--help` or `-h` flag to display a brief summary of usage and options.

```bash
ls --help
mkdir --help
```

## 3. Manual Pages (`man`)
The `man` command provides the definitive documentation for commands, configuration files, and system calls.

### Syntax
```bash
man <command>
```

### Man Page Sections
The manual is divided into sections. The most important are:
1.  **User Commands** (Executable programs)
2.  **System Calls**
3.  **Library Calls**
4.  **Device Files**
5.  **Configuration Files** (e.g., `/etc/passwd`)
8.  **System Administration Commands** (Root commands)

### Examples
```bash
# View help for the 'passwd' command (Section 1)
man passwd

# View help for the '/etc/passwd' file structure (Section 5)
man 5 passwd
```

### Navigation Keys
| Key | Action |
| :--- | :--- |
| `Space` | Scroll down one page |
| `Enter` | Scroll down one line |
| `/` | Search forward |
| `n` | Next search result |
| `N` | Previous search result |
| `q` | Quit |

## 4. Keyword Search (`-k`)
If you don't know the exact command name, search by description using `-k` (equivalent to `apropos`).

```bash
man -k "partition"
# Lists all commands related to partitioning
```

## 5. Info Pages (`info` & `pinfo`)
Some GNU tools provide more detailed documentation via `info`.
```bash
info ls
pinfo ls  # (Colored, more user-friendly version)
```

## 6. Documentation Files
Many packages install detailed docs (READMEs, examples) in:
`
/usr/share/doc/
`

## 6. Summary
-   `--help`: Small tip.
-   `man`: Complete manual.
-   `tldr`: Practical examples (if installed).

---

## 7. 🏆 Master Example: Mastering `man` Pages
**Scenario:** You need to create a `tar` archive but forgot the exact flags to verify it after creation. Instead of Googling, you use `man` effectively.

```bash
# 1. Open the manual
man tar

# 2. Search for "verify" (Type /verify inside the man page)
/verify
# Press 'n' to go to next match until you find -W or --verify

# 3. Search for "gzip" (Type /gzip)
/gzip
# Finds -z option

# 4. Quit
q
```

> **Result:** You quickly learned that `tar -W` verifies an archive, without leaving your terminal.