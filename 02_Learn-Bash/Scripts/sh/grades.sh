#!/bin/bash

read -p "Enter your grades:" grade

case $grade in
	8[5-9] | 9[0-9] | 100)
		echo "Your score is A"
		;;
	7[5-9] | 8[0-4])
		echo "Your score is B"
		;;
	6[5-9] | 7[0-4])
		echo "Your score is C"
		;;
	*)
		echo "Your scroe is F"
		;;
esac
