#!/usr/bin/env bash

array_name=(item0 item1 item2 item3 item4)
echo "the first element item0:-> ${array_name}"
echo "all elements:-> ${array_name[@]}"
echo "number of all elements:-> ${#array_name[@]}"
echo "item2:-> ${array_name[2]}"
echo "indeces:-> ${!array_name[@]}"
echo "from item with index 1 to item with index3 item1, item2, itme3:-> ${array_name[@]:1:3}"
