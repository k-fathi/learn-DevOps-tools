# 03: Inodes and Links

## 1. File System Basics
Before understanding Inodes, it is important to understand how disks are structured:
-   **Partition Table:** Defines blocks/partitions on the disk.
-   **Formatting:** Assigns a file system type (e.g., `ext4`, `xfs`, `btrfs`).
-   **Inode Table:** A database stores metadata for every file on the system.

## 2. What is an Inode?
An **Index Node (Inode)** allows the file system to track files. It stores metadata but **NOT** the filename or the actual data content.

### Inode Metadata Includes:
-   Inode Number (Unique ID)
-   File Type & Permissions
-   Owner & Group
-   File Size
-   Timestamps (Creation, Modification, Access)
-   **Pointers** to the data blocks where content is stored.

> **Note:** Use `ls -li` to view the Inode number of files.


## 3. Links in Linux
Links allow multiple filenames to refer to the same file data.

### Visual Comparison
> ![Hard vs Soft Links](screens/infographic_links.png)

> ![Hard vs Soft Links Diagram](screens/image-7.png)

### A. Soft Link (Symbolic Link)
-   **Concept:** A pointer to another **filename** (like a shortcut in Windows).
-   **Behavior:** If the original file is deleted, the link becomes broken (dangling).
-   **Scope:** Can link across different file systems (partitions).
-   **Syntax:**
    ```bash
    ln -s <target_file> <link_name>
    ```

### B. Hard Link
-   **Concept:** A pointer directly to the **Inode** of the file.
-   **Behavior:** Even if the original filename is deleted, the data remains accessible via the hard link. The data is only deleted when **all** hard links (reference count) reach zero.
-   **Scope:** Must be on the **same** file system. Cannot link directories.
-   **Syntax:**
    ```bash
    ln <target_file> <link_name>
    ```

## 4. Summary
-   **Inode:** Metadata about a file (permissions, size, owner).
-   **Hard Link:** Points to Inode. Same file, different name.
-   **Soft Link:** Points to Path. Shortcut.

---

## 5. 🏆 Master Example: Auditing Deployment Links
**Scenario:** You are deploying a web application. You use a symbolic link `/var/www/current` to point to the active version of your app (e.g., `/var/www/releases/v1.0`). You need to verify where the live site is pointing and update it to `v2.0` atomically.

```bash
# 1. Check where 'current' points to
ls -l /var/www/current
# Output: lrwxrwxrwx 1 root root 20 Oct 5 10:00 /var/www/current -> /var/www/releases/v1.0

# 2. Update the link to point to v2.0 (Force update with -fn)
ln -sfn /var/www/releases/v2.0 /var/www/current

# 3. Verify the switch
ls -l /var/www/current
# Output: lrwxrwxrwx 1 root root 20 Oct 5 10:05 /var/www/current -> /var/www/releases/v2.0
```

> **Why Soft Links?** This allows "Zero Downtime Deployments". You deploy v2.0 in the background, and the "switch" takes microseconds.