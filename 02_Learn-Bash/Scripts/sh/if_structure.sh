#!/bin/bash

n1=$1
n2=$2
name1=$3
name2=$4

if ((n1 == 5));
then
	echo "$n1 = 5"
elif ((n1 == 10)) && ((n2 > 7));
then
	echo "$n1 = 10 and $n2 is gretear than 7"
else
	echo "Try other numbers."
fi


if [ "$name1" == "karim" ] && (($# == 3))
then 
	echo "hello $name1"
elif [ "$name1" == "karim" ] && [ "$name2" == "fathy" ]
then
	echo "Hello $name1 and welcome $name2"
else
	echo "You forgot to enter arguments"
fi
