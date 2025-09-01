# Ansible Basics: Common Commands

## 1. Check Ansible Version
```bash
ansible --version
```

## 2. Run Ad-Hoc Commands
- **Ping all hosts:**
    ```bash
    ansible all -m ping
    ```
- **Run a shell command:**
    ```bash
    ansible all -a "uptime"
    ```

## 3. Specify Inventory File
```bash
ansible all -i inventory_file -m ping
```

## 4. Use a Playbook
```bash
ansible-playbook playbook.yml
```

## 5. Check Playbook Syntax
```bash
ansible-playbook playbook.yml --syntax-check
```

## 6. List Hosts in Inventory
```bash
ansible all --list-hosts
```

## 7. Gather Facts
```bash
ansible all -m setup
```

## 8. Limit Execution to Specific Host
```bash
ansible-playbook playbook.yml --limit hostname
```

---

**Tip:** Use `-u username` to specify a remote user and `-k` to prompt for SSH password.