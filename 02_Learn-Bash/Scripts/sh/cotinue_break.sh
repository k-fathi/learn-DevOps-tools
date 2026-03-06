#!/bin/bash


# ignore even numbers
echo "Ignoring even range"
for i in $*
do 
	if [[ $(( $i % 2 )) -eq 0 ]];then
 
		continue
	else
		echo "number: $i"
	fi

done

echo Ignoring odd numbers""
for  i in $*
do
	if [[ $(( $i %  2)) -eq 1 ]];then

		continue
	else
		echo "number: $i"
	fi 
done



