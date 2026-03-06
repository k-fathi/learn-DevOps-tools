#!/bin/bash

go_ahead=1
exit_code=0
echo "----------------------------------------"
echo "|        Welcome to my Calculator      |"
echo "----------------------------------------"

while [ $go_ahead -eq 1 ]
do 
	read -p "Enter number 1: " num1
	read -p "Enter number 2: " num2
	if [[ $num1 =~ ^[0-9]+([.][0-9]+)?$ &&  $num2 =~ ^[0-9]+([.][0-9]+)?$ ]]
	then
		echo "Please Select an Operation: " 

		select operation in add subtract multiplication division power "square root" modulus
		do
			case $operation in 
				add)
					echo "$num1 + $num2 = $(echo "$num1 + $num2" | bc)"
					exit_code=0
					;;
				subtract)
					echo "$num1 - $num2 = $(echo "$num1 - $num2" | bc)"
					exit_code=0
					;;
				multiplication)
					echo "$num1 * $num2 = $(echo "$num1 * $num2" | bc)"
					exit_code=0
					;;
				division)
					if [[ $num2 =~ 0+([.]0+)? ]]
					then
						echo "/!\ You can not divide by zero."
						exit_code=1
					else
						echo "$num1 / $num2 = $(echo "scale = 4 ; $num1 / $num2" | bc )"
						exit_code=0
					fi
					;;
				power)	
					echo "$num1^($num2) = $(echo "$num1 ^ $num2" | bc)"
					exit_code=0
					;;
				"square root")
					exit_code=1
					while [ $exit_code -eq 1 ]
					do
						echo "which number?!"
						select selected_number in $num1 $num2
						do
							if [ "$REPLY" -eq 1 ] || [ "$REPLY" -eq 2 ]
							then 
								echo "sqrt($selected_number) = $(echo "scale = 4 ; sqrt($selected_number)" | bc )"
								exit_code=0
								break
							else
								echo "Please, Choose form the list"	
								exit_code=1
								continue
							fi
						done
					done
					;;
				modulus)
					echo "$num1 % $num2 = $(echo "$num1 % $num2" | bc)"
					exit_code=0
					;;
				*) 
					echo "Please Select a valid operation"
					exit_code=1
				esac
			echo 
			read -p "Do you want to continue? " answer
			correct_answer=0	
			while [ $correct_answer -eq 0  ]
			do 
				case $answer in 
					yes | YES | Y | y | Yes | ok | OK | Ok )
						go_ahead=1
						correct_answer=1
						;;

					no | NO | N | n | No )
						go_ahead=0
						correct_answer=1
						;;
					*) 
						echo "Please, say (yes | no )"
						correct_answer=0
						;;
				esac	
			done
			break 
		done 			
	else
		echo "Please, Enter valid numbers"
		continue
	fi
done

echo 
echo "----------------  END OF CODE  --------------"
echo "|       Thanks to use my calculator         |"
echo "---------------------------------------------"
exit $exit_code

