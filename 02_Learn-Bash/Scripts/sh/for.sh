#!/bin/bash

echo "1 for internal range 1 2 3 4 5"
echo "2 for passed arguments with \$@ or \$*"
echo "3 for prace expansion {1..5}"
echo "4 for a declared array"
echo "5 for a contnet of a file /tmp/text"

read=(apple banana car dog egg fish glass hat iron jar)
file=$(cat /tmp/text)

read -p "Enter a method number to do a for: " selection  
case $selection in 
	1)		
		for num in 1 2 3 4 5
		do 
			echo -n "$num "
		done 
		;;

	2)
		for num in $@
		do 
			echo -n "$num "
		done
		;;
	
	3)
		for i in {1..5}
		do 
			echo "$i. I Love Linux"
		done
		;;
	
	4) 
		for i in ${arr[@]}
		do
			echo "element: $i"
		done
		;;
	5)
		for i in $file
		do
			echo " element from file:  $i"
		done
		;; 
	*)
		echo "Pleae, Enter a Valid Method number:"
		;;
esac
echo 
