#!/usr/bin/bash

set -e

Log_File=$1

if [[ -z "$Log_File" ]]; then
	echo "ERROR. Please enter an access.log file."
	exit 1
else
	awk '{if ($9 == "500" || $9 == "404") {print $1}}' "$Log_File" | sort | uniq -c  | sort -rn | head -n 3 | awk '{print ""$2" tried "$1" times" }'
fi
