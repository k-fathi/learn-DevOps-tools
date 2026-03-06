#!/usr/bin/env bash 
set -e


# =========== Create and Check the Directory ============
mkdir -p ~/.netstate/
quota_state_file=/tmp/netstate/quota_state.env
if [[ ! -f "$quota_state_file" ]]; then
	touch "$quota_state_file"
else
	source "$quota_state_file"
fi

# ========== install the package if not installed ========
dpkg -s net-tools &>> /dev/null
Exit_code=$?
if [[ ! "$Exit_code" -eq "0" ]]; then
         echo "net-tools package is not installed. Installation started."
         sudo apt install net-tools -y
fi

# ================ Define the interface ================
interface=$(ip -br a s | grep "UP" | awk '{print $1}')

x_byte=/sys/class/net/"$interface"/statistics/
x_dist=/tmp/netstate/


# =============== The TX-Process ==================

tx_dist_file=$x_dist/tx.txt
tx_byte_file="$x_byte"/tx_bytes
trnsmtd_value=$(cat "$tx_byte_file")
echo  "$trnsmtd_value" >> "$tx_dist_file" 

last_tx_read=$(tail -n 1 "$tx_dist_file")
echo "last_tx:$last_tx_read" >> "$quota_state_file"

pre_last_tx_read=$(tail -n 2 "$tx_dist_file" | head -n 1)
echo "pre_last_tx:$pre_last_tx_read" >> "$quota_state_file"

current_tx=$(("$last_tx_read" - "$pre_last_tx_read"))
echo "current_tx:$current_tx" >> "$quota_state_file"

total_tx=$(("$total_tx" + "$current_tx"))
echo "total_tx:$total_tx" >> "$quota_state_file" 

# ================ The RX-Process ====================-

rx_dist_file=$x_dist/rx.txt
rx_byte_file="$x_byte"/rx_bytes
rcvd_value=$(cat "$rx_byte_file")
echo  "$rcvd_value" >> "$rx_dist_file" 

last_rx_read=$(tail -n 1 "$rx_dist_file")
echo "last_rx:$last_rx_read" >> "$quota_state_file"

pre_last_rx_read=$(tail -n 2 "$rx_dist_file" | head -n 1)
echo "pre_last_rx:$pre_last_rx_read" >> "$quota_state_file"

current_rx=$(("$last_rx_read" - "$pre_last_rx_read"))
echo "current_rx:$current_rx" >> "$quota_state_file"

total_rx=$(("$total_rx" + "$current_rx"))
echo "total_rx:$total_rx" >> "$quota_state_file"

total_use=$(($total_tx + $total_rx))
echo "total_use:$total_use" >> "$quota_state_file"


# ============== Documenting the values =============
{
	echo "The Current TX:RX through interface $interface is:$(($current_tx/(1024*1024)))Mg:$(($current_rx/(1024*1024)))Mg"
	echo "The Total TX:RX through interface $interface is: $(($total_tx/(1024*1024)))Mg:$(($total_rx/(1024*1024)))"
	echo "The Total Internet Usage is $total_use"
	echo "The remaining qouta is $(((30*1024*1024 - $total_use)/(1024*1024*1024)))"
} >> "$x_dist"/usage.txt 

echo > "$quota_state_file"
