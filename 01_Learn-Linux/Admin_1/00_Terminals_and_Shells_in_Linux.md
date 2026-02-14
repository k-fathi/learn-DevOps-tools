# 00: Terminals and Shells in Linux

## 1. The Big Picture: Terminal vs Shell vs Kernel
Understanding how Linux works requires distinguishing between three key components. Think of it like a restaurant:

> ![Terminal vs Shell vs Kernel Infographic](screens/infographic_terminal_shell_kernel.png)

### The Restaurant Analogy 🍽️
1.  **The User (Customer):** That's you! You want something done (e.g., "List my files").
2.  **The Terminal (Menu/Table):** The interface where you sit and make your request. It listens to your keystrokes and displays the result.
    *   *Examples:* GNOME Terminal, PuTTY, iTerm2.
3.  **The Shell (Waiter):** Takes your request from the terminal, understands it (parses syntax), and tells the kitchen what to do.
    *   *Examples:* Bash, Zsh, Fish.
4.  **The Kernel (Chef):** The core of the OS. It actually talks to the hardware (CPU, Disk, RAM) to execute the task (finding files on the disk).
5.  **The Hardware (Ingredients/Stove):** The physical components that do the work.

---

## 2. What is a Shell?
A **Shell** is a command-line interface that allows users to interact with the operating system kernel. It interprets commands entered by the user and executes them. Linux supports multiple shells, each with its own features and syntax.

## 3. Common Linux Shells
1.  **`sh` (Bourne Shell):** The original Unix shell.
2.  **`bash` (Bourne Again Shell):** The default and most common shell in Linux distributions.
3.  **`csh` (C Shell):** Uses syntax similar to the C programming language.
4.  **`ksh` (Korn Shell):** An enhanced version of the Bourne shell.
5.  **`zsh` (Z Shell):** An extended Bourne shell with advanced features (themes, plugins).
6.  **`fish` (Friendly Interactive Shell):** Designed for user-friendliness with auto-suggestions.

## 4. Accessing Shells
There are two main ways to access a shell in Linux:

### A. Virtual Consoles (TTYs)
-   Direct access to the system without a graphical interface (CLI).
-   Mapped to hardware teletypewriters (TTYs).
-   **Shortcuts:** `Ctrl + Alt + F1` through `F6`.
-   **Hierarchy:**
    -   `tty1` - `tty2`: Often reserved for the GUI (Display Manager).
    -   `tty3` - `tty6`: Text-based login prompts.

### B. Terminal Emulators (PTS)
-   Applications running inside the Graphical User Interface (GUI).
-   Examples: GNOME Terminal, Konsole, Alacritty.
-   **Pseudo Terminals (PTS):** Each tab or window creates a new pseudo-terminal (e.g., `/dev/pts/0`).

## 5. Hierarchy of Terminals
```
/dev
  ├── tty1  (GUI)
  ├── tty2  (GUI)
  ├── tty3  (CLI)
  ├── tty4  (CLI)
  ├── tty5  (CLI)
  ├── tty6  (CLI)
  └── pts
      ├── pts/0  (Terminal Window 1)
      ├── pts/1  (Terminal Window 2)
      └── ...
```

### Commands to Check Terminal Session
```bash
# Check current TTY/PTS
tty
# Output: /dev/pts/0

# List logged-in users and their terminals
who

# Show detailed session info
w

# View process tree showing terminals
ps -aux --forest | grep pts
```

## 6. Summary
-   **Terminal:** The window/emulator.
-   **Shell:** The program interpreting commands (bash/zsh).
-   **Prompt:** The text `user@host:~$`.

---

## 7. 🏆 Master Example: Customizing Your Shell Environment
**Scenario:** You want your terminal to be more useful. You need to:
1.  Create a permanent alias for updating the system.
2.  Add a directory to your `PATH` so you can run your scripts from anywhere.
3.  Customize your prompt to show the current time.

```bash
# Open your shell configuration file (e.g., .bashrc)
nano ~/.bashrc

# --- Add these lines to the bottom ---

# 1. Alias for easy updating
alias update='sudo apt update && sudo apt upgrade -y'

# 2. Add local scripts folder to PATH
export PATH="$PATH:$HOME/scripts"

# 3. Custom Prompt (Time - User@Host - Directory)
export PS1="\[\033[01;32m\]\t \[\033[01;34m\]\u@\h:\w\$ \[\033[00m\]"

# --- Save and Exit (Ctrl+O, Enter, Ctrl+X) ---

# Apply changes immediately
source ~/.bashrc
```

> **Result:** Now you can type `update` to upgrade your system, run scripts from anywhere, and see the time in your prompt!

## 8. Key Takeaways
-   **Shells** interpret your commands; `bash` is the standard.
-   **TTYs** are physical/virtual consoles independent of the GUI.
-   **PTS** (Pseudo-Terminals) are used by terminal emulators within the GUI.