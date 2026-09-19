#!/usr/bin/env bash

# This script asks the native GNOME gpaste daemon for your clipboard history
# and cleanly exports it to your custom backup file.

# Overwrite the file with the latest complete history
gpaste-client history > /home/karim/.cpyclib

echo "✅ Clipboard history synced to ~/.cpyclib"
