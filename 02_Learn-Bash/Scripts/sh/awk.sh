#!/bin/bash

awk ' BEGIN{FS=":"; OFS=" --- "; RS="\n"; ORS="\n"}
{

	if ($7 == "/bin/bash"){
	print NR,$1
	}
} ' /etc/passwd
