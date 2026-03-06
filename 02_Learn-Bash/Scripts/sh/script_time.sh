#!/bin/bash

start=$(date +%s) 

sleep $1

end=$(date +%s)

result=$((end - start))
echo "The script time is $result"

