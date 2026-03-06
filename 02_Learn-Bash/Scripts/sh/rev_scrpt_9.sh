#!/usr/bin/env bash
set -i 
file="$1"

sed '/^$/ d' $file > $2 

echo "Blanck Spaces are removed from "$1". The output saved in "$2""

echo "$2 now is: " 
cat $2
echo 
sed -i 's/K8s/Kubernetes/' $2
echo "$2 now is: "
cat $2

