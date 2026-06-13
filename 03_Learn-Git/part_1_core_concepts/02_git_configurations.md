# 02_Git_Configurations

Git Configurations are settings that control how Git behaves on your system. These configurations can be set at different levels: system, global, and local.


## Git Configuration Levels

- **System Level**: These configurations apply to all users on the system and are stored in the `/etc/gitconfig` file. You can view or edit these configurations using the `--system` flag with the `git config` command.

- **Global Level**: These configurations apply to the current user and are stored in the `~/.gitconfig` file. You can view or edit these configurations using the `--global` flag with the `git config` command.

- **Local Level**: These configurations apply to a specific repository and are stored in the `.git/config` file within that repository. You can view or edit these configurations using the `--local` flag with the `git config` command (or simply by running `git config` without any flags while inside the repository).

Example:
```bash
# Set user name and email at the global level
git config --global user.name "Karim Fathy"
gti config --global user.email "karimfathy.devops@gmail.com"

# Set default text editor for Git at the global level
git config --global core.editor "vim"

# set default branch name for new repositories at the global level
git config --global init.defaultBranch "main"

# to list all global configurations
git config --global --list

# to list all system configurations
git config --system --list

# to list all local configurations (while inside a repository)
git config --local --list

# To view a specific configuration value
git config --global user.name


# The most global configurations used are
# user.name
# user.email
# core.editor
# init.defaultBranch
```


## Git Aliases (`git config alias.<alias-name> <actual-command>`)

**Git Aliases are your personal shortcut engine.**

As a DevOps Engineer, you will type Git commands hundreds of times a day. Typing out `git checkout` or `git commit -m` over and over is a waste of time. The `alias` configuration allows you to invent your own custom Git commands by mapping a short word to a long, complex command.

**1. The Basic Syntax:**

```bash
git config --global alias.<your-shortcut> "<the-real-git-command>"

```

**2. Standard Shortcuts (The Junior Level):**
Most developers set up simple abbreviations to save keystrokes:

* Make `git status` become `git st`:
`git config --global alias.st status`
* Make `git checkout` become `git co`:
`git config --global alias.co checkout`

**3. The Superpowers (The Senior Level):**
Aliases become incredibly powerful when you use them to save complex flags that are hard to memorize.
For example, to see a beautiful, colorful, branch-graph history of your commits, the real command is very long:
`git log --graph --oneline --decorate --all`

Instead of memorizing that, a Senior Engineer creates a shortcut:

```bash
git config --global alias.tree "log --graph --oneline --decorate --all"

```

Now, you just type `git tree`, and Git executes that entire long string!

*(Note: Because we use the `--global` flag, these shortcuts are saved in your laptop's main `~/.gitconfig` file, so they will work in every repository on your machine).*
