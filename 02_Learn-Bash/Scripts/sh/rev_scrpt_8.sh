#!/bin/bash

file=/etc/passwd

while IFS=: read -r f1 f2 f3 f4 f5 f6 f7 
do
	#if [ grep "karim" "$line" ]; then
	#	echo "$line"	
	#    	exit 0
	#else
	#	echo "No. Skipping!"
	#fi
	
	echo "$f1, $f3, $f6" >> ./passwd.txt

done < $file 
