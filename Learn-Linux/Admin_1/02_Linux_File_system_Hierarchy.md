# Linux File System Hierarchy:
> ## 🌳 The Single Inverted Tree Hierarchy

![Linux File System Tree 1](screens/image-1.png)
![Linux File System Tree 2](screens/image-2.png)

```plaintext
[    /   ]                  # Root file system, the parent of all directories
[ /bin/ -> /usr/bin/ ]      # Essential user command binaries
[ /boot/ ]                  # Boot loader files for system startup
[ /dev/  ]                  # Device files (hardware and virtual devices)
[ /etc/  ]                  # System-wide configuration files
[ /home/ ]                  # Home directories for regular users
[ /root/ ]                  # Home directory for the root user
[ /run/  ]                  # Runtime data for processes since last boot
[ /sbin -> /usr/sbin/ ]     # Essential system binaries (root/admin commands)
[ /tmp/  ]                  # Temporary files (cleared on reboot)
[ /usr/  ]                  # User programs, libraries, documentation, and more
[ /var/  ]                  # Variable data (logs, databases, spool files)
[ /lib/ -> /usr/lib ]       # Shared libraries for essential binaries
[ /lib64/ -> /usr/lib64 ]   # 64-bit shared libraries
[ /media/ ] & [ /mnt/ ]     # Mount points for removable and temporary devices
```
