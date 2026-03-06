#!/bin/bash

# Calculator Using bc:

#read -p "Please Enter the First Number: " F_num
#read -p "Please Enter the Second Number: " S_num
#read -p "Please Enter the Operation (+,-,*,/,^): " Operation

#result=$(echo $F_num$Operation$S_num |bc)
#echo "## Using bc ##"
#echo "$F_num $Operation $S_num = $result"
#====================================================#

# Using exper:
#read -p "Enter the First Number: " F_num
#read -p "Enter the Second NUmber: " S_num
#read -p "Please Enter the OPeration (+,-,*,/,^): " Operation
#echo "## Using expr ##"
#result=$(expr $F_num $Operation $S_num)
#echo "$F_num $Operation $S_num = $result"
#====================================================#

read -p "Enter an operation:(+,-,*,/,^): " num1 operation num2

if [[ "$operation" == "+" || "$operation" == "-" || "$operation" == "*" || "$operation" == "/" ]]
then
	result=$(($num1 $operation $num2))
	echo "$num1 $operation $num2 = $result"

elif [[ $operation == "^" ]]
then
	result=$(echo $num1 ^ $num2 | bc ) 
	echo "$num1^($num2) = $result"

else 
	echo "Enter a valid operation"

fi


#END

