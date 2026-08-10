sudo apt update
sudo apt install zsh -y

zsh --version
which zsh

chsh -s $(which zsh)


sh -c "$(curl -fsSL [https://install.ohmyz.sh/](https://install.ohmyz.sh/))" || \
sh -c "$(wget -O- [https://install.ohmyz.sh/](https://install.ohmyz.sh/))" || \
sh -c "$(fetch -o - [https://install.ohmyz.sh/](https://install.ohmyz.sh/))"


echo "ZSH_THEME="robbyrussell"" >> ~/.zshrc
echo "plugins=(git docker kubectl helm docker-compose dotenv zsh-autosuggestions zsh-syntax-highlighting)" >> ~/.zshrc

source ~/.zshrc