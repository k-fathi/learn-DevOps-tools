#!/bin/bash

###  Set Variables ###

time=$(date +%d-%m-%y_%H_%M_%S)

Backup_file=$1

Dest="/home/Heisenberg/learn-DevOps-tools/Learn_Bash_Shell_Scripting/Backups_project/Backup"

filename="file-backup-$time.tar.gz"

LOG_FILE="/home/Heisenberg/learn-DevOps-tools/Learn_Bash_Shell_Scripting/Backups_project/Backup/logfile.log"

##=========================================================================================================##


### Check if the Enterd file is empty or not ###

if [ -z "$Backup_file" ]
then
	echo "Please, Enter the Directory that you want to Backup" | tee -a "$LOG_FILE"
	exit 2
fi

##=========================================================================================================##
	 

## Check for the exit status ##
if [ $? -ne 2 ]
then
	## check if the backup file is already exists, avoid duplecation of files ##
	if [ -f "$filename" ]
	then
		echo "ERROR!: The file $filename is already exists" | tee -a "$LOG_FILE"
	else
		tar -czvf "$Dest/$filename" "$Backup_file"

		echo 
		echo "Backup Completed successfuly, Backup file: $Dest/$filename" | tee -a "$LOG_FILE"
	fi
fi





























