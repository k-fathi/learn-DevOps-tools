# Storage in K8s: Persistent Volumes (Part 2)

## Outlines:
1. [The First Solution: External Network Storage](#1-the-first-solution-external-network-storage)
2. [Deep Dive: Access Modes in Remote Storage](#2-deep-dive-access-modes-in-remote-storage)
3. [Introduction to CSI (Container Storage Interface)](#3-introduction-to-csi-container-storage-interface)
4. [Static Provisioning with Remote Storage (Labs)](#4-static-provisioning-with-remote-storage-labs)

---

## 1. The First Solution: External Network Storage

To overcome the severe limitations of `hostPath` (where data is permanently tied to a single node's physical disk), Kubernetes supports **External Network Storage**. 

This architecture decouples the storage from the worker node's hardware. If a pod dies on `Node-1` and is rescheduled on `Node-2`, it simply reconnects to the external storage over the network, ensuring **zero data loss**.

---

## 2. Deep Dive: Access Modes in Remote Storage

Before implementing remote storage, it's crucial to understand why specific storage backends support specific Access Modes:

### 1. Why AWS EBS with RWO (ReadWriteOnce)?
- **Why EBS supports ONLY RWO?** 
  Imagine an EBS volume as a physical SSD attached to a server motherboard. It is physically impossible to attach the same SSD to multiple separate machines at the exact same time without causing severe data corruption at the OS level. 
- **Why multiple Pods can still read/write to it?**
  If that SSD is attached to a *single* machine (Worker Node), the Linux OS mounts it as a folder. Since all pods scheduled on that specific node share the same underlying OS, multiple apps (pods) can easily read/write to that same folder simultaneously.
- **Conclusion:** EBS cannot support `RWX` or `ROX` across multiple nodes.

### 2. Why AWS EFS with RWX (ReadWriteMany)?
- **Why EFS supports RWX?**
  Imagine EFS as a network-shared storage (like a NAS or shared drive). It is designed over network protocols (NFS) to be accessible from multiple machines simultaneously.
- **Why multiple Pods across multiple Nodes can use it?**
  Because the shared storage is mounted via the network across multiple worker nodes, any pod on any node can read and write to the same shared files concurrently without data corruption.

---

## 3. Introduction to CSI (Container Storage Interface)

### Why CSI? (The In-Tree vs Out-of-Tree Evolution)
* **The Old Days (In-Tree Plugins):** Originally, the code required to integrate with cloud providers (like AWS, GCP, Azure) was written directly inside the core Kubernetes source code. This meant any bug fix or new cloud feature required waiting months for a new Kubernetes release.
* **The Modern Way (CSI):** Kubernetes introduced the **Container Storage Interface (CSI)**, a standardized API that decouples storage plugins from the Kubernetes core. Storage vendors now build and release **CSI Drivers** independently.

### How to Install a CSI Driver
To use cloud storage (like AWS EBS) in your cluster, you must install its corresponding CSI driver. 
1. **Using Helm (Standard):** Most CSI drivers can be installed via Helm charts (e.g., `helm repo add aws-ebs-csi-driver [https://kubernetes-sigs.github.io/aws-ebs-csi-driver](https://kubernetes-sigs.github.io/aws-ebs-csi-driver)`).
2. **Using Managed Add-ons:** If you are using a managed Kubernetes service (like AWS EKS), you can install the driver directly via the cloud console, CLI, or Terraform as an EKS Add-on.

---

## 4. Static Provisioning with Remote Storage (Labs)

In **Static Provisioning**, the storage volume must already exist *outside* of Kubernetes before the Cluster Administrator can create the PV.

### Lab A: NFS-based PersistentVolume (Static)
Assuming you have an external NFS server running at `192.168.1.100`.

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: pv-nfs-storage
spec:
  capacity:
    storage: 10Gi
  accessModes:
    - ReadWriteMany
  nfs:
    server: 192.168.1.100       # IP of the external NFS server
    path: "/exported/data"      # Shared path on the NFS server
```

### Lab B: Cloud Storage-based PersistentVolume (Static EBS)

**The Pain Point:** In this scenario, the Cluster Administrator must **manually** go to the AWS Console (or CLI), create an EBS volume in a specific Availability Zone, copy its `Volume ID`, and hardcode it into the PV manifest along with the zone's topology.

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: pv-static-ebs
spec:
  capacity:
    storage: 10Gi
  accessModes:
    - ReadWriteOnce
  csi:
    driver: ebs.csi.aws.com
    volumeHandle: "vol-0a1b2c3d4e5f6g7h8"  # The ID of the manually created volume in AWS
  nodeAffinity:
    required:
      nodeSelectorTerms:
        - matchExpressions:
            - key: topology.ebs.csi.aws.com/zone
              operator: In
              values:
                - us-east-1a
```

> ⚠️ **The Operational Overhead:** Every time a developer needs storage, the Admin has to leave Kubernetes, go to AWS, provision the disk, get the ID, figure out the AZ, and write this lengthy YAML. This manual bottleneck leads us directly to the ultimate solution: **Dynamic Provisioning** (Covered in Part 3).

---
<style>
body { font-size: 16px; }
</style>