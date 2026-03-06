#!/bin/bash

input_file=$1

directed_to="./sed_2.0.txt"

sed '/^$/ d' $input_file > $directed_to

cat $directed_to
