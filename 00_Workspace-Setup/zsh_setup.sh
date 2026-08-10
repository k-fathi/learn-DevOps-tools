#!/bin/bash

echo "Checking Package Manager and installing dependencies..."

if command -v apt &> /dev/null; then
    sudo apt update
    sudo apt install zsh curl git sed -y

elif command -v dnf &> /dev/null; then
    sudo dnf install zsh curl git sed util-linux-user -y

elif command -v yum &> /dev/null; then
    sudo yum install zsh curl git sed util-linux-user -y

else
    echo "Error: Unsupported Package Manager!"
    exit 1
fi

echo "Changing default shell to ZSH for user $USER..."
sudo chsh -s $(which zsh) $USER

echo "Installing Oh My Zsh..."
RUNZSH=no CHSH=no sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"

echo "Installing ZSH Plugins..."
git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
git clone https://github.com/zsh-users/zsh-syntax-highlighting ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting

echo "Configuring ~/.zshrc..."
sed -i 's/^plugins=(git)/plugins=(git docker kubectl helm docker-compose dotenv zsh-autosuggestions zsh-syntax-highlighting)/' ~/.zshrc
sed -i 's/^ZSH_THEME=.*/ZSH_THEME="robbyrussell"/' ~/.zshrc

exec zsh

echo "====================================================="
echo "Setup Complete! ZSH and Oh My Zsh are ready."
echo "====================================================="
