#!/bin/bash

if (($1 > 2)); then
	ex_s=$?
	echo "$1 is greater than 2"
	echo "using (( )): Exit status $ex_s"
else
	ex_s=$?
	echo "$1 smaller than 2"
	echo "Using (( )): Exit status $ex_s"
fi
