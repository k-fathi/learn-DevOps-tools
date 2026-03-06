#!/bin/bash
#------------------- [ ] ------------------#
#if [[ "$1" =~ [a-z0-5#] ]]
#then
#	echo "The variable contains letters [a-z] or numbers [0-5] or '#'"
#else
#	echo "The variable contains letters [A-Z] or [6-9] or both"
#fi


#------------------- ^ --------------------#

if [[ $1 =~ [^a-zA-Z] ]]
then 
	echo "doesn't contain a digit characters from [0-9]"
else
	echo "This varaible contains only alphabet characters"
fi
