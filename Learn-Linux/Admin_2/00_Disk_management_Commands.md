# Commands: 

## lsblk [option] [device]

```bash
lsblk
# output:
# Lists information about all available or the specified block devices.
```

**Options:**
- `-f` : Shows filesystems.
- `-p` : Prints full device paths.
- `-a` : Lists all devices.
- `-o <column>` : Specifies columns to display (e.g., NAME,SIZE,TYPE).
- `-d` : Lists only block devices, not partitions.

**Examples:**
```bash
lsblk -f
lsblk -p
lsblk -o NAME,SIZE,TYPE
lsblk -d
```

---

## df [option] [file]

```bash
df
# output:
# Reports file system disk space usage.
```

**Options:**
- `-h` : Human-readable output (e.g., 1K, 234M, 2G).
- `-T` : Shows filesystem type.
- `-a` : Includes dummy filesystems.
- `-i` : Displays inode information.
- `-t <type>` : Limits listing to specified filesystem type.

**Examples:**
```bash
df -h
df -T
df -a
df -i
df -t ext4
```
