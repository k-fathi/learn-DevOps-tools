# Installation Guide (Zsh & Oh My Zsh)

## Step 1: Install Zsh
Update the package manager and install the Z shell natively.
```bash
sudo apt update
sudo apt install zsh -y
```
## Step 2: Verify Installation
Check the installed version and locate the exact executable path.
```bash
zsh --version
which zsh
```

## Step 3: Change Default Shell
Change the default shell from Bash to Zsh. Note: We strictly use `which zsh` instead of `whereis zsh`. The `chsh` command requires a single, exact path to the executable.
```bash
chsh -s $(which zsh)
```

## Step 4: Install Oh My Zsh (The Bulletproof Way)
Execute the official installation script. We use the logical OR (||) operator as a fail-safe mechanism.
```bash
sh -c "$(curl -fsSL [https://install.ohmyz.sh/](https://install.ohmyz.sh/))" || \
sh -c "$(wget -O- [https://install.ohmyz.sh/](https://install.ohmyz.sh/))" || \
sh -c "$(fetch -o - [https://install.ohmyz.sh/](https://install.ohmyz.sh/))"
```