# Authentication with remote repositories
1. **Authentication via GUI (Browser Access)**:
    - **Identity based**: Users log in via SSO (Single Sign-On) / their credentials (username and password) to access the repository.
    - **Session based**: Access is granted for the duration of the session, and users may need to re-authenticate after a certain period or when accessing from a different device.
    - **Session**: uses tokens or cookies to maintain the session state and manage access permissions.
    - Used to manual opertions (UI workflow) such as creating repositories, managing settings, and reviewing pull requests.

2. **Authentication via `Git CLI` (Command Line Interface)**:
    > `SSH Keys` and `Personal Access Tokens (PATs)` are the two most common methods for authenticating with remote repositories when using Git CLI.
- **SSH Keys (typically for human users)**:
    - **Authentication method**: Asymmetric cryptography using a pair of keys (public and private).
    - **Identity**: private key proves identity, while the public key is stored on the remote server to grant access.
    - **Mapping**: Public key is associated with the user's account on the remote repository hosting service.
    - **Authorization**: Access is granted based on the presence of the corresponding public key in the user's account settings on the remote server.
    - **Usage**: Ideal for developers who prefer a secure and password-less authentication method for frequent interactions with remote repositories via Git CLI.
    - **Security**: No shared secrets (like passwords) are transmitted over the network, making it more secure against interception and brute-force attacks.

- **Personal Access Tokens (PATs | typically for automated processes, systems)**:
    - **Authentication method**: Token-based authentication where a token acts as a substitute for a password with specific scopes and permissions.
    - **Identity**: Token identifies the user account and is treated as proof of authentication for CLI operations.
    - **Authorization**: Access is granted based on the scopes defined during token creation (e.g., repo, workflow, read:org).
    - **Usage**: Ideal for CI/CD pipelines, scripts, applications, and scenarios where password-less or unattended authentication is required.
    - **Security**: Tokens can be revoked individually, have expiration dates, and are more granular than passwords; however, they must be kept secret like passwords.
    - You can get a PAT from your GitHub account settings under Developer Settings > Personal Access Tokens > Fine-Grained Tokens or Classic Tokens.
    - Fine grained tokens allow you to specify more precise permissions and have better security controls compared to classic tokens.
    - Classic tokens are more general and have broader permissions, but they are still widely used for various applications and scripts that require access to GitHub resources.



## Setting Up SSH Authentication

### Generating SSH Keys
```bash
ssh-keygen -t ed25519 -C "your_email@example.com" -f ~/.ssh/github_karim_ed25519
```
- `-t ed25519`: Uses Ed25519 algorithm (preferred for better security and performance)
- `-C`: Adds a comment (typically your email) for identification
- `-f`: Specifies the file path to save the key pair with name 

- **Fingerprint**: Displayed after generation; use to verify key identity

- Best practices:
    - **Passphrase**: Optional but recommended for added security; protects the private key with an additional layer of encryption.
    - **Naming keys**: use descriptive names (e.g., `github_karim_ed25519`) to easily identify their purpose and associated account.
    - use different keys for different services or accounts to enhance security and manage access more effectively.


### Starting SSH Agent
The problem here is that the SSH client does not know where to find the private key, so we need to start the SSH agent and add the private key to it. The SSH agent is a background process that manages your SSH keys and provides them to the SSH client when needed.

```bash
# Start the SSH agent in the background
eval "$(ssh-agent -s)"

# Add your SSH private key to the agent
ssh-add ~/.ssh/id_ed25519

# List the keys currently loaded in the SSH agent
ssh-add -l  # Lists all loaded keys
```

Now the SSH agent is ready to provide your private key for authentication when you interact with remote repositories via Git CLI.

The SSH agent manages your private keys in memory, so you don't need to enter your passphrase repeatedly.

### Testing SSH Connection
```bash
# Test the SSH connection to verify that your SSH key is properly configured
# For GitHub:
ssh -T git@github.com

# For GitLab:
ssh -T git@gitlab.com
```

Expected output for successful authentication:
- **GitHub**: `Hi <username>! You've successfully authenticated, but GitHub does not provide shell access.`
- **GitLab**: `Welcome to GitLab, <username>!`

If the connection fails, verify:
- Your SSH key is added to the SSH agent (`ssh-add -l`)
- Your public key is uploaded to your remote repository account
- The correct SSH key permissions (`chmod 600 ~/.ssh/id_ed25519`)


### What is ~/.ssh/config file?
The `~/.ssh/config` file is a configuration file for the SSH client that allows you to define custom settings for different SSH connections. It simplifies the process of connecting to multiple remote servers by allowing you to specify connection details (like hostname, user, and identity file) in a structured way. This is especially useful when you have multiple SSH keys or need to connect to different servers with different configurations.

Example `~/.ssh/config` file:
```bash
cat ~/.ssh/config
# Example SSH config file for GitHub and GitLab
# GitHub configuration
# Host github.com
#     HostName github.com
#     User git
#     IdentityFile ~/.ssh/github_karim_ed25519

# Default settings for all SSH connections
Host *
    AddKeysToAgent yes
    UseKeychain yes
    IdentityFile ~/.ssh/id_ed25519
```

Once you hit `git clone git@github.com:username/repo.git`, the SSH client will look for the corresponding configuration in `~/.ssh/config` to determine which private key to use for authentication. If a specific host configuration is found (e.g., for `github.com`), it will use the specified `IdentityFile`. If no specific host configuration is found, it will fall back to the default settings defined under `Host *`.

# In normal case you hit:
```bash
git clone git@github.com:<repo-owner>/<repo-name>.git
```

Your machine does not just guess which key ot use. It follows a strict, hardcoded hierarchy:

**1. The `ssh-agent` (The Memory Cache)**
If the `ssh-agent` is running in the background, your SSH client will ask it *first*. The agent holds decrypted private keys in your RAM so you don't have to type your passphrase every time.

* **The Trap:** If your agent is holding your *second* key, it might offer that key to GitHub immediately, completely ignoring your `~/.ssh/config` file! If GitHub accepts the *second* key, you are logged in as the wrong person.

**2. The `~/.ssh/config` File (The Rulebook)**
If the agent is not running, or if it doesn't have a matching key, the SSH client reads your config file. It looks for the `Host github.com` block and grabs the exact `IdentityFile` you specified.

**3. The Default Fallbacks (The Blind Guess)**
If you have no agent running and no config file, SSH will blindly look inside your `~/.ssh/` folder for default filenames in this exact order: `id_rsa`, `id_ecdsa`, `id_ed25519`, etc. It will offer them to the server one by one.

### The Fix: `IdentitiesOnly yes`
```bash
HOST github.com-personal
  HostName github.com
  User git
  IdentityFile ~/.ssh/github_key_junior
  IdentitiesOnly yes
```
Because the `ssh-agent` can be overly aggressive and offer the wrong key, Senior Engineers use a specific flag in their config file to force SSH to obey the rules.

If you want to guarantee that your `github.com-personal` alias *only* uses the junior key, even if the agent is running, you update your block like this:

```bash
HOST github.com-personal
  HostName github.com
  User git
  IdentityFile ~/.ssh/github_key_junior
  IdentitiesOnly yes
```

`IdentitiesOnly yes` tells the SSH client: *"Do not let the agent guess. Only use the exact file I listed here."*

---

# With Multible GitHub Accounts

What if you have multible github accounts? How to switch between them?

### Lets Understand the Full Flow
lets assume you have two GitHub accounts: `personal` and `work`. and you want to `pull` and `push` with one of them, how to switch between them each time?

the normal situation is that you push to a github repo assuming that you have only one account, but if you have two accounts, and you tried to push to a repo, you mistakenly will push to the default account which is the one that is associated with the default SSH key in your `~/.ssh/config` file.


To switch between accounts:
- you first have to create another SSH key for the second account
- copy and paste it in the second GitHub account's SSH keys settings
- configure it in the `~/.ssh/config` file with different host aliase.

For example:

```bash
# Personal GitHub account
Host github.com-personal
    HostName github.com
    User git
    IdentityFile ~/.ssh/github_personal_ed25519
# Work GitHub account
Host github.com-work
    HostName github.com
    User git
    IdentityFile ~/.ssh/github_work_ed25519
```

### How the machine read it when you hit `git clone git@github.com-personal:username/repo.git`?

at this moment, your machine looks like that: "Hey, a user want to clone a repo, but which account should I use? and which key should I use? also which website to clone from? Let me check the `~/.ssh/config` file, oh I see that there is a host alias called `github.com-personal` that matches the clone command, so I will use the settings under that block, which means I will use the `github_personal_ed25519` key to authenticate with GitHub and clone the repo. this means that this user with this key should be known as the `personal` account on GitHub, that means that this user must be copied and pasted in the SSH keys settings of the `personal` account on GitHub, otherwise the authentication will fail and the clone command will not work. now I know which account to use and which key to use, so I will proceed with the clone operation using the `personal` account credentials and the `github_personal_ed25519` key for authentication."


### What if you need to switch between accounts for the same repo?
In this case, you can change the remote URL of the repository to use the appropriate host alias for the account you want to use. For example, if you want to switch to the `work` account for a repository that was cloned using the `personal` account, you can update the remote URL like this:

```bash
git remote set-url origin git@github.com-work:username/repo.git
```
