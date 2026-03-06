#!/usr/bin/bash

set -e

Source=$1
Dist=$2
Type=$3

Date=$(date +%F_%H-%M-%S)
file=${Source##*/}-$Date.backup.tar

if [[ -z "$Source" ]] || [[ -z "$Dist" ]] || [[ ! -d "$Source" ]] || [[ ! -d "$Dist" ]]; then
	echo "ERROR. Please, Enter a valid Source or Distenation location."
	exit 1
else
	case $Type in 
		"gz"|"")
			com_arch="$file".gz
			tar -czf "$Dist"/"$com_arch" "$Source"
			echo ""$com_arch" is created and located in "$Dist""
			# exit 0
			;;
		bzip2)
			com_arch="$file".bzip
			tar -cjf "$Dist"/"$com_arch" "$Source"
			echo ""$com_arch" is created and located in "$Dist""
			# exit 0
			;;
		xz)
			com_arch="$file".xz
			tar -cJf "$Dist"/"$com_arch" "$Source"
			echo ""$com_arch" is created and located in "$Dist""
			# exit 0
			;;
		*)
			echo "ERROR. Please Enter a valid Type Argument. [gz|bzip2|xz]"
			exit 1
	esac
	find "$Dist" -name "*tar*" -type f -mtime "+7" -delete 
fi
