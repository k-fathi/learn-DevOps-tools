# Adding a Remote Repository

When working with Git, you need to connect your local repository to a remote repository (typically hosted on GitHub, GitLab, or similar platforms). This establishes a connection that allows you to push and pull changes.

## Basic Commands

**Add a remote:**
```bash
git remote add <remote-name> <repository-url>
# Example:
# git remote add origin https://github.com/user/repo.git
```

**List configured remotes:**
```bash
git remote -v # Shows remote names and their URLs
git remote -vv # Shows remote names, URLs, and tracking branches
```

The standard convention is to name the primary remote repository `origin`, but you can choose any name you like. I usually prefer to use the name of the hosting service (e.g., `github/origin`, `gitlab/origin`) or the purpose of the remote (e.g., `upstream` for the original repository when working with forks) to make it more descriptive. 

`Origin` is just an alias for the remote repository URL. You can use the remote repo link directly in the push and pull commands without adding a remote, but using a remote name makes it easier to manage and remember the connection to the remote repository, especially when you have multiple remotes or need to switch between them.

Now you are ready to push your local commits to the remote repository using `git push` and pull changes from the remote repository using `git pull`.

However, if you hit `git push` without specifying the remote and branch, you will get an `error` because Git asks:does not know which remote branch to push to. This is where setting an upstream branch comes into play.

### Common Questions

- **If I just added a remote, why didn't it know it?**
- **What if you have multiple remotes, how could Git know which to use?**
- **Even if you specify a remote, how could Git know which branch to push to?** 

You need to first specify the remote and then specify the branch you want to push to, and then you can set that branch as the upstream branch for your local branch. This way, Git will know which remote and branch to use when you run `git push` without any additional arguments in the future.

### Full Command

The full command to use while pushing is:
```bash
git push <remote> <local-branch>:<remote-branch> --set-upstream
# Example:
git push origin main:main --set-upstream
```
This means push the local `main` branch to the `main` branch on the `origin` remote and set it as the upstream branch for the local `main` branch. After running this command, you can simply use `git push` or `git pull` without specifying the remote and branch, and Git will know to push to or pull from `origin/main`.

If you hit `git push origin main` only, Git will automatically add `:main` as the same as the local branch for you.

### Understanding `--set-upstream`

What does `--set-upstream` or `-u` actually do? It creates a mapping that allows Git to remember the route to the remote branch. So next time, you can just do `git push`, and it will know where to push from your current branch. Similarly, `git pull` will know where to pull from. This option is used only `the first time` you push a new branch to the remote. After that, you can just use `git push` and `git pull` without any arguments, and it will work because the mapping is already set.

You can verify the upstream branch mapping by using:
```bash
git branch -vv
# Output:
# main 1234567 [origin/main] Commit message
```

If you didn't use `--set-upstream` or `-u`, you can still push to the remote branch, but you will have to specify the remote and branch every time you push or pull, which can be tedious and error-prone, like `git push origin main:main` or `git pull origin main` every time you want to push to the `main` branch on the `origin` remote.

To verify the mapping, use:
```bash
git branch -vv
# Output:
# main 1234567 Commit message
```
You will not see the mapping to the remote branch, and you will have to specify the remote and branch every time you push or pull.


What if the remote branch doesn't exist yet? Git will create the remote branch for you when you push with `--set-upstream` or `-u`.



**Remove a remote:**
```bash
git remote remove <remote-name>
```


If you create a new branch locally and want to push it to the remote for the first time, you can use:
```bash
git push -u origin <new-branch-name>
```
This will push the new branch to the `origin` remote and set it as the upstream branch for the local branch, so you can use `git push` and `git pull` without any additional arguments in the future.


## Handling Deleted Branches & Pruning

When you delete a branch on the remote server (e.g., via GitHub GUI), your local repository doesn't automatically sync. Your local Git maintains "remote-tracking branches" (like `origin/branch-name`) that point to old commits even after deletion on the server.

**Delete the local branch:**
```bash
git branch -d <branch-name>
```

**Remove stale remote tracking references:**
```bash
git remote prune origin
```

This synchronizes your local repository with the remote, removing tracking references for branches that no longer exist on the server.





### Cloning Repositories
- **SSH** (recommended): `git clone git@github.com:user/repo.git`
    - Uses SSH keys for authentication (more secure, no credentials in URLs)
- **HTTPS**: `git clone https://github.com/user/repo.git`
    - Requires PAT (Personal Access Token) or credentials; easier for one-time operations
    **Key selection:** SSH uses keys loaded in the SSH agent or specified in ~/.ssh/config; HTTPS uses credential helpers (e.g., GCM) or prompts for username + PAT/password.

    | Case | Command | Public repo | Private repo | Notes |
    |---|---|---:|---:|---|
    | 1. HTTPS clone (no GitHub account **or** have account but not signed in browser) | `git clone https://github.com/user/repo.git` | Clones without auth | Prompts for credentials (username + PAT/password) or uses stored credential helper | Browser sign-in has no direct effect on CLI; credential helpers may supply cached tokens. |
    | 2. Have account and signed in (browser), HTTPS | `git clone https://github.com/user/repo.git` | Clones without auth | Prompts for credentials or uses credential helper / web auth if GCM is configured | Browser session only matters if a credential helper triggers a web sign-in flow. |
    | 3. SSH clone (any account state) | `git clone git@github.com:user/repo.git` | Uses SSH key; succeeds if public key is registered on GitHub | Uses SSH key; succeeds if public key is registered on GitHub | SSH auth depends on local private key (agent or `IdentityFile`) and the public key being associated with the GitHub account; otherwise authentication fails. |
