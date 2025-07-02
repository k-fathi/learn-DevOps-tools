# Manage Network

## Network Service

```bash
systemctl status NetworkManager.service
```

## DNS Configurations:
### `/etc/resolv.conf`
- Configure the IP address of the DNS server.

### `/etc/hosts`
- A simple text file that associates IP addresses with hostnames (local DNS).
- One line per IP address.


## Namming NICs
### Traditional Way: `eth0`, `eth1`, etc.
- This method is not descriptive and can be confusing, especially in systems with multiple NICs.
- It doesn't provide information about the type of connection or its location.
- The numbering can be arbitrary and doesn't indicate the physical or logical arrangement of the NICs.


### Modern Way: `enp0s3`, `wlp1s2`, etc.
- This method uses a more descriptive naming convention based on the physical location of the NICs.
- It provides information about the type of connection, its location on the motherboard, and its slot number.
- The naming convention is based on the following structure:
- **Structure**: `Type | Connection | Number`

1. **Type**:
   - Ethernet: `en`
   - Wireless: `wl`
   - Bridge: `br`
   - Team: `team`
   - Virtual: `vir`
   - WAN: `ww`

2. **Connection Type**:
   - `o` for onboard
   - `p` for port
   - `s` for slot

   **Examples**: `enp0s3`, `ens1`, `eno1`, `wlp1s2`

---

## Working Commands

Networking configurations and commands require `net-tools` package to be installed:

```bash
sudo apt install net-tools   # For Debian-based systems
sudo yum install net-tools   # For Red Hat-based systems

### Common Commands:

```bash
ip link show               # Show all device interfaces/links/NIC ports
ip -s link show            # Show all interfaces with statistics
ifconfig                   # Old command to show interfaces and addresses
ip address show            # Newer command to preview interfaces and addresses
ip -br a s                 # Display interfaces and their IP addresses (brief)
ip -s link show <NIC name> # Show info about a specific interface with statistics
watch ip -s link show <NIC name> # Real-time updates for a specific interface

ip route                   # Display the routing table

nmcli device status        # Show device status
nmcli device connect <connection profile>   # Connect a network device
nmcli device disconnect <connection profile> # Disconnect a network device

hostname                   # Show the hostname
hostname <hostname>        # Set a temporary hostname
hostnamectl set-hostname <hostname> # Set a permanent hostname

nmtui                      # Interactive network manager

ping <ip-address>          # Check connectivity
ping <ip-address> -c <count> # Send a specific number of packets

tracepath <destination>    # Trace the route to a destination
# Requires the `ip-utils-tracepath` package

arp -a                     # Show surrounding devices
ss --help                  # Investigate sockets

netstat -[n, t, u, l]      # Show network statistics
# Options: n=port_number, t=TCP, u=UDP, l=Listen
```

---

## Network Manager.

### Tools: `nmcli` & `nmtui`

### Managing Your NIC
- NICs can be managed through hardware (device) or software (connection/configuration).
- Use `nmcli` to manage network devices and connections.
- Use `nmtui` for an interactive management interface.

```bash
nmcli device show          # Show device details
nmcli connection show      # Show connection profiles
```

### Managing Profiles/Connections
You can perform the following actions:
- Show 
- Add 
- Modify
- Delete
- Bring up (`up`)
- Bring down (`down`)

```bash
nmcli connection show                     # Display all connection profiles
nmcli connection show <connection>        # Show details of a specific profile
nmcli connection add con-name <name> type <type> ifname <interface> autoconnect <yes/no> # Add a new connection
nmcli connection up <profile>             # Activate a specific profile
nmcli connection down <profile>           # Deactivate a specific profile
nmcli connection modify <profile> <options> # Modify a connection profile
```

### Notes:
- Use `manual` to assign IP addresses manually and disable DHCP:
```bash
nmcli con mod <profile> ipv4.method manual
```

- Add/remove DNS entries using `+` or `-`:
```bash
nmcli connection modify <profile> +ipv4.dns <DNS IP>
```
- Only one profile can be active on a device at a time.
- Configuration files are stored in:
  - `/etc/sysconfig/network-scripts/ifcfg-[connection]` (RHEL 7 & 8)
  - `/etc/NetworkManager/system-connections/` (RHEL 9)

---

## `nmtui`
=> All of the above can also be managed interactively using `nmtui`.
---

## DNS Configurations:
### `/etc/resolv.conf`
- Configure the IP address of the DNS server.

### `/etc/hosts`
- A simple text file that associates IP addresses with hostnames (local DNS).
- One line per IP address.