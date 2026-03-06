#!/usr/bin/env bash

## Script to design a simple calcutator
echo "-------------------------------------"
echo "Hello, Geek! Try this simple calculator"
echo
read -p "Enter an Operation (+,-,*,**,/): " Operation

read -p "Please, Enter the first Number: " num1
read -p "Please, Enter the second Number: " num2

echo  -----------Using\$\(\( \)\)---------------
result=$(($num1 $Operation $num2))

echo "$num1 $Operation $num2 = $result"

echo 
echo "------------- Using bc ---------------"

echo "$num1 $Operation $num2 = $(echo "$num1$Operation$num2" | bc)"

echo
echo "----------- Using expr----------------"

result=$(expr $num1 $Operation $num2)
echo "$num1 $Operation $num2 = $result"

echo
echo "----------- Using let----------------"

let result=$num1$Operation$num2
echo "$num1 $Operation $num2 = $result"


echo
echo "End of Script"
echo "----------------------------------------"
