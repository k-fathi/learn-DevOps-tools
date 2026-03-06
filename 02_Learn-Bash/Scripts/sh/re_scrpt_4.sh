#!/usr/bin/env bash

read -p "Please Enter a 3 Digit Number: " num
case $num in 
	[0-9])
		echo "You Entered a single Digit Number: $num"
		;;
	[0-9]\{2})
		echo "You Entered a double Digit Number: $num"
		;;
	[0-9]\{3})
		echo "You Entered a trible Digit Number: $num"
		;;
	*)
		echo "Please Entered a right number"
esac

