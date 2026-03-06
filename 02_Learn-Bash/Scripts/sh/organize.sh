#!/usr/bin/env bash

set -eu

DIR=$1

if [[ ! -d "$DIR" ]] || [[ "$DIR" = "" ]]; then 
    echo "ERROR. Please, insert a valid location."
    exit 1
else
    for item in "$DIR"/*
    do
        if [[ ! -f "$item" ]]; then
	    continue
	else
	    EXTENSION=${item##*.}
	    mkdir -p "$DIR"/"$EXTENSION"/
	    mv "$item" "$DIR"/"$EXTENSION"/
	fi
    done
fi
