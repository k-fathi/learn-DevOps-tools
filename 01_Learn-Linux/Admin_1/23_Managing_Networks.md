# 23: Managing Networks

## 1. Introduction
Networking is the backbone of modern computing. Linux provides powerful tools to configure, monitor, and troubleshoot network connections.

### Network Configuration Guide
> ![Network Configuration in Linux](screens/infographic_networking.png)

## 2. Naming Convention
Network Interface Cards (NICs) have specific names:
-   **Old Style:** `eth0`, `wlan0` (Unpredictable).
-   **Modern Style:** `enp3s0`, `wlp2s0` (Predictable based on physical location).
    -   `en` = Ethernet.
    -   `wl` = Wireless.
    -   `p` = PCI bus number.
    -   `s` = Slot number.

## 3. Viewing Configuration
> [!NOTE]
> `ifconfig` and `netstat` are **deprecated**. Use `ip` and `ss` instead.

```bash
# Show IP addresses
ip addr show
# OR
ip a

# Show details briefly with color
ip -c -br a
```

## 4. Network Manager (`nmcli`)
Command-line tool to control NetworkManager.

```bash
# Show connections
nmcli connection show

# Activate/Deactivate connection
nmcli con up "Wired connection 1"
nmcli con down "Wired connection 1"

# Assign Static IP (Complete Configuration)
nmcli con mod "MyCon" ipv4.addresses 192.168.1.10/24
nmcli con mod "MyCon" ipv4.gateway 192.168.1.1
nmcli con mod "MyCon" ipv4.dns "8.8.8.8 8.8.4.4"
nmcli con mod "MyCon" ipv4.method manual
nmcli con up "MyCon"
```

> [!IMPORTANT]
> **Don't Forget DNS!** Without the `ipv4.dns` line, your static IP will work locally but you won't be able to resolve domain names (no internet access).

## 5. Summary
-   **ip a:** View IP.
-   **ping:** Test connection.
-   **nmcli:** Configure NetworkManager.

---

## 6. 🏆 Master Example: Troubleshooting Internet Connectivity
**Scenario:** Your server cannot reach the internet. You follow the **OSI model (bottom-up)** approach to find the break.

```bash
# 1. Physical/Link Layer: Is the cable plugged in / interface up?
ip link show eth0
# Look for "state UP". If DOWN: `ip link set eth0 up`

# 2. Network Layer (Local): Do I have an IP?
ip a
# Look for inet 192.168.x.x. If missing: `nmcli con up eth0`

# 3. Network Layer (Gateway): Can I reach the router?
ip route
# Identify default gateway (e.g., 192.168.1.1) and ping it:
ping -c 3 192.168.1.1

# 4. Transport/Internet: Can I reach an external IP?
ping -c 3 8.8.8.8
# If fails: Gateway/ISP issue.

# 5. DNS Layer: Can I resolve names?
ping -c 3 google.com
# If "Temporary failure in name resolution": DNS issue. Check /etc/resolv.conf.
```

> **Result:** You isolate the problem systematically (Link -> IP -> Gateway -> Internet -> DNS).

## 7. Troubleshooting Tools
-   **Ping:** Check connectivity.
    ```bash
    ping google.com
    ping -c 4 8.8.8.8
    ```
-   **SS (Socket Statistics):** Check open ports (replaces `netstat`).
    ```bash
    ss -tuln
    # -t: TCP, -u: UDP, -l: Listening, -n: Numeric (no DNS resolution)
    ```
-   **IP Route:** View routing table.
    ```bash
    ip route
    ip route show default
    ```
-   **Traceroute:** Trace packet path.
    ```bash
    traceroute google.com
    # or
    tracepath google.com
    ```

## 6. DNS Configuration
-   **/etc/hosts:** Local hostname-to-IP mapping (checked first).
-   **/etc/resolv.conf:** DNS server configuration (nameservers).

**Example `/etc/hosts`:**
```bash
127.0.0.1   localhost
192.168.1.100   myserver.local myserver
```

## 7. Key Takeaways
-   Use **`ip a`** to check IP addresses.
-   Use **`nmcli`** to configure connections.
-   Use **`ss -tuln`** to check listening ports.
-   Always configure **DNS** when setting static IPs.