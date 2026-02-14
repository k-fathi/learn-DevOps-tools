# 19: Transferring Files

## 1. Introduction
Transferring files securely between servers is a daily task in Linux administration. We primarily use SSH-based tools like `scp`, `sftp`, and `rsync`.

## 2. SCP (Secure Copy)
A simple tool to copy files over SSH.
*Note: Deprecated in some modern distributions in favor of rsync/sftp, but still widely available.*

```bash
# Push: Local -> Remote
scp file.txt user@remote:/tmp/

# Pull: Remote -> Local
scp user@remote:/var/log/syslog .

# Recursive (Directories)
scp -r folder/ user@remote:/home/user/
```

## 3. SFTP (Secure FTP)
Interactive file transfer session.

```bash
sftp user@remote
```
**Commands inside SFTP:**
-   `put file`: Upload file.
-   `get file`: Download file.
-   `ls`: List remote files.
-   `lls`: List local files.

## 4. Summary
-   **scp:** Simple, secure copy (like `cp`).
-   **rsync:** Smart, incremental sync (efficient).

---

## 5. 🏆 Master Example: Incremental Remote Backup
**Scenario:** You have a local project folder `myproject/` and you want to back it up to a remote server `backup-server`. You only want to send **changed files** to save bandwidth, and you want to delete files on the remote side if you deleted them locally (exact mirror).

```bash
# rsync options:
# -a: Archive mode (preserves permissions, times, symbolic links)
# -v: Verbose (show what's happening)
# -z: Compress data during transfer (faster)
# --delete: Delete files on destination that don't exist on source
rsync -avz --delete myproject/ user@backup-server:/var/backups/myproject/
```

> **Warning:** Be careful with `--delete`. It WILL delete files on the remote server forever!

## 6. Rsync (Remote Sync)
The most powerful tool. It synchronizes files, transferring **only differences** (deltas), making it efficient for backups and large transfers.

**Syntax:**
```bash
rsync [options] source destination
```

**Common Options (`-avzP`):**
-   `-a`: Archive mode (Preserve permissions, ownership, timestamps, symlinks).
-   `-v`: Verbose.
-   `-z`: Compress data during transfer.
-   `-P`: Show progress bar.

**Examples:**
```bash
# Sync local folder to remote (Push)
rsync -avzP /local/dir/ user@remote:/remote/dir/

# Sync remote folder to local (Pull)
rsync -avzP user@remote:/var/www/html/ /backup/html/
```

## 5. Key Takeaways
-   Use **`scp`** for quick, simple copies.
-   Use **`rsync`** for backups, large directories, or resuming interrupted transfers.
-   Use **`sftp`** for interactive browsing/transfer.