#!/bin/bash
set -e

if [[ ! -d ~/.netstate ]]; then
	mkdir -p ~/.netstate/
fi

if [[ ! -f ~/.netstate/usage_2.log ]]; then
	touch ~/.netstate/usage_2.log
fi

if [[ ! -f ~/.netstate/total_tx.txt ]]; then
        touch ~/.netstate/total_tx.txt
else
        source ~/.netstate/total_tx.txt
fi

if [[ ! -f ~/.netstate/total_rx.txt ]]; then
        touch ~/.netstate/total_rx.txt
else
        source ~/.netstate/total_rx.txt
fi


interface=$(ip -br a s | grep "UP" | awk '{print $1}')
tx_src_file=/sys/class/net/"$interface"/statistics/tx_bytes
tx_dst_file=~/.netstate/tx.txt

rx_src_file=/sys/class/net/"$interface"/statistics/rx_bytes
rx_dst_file=~/.netstate/rx.txt

if [[ ! -f "$tx_dst_file" ]]; then
	touch $tx_dst_file
fi

if [[ ! -f "$rx_dst_file" ]]; then
	touch $rx_dst_file
fi

cat $tx_src_file >> $tx_dst_file
cat $rx_src_file >> $rx_dst_file

# ================= Upload ====================

last_tx=$(tail -n 1 $tx_dst_file)
pre_last_tx=$(tail -n 2 $tx_dst_file | head -n 1)
if [[ $last_tx -lt $pre_last_tx ]]; then
 	current_tx=$last_tx
else
	current_tx=$(($last_tx - $pre_last_tx))
fi
total_tx=$(($total_tx + $current_tx))

echo "total_tx=$total_tx" > ~/.netstate/total_tx.txt

# ==================== Download ===================== 

last_rx=$(tail -n 1 $rx_dst_file)
pre_last_rx=$(tail -n 2 $rx_dst_file | head -n 1)
if [[ $last_rx -lt $pre_last_rx ]]; then
	current_rx=$last_rx
else
	current_rx=$(($last_rx - $pre_last_rx))
fi
total_rx=$(($total_rx + $current_rx))

echo "total_rx=$total_rx" > ~/.netstate/total_rx.txt


total_usage=$(($total_tx + $total_rx))
{
	echo "[Download]" 
	echo "|__current download through interface $interface is: $( echo "scale=2;$current_rx / (1024*1024)" | bc)Mg"
	echo "|__total download through interface $interface is: $( echo "scale=2;$total_rx / (1024*1024)" | bc)Mg"
	echo "[Upload]"	
	echo "|__current uploadload through interface $interface is: $( echo "scale=2;$current_tx / (1024*1024)" | bc)Mg"
        echo "|__total uploadload through interface $interface is: $( echo "scale=2;$total_tx / (1024*1024)" | bc)Mg"
	echo "[Total Usage]"
	echo "|__total Usage: $( echo "scale=2;$total_rx / (1024*1024*1024)" | bc)Gb"
	echo "|__Qouta Remaining: $( echo "scale=2; (30 *1024*1024*1024- $total_usage) / (1024*1024*1024)" | bc)Gb" 
	echo "==================================================================="

} >> ~/.netstate/usage_2.log

watch cat ~/.netstate/usage_2.log



