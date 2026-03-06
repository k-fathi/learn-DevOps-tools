#!/bin/bash

file=$1

while IFS=: read -r f1 f2 f3 f4 f5 f6 f7
do 
	echo "User $f1 has a shell $f7"

done < $file
