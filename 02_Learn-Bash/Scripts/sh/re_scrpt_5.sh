#!/usr/bin/env bash

read -p "Enter Your name: " name

if [[ -z $name  ]]; then
	echo "ERROR: Name can not be empty. Exiting."
	exit 1
else
	echo "Your name is: $name"
fi	

echo "Welcome! "
