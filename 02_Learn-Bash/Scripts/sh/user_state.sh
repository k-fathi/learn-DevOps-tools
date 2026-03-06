#!/bin/bash

## Script to add and  delete users ##

source add_user.sh
source del_user.sh

echo "Please, select what do you want to do: "

select requist in "add users" "delete users"
do 
	if [ $requist == "add users" ]; then
		add_users_fun
		break
	elif [ $requist == "delete users" ]; then 
		del_users_fun
		break
	else
		exit 1
	fi
done 
