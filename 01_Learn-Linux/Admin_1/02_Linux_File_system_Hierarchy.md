# 02: Linux File System Hierarchy

## 1. Introduction
Linux follows a **Single Inverted Tree** structure. Everything starts from the **Root Directory** (`/`), and all other directories and files branch off from there. Unlike Windows, which uses drive letters (C:, D:), Linux mounts devices to specific directories within this tree.

### Visual Reference
> ![Linux File System Hierarchy](screens/infographic_filesystem.png)

## 2. The File System Tree

```bash
/                           # Root Directory (Parent of all)
├── bin -> usr/bin          # Essential User Binaries (ls, cp, cat)
├── boot                    # Boot Loader Files (kernels, initrd)
├── dev                     # Device Files (hard drives, tty)
├── etc                     # Configuration Files (system-wide)
├── home                    # User Home Directories
├── lib -> usr/lib          # Shared Libraries
├── media                   # Removable Media (USB, CD-ROM) - Auto-mounted
├── mnt                     # Temporary Mount Points - Manually mounted
├── opt                     # Optional Add-on Software
├── proc                    # Process Information (Virtual filesystem)
├── root                    # Root User's Home Directory
├── run                     # Runtime Data (PIDs, sockets)
├── sbin -> usr/sbin        # System Binaries (root-only commands)
├── srv                     # Service Data (web server files, ftp)
├── sys                     # System Hardware Info (Virtual filesystem)
├── tmp                     # Temporary Files (Deleted on reboot)
├── usr                     # User Programs & Data (Secondary hierarchy)
└── var                     # Variable Data (Logs, Spools, Cache)
```

## 3. Key Directories Explained

| Directory | Purpose | Guidance |
| :--- | :--- | :--- |
| **/bin** & **/usr/bin** | Essential command binaries. | Do not manually add files here. Use package managers. |
| **/sbin** & **/usr/sbin** | System administration binaries. | Typically requires `sudo` or root privileges. |
| **/usr/local/bin** | User-compiled or manually installed binaries. | Safe place for custom scripts/tools to avoid system conflicts. |
| **/etc** | Configuration files. | Back up this directory before major changes. |
| **/var** | Logs and dynamic data. | Monitor `/var/log` for system issues. |
| **/tmp** | Ephemeral temporary files. | Cleared on reboot. |
| **/var/tmp** | Persistent temporary files. | Survives reboots. |

## 3. Key Takeaways
-   **/** is the root of everything.
-   **/home** contains user data.
-   **/etc** contains configuration files.
-   **/var** contains variable data like logs.
-   **/bin** & **/usr/bin** contain executable programs.

---

## 4. 🏆 Master Example: Extracting System Info from `/proc`
**Scenario:** The `/proc` directory is a virtual filesystem containing runtime system information. You need to extract the **CPU model name** and **Total RAM** directly from the kernel interface.

```bash
# 1. Get CPU Model
cat /proc/cpuinfo | grep "model name" | head -n 1
# Output: model name : Intel(R) Core(TM) i7-8550U CPU @ 1.80GHz

# 2. Get Total Memory (in Human Readable format roughly)
cat /proc/meminfo | grep "MemTotal"
# Output: MemTotal:       16303284 kB
```

> **Insight:** Commands like `lscpu` and `free` actually just read these files and format them for you!

## 5. Key Takeaways
-   **`/` (Root)** is the top-level directory.
-   **`/root`** is the home folder for the superuser, distinct from `/`.
-   **`/home`** contains personal files for regular users.
-   **Modern Linux** often merges `/bin`, `/sbin`, and `/lib` into `/usr`.
