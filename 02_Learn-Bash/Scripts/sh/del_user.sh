#!/bin/bash


### Function to delete user ###

function del_users_fun() {
	echo "This scrpit for deleteing users"

	read -p "Enter user you want to delete: " username

	grep -wq $username /etc/passwd

	if [ $? == 0 ]; then
		userdel -r $username &> /dev/null
		echo "User $username is deleted successfully"
		exit 0
	else
		echo "This user is not even exist."
		exit 1
	fi
}
