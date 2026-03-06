#!/bin/bash
set -eu
DISK_USAGE=$(df -h | grep -w "/" | awk '{print $5 }' | tr -d "%")
MEM_PERC=$(free --mega | grep Mem | awk '{total=$2;used=$3;percentage = (used/total)*100 ; print int(percentage)}')
CPU_USAGE=$(top -bn1 | grep -i "cpu(s)" | awk '{print int(100 - $8)}')

echo "Disk Usage: $DISK_USAGE%"
echo "Memory Usage: $MEM_PERC%"
echo "CPU Usage: $CPU_USAGE%"
echo 
if [ "$DISK_USAGE" -ge 80 ] || [ "$MEM_PERC" -ge 80 ] || [ "$CPU_USAGE" -gt 80 ]; then
	echo "System Error. Please Check the memory, disk space and the cpu usage"
else
	echo "Don't Panick. You are pretty good till now."
fi

