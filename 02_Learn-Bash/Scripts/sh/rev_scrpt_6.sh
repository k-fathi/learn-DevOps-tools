#!/usr/bin/env bash

for num in {1..20}
do
	if [[ $num -eq 10  ]] || [[ $num -eq 15  ]]; then 
		echo " This number is 10 or 15"
	else
		echo "This number is : $num"
	fi

done 
