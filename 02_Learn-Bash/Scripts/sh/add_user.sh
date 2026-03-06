#!/bin/bash 



## Function to add users ## 

function add_users_fun() {

echo "This script for adding new user"

### Get The User Data ###

read -p "Enter your name: " username

read -sp "Enter your password: " password
echo 

## check if this user is already exists ##

if grep -wq "$username" /etc/passwd
then
	echo "This user is already exists. "
	exit 1
else
# choosing the prore shell
	echo "chose your prefared shell: "
	select shell in bash sh zsh
	do
		if [ $shell == "bash" ]
       		then
			user_shell="/bin/bash"
		elif [ $shell == "sh" ]
		then
			user_shell="/bin/sh"
		elif [ $shell == "zsh" ]
		then
			user_shell="/bin/zsh"
		else
			exit 1
		fi
		break
	done
fi

## useradd command

useradd $username -m -d /home/$username -p $password -s $user_shell

echo "Congrats, the user $username has been created successfully"

}
