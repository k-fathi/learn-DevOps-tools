#!/bin/bash


echo "Name of the script: $0"
echo "Number of argument passed: $#"
echo "Argument passed: $1, $2, $3, $4, $5."
echo ---------
echo "argument[\$*]: $*"
echo "argument[\$@]: $@"
echo ---------
sleep 10 &
echo "PID of last process:$!"
$1
echo "Exit status: $?"
#END
