#!/bin/bash

read -p "Do you know Linux? " answer

case $answer in
	yes | YES | Yes | Y | y | ofcourse | abslutely | definetely)
		echo "Exellent, go ahead."
		;;
	no | NO | No | n |N )
		echo "You have to learn it right know"
		;;
	*)
		echo "answer me!"
		;;
esac
 
