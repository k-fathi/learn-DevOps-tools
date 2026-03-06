#!/bin/bash

set -e

FILE=$1

if [[ -z "$FILE" ]]; then
	echo "ERROR. Please Enter the Location of the file."
	exit 1

elif [[ ! -f "$FILE" ]]; then
	echo "ERROR. Please enter a valid file location or enter a file not a drectory."
	exit 1
else
	while IFS="," read -r USER GROUP
	do
		if ! grep -q "$USER" /etc/passwd ; then 
			sudo useradd -m -c "$USER" -s /bin/bash "$USER"
			echo ""$USER" is created."	
		fi 
		if ! grep -q "$GROUP" /etc/group ; then 
			sudo groupadd "$GROUP"
		fi	
		sudo usermod -aG "$GROUP" "$USER"	
		echo "SUCCESS: $USER is now a member of $GROUP."
	done < "$FILE"

fi
