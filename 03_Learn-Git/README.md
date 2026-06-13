# Git Master Documentation

This repository contains a structured, beginner-to-advanced guide to Git.
It is organized as short topic-based Markdown files so you can study Git in a
clear sequence, revisit specific concepts quickly, and expand the notes over time.

## Purpose

The goal of these notes is to explain:

- why Git exists and what problem it solves
- how Git stores data internally
- how to work with commits, branches, remotes, and history safely
- how to use advanced workflows such as rebase, squash, and cherry-pick
- how to build a practical mental model instead of memorizing commands only

## Quick Navigation

- [Part 1: Core Concepts](#part-1-core-concepts)
- [Part 2: Working with Remotes](#part-2-working-with-remotes)
- [Part 3: Advanced Git](#part-3-advanced-git)
- [Suggested Study Path](#suggested-study-path)
- [Practical Learning Tips](#practical-learning-tips)
- [Common Mental Models](#common-mental-models)

## Recommended Reading Order

Read the files in order inside each part folder. The numbering prefix is there
to keep the learning path organized.

1. Start with core Git concepts
2. Move to remotes and collaboration
3. Finish with advanced history manipulation

If you already know some topics, you can jump directly to the file you need.

## Folder Structure

```text
03_Learn-Git/
├── README.md
├── part_1_core_concepts/
│   ├── 00_what_is_git.md
│   ├── 01_git_architecture.md
│   ├── 02_git_configurations.md
│   ├── 03_git_basic_commands.md
│   ├── 04_gitignore.md
│   ├── 05_git_branching.md
│   ├── 06_undoing_things.md
│   └── 07_git_tagging.md
├── part_2_working_with_remotes/
│   ├── 00_git_remote_repositories.md
│   ├── 01_git_authentication_methods.md
│   ├── 02_setting_upstream_git_push.md
│   └── 03_git_fetch_and_pull.md
└── part_3_advanced_git/
    ├── 00_git_stash.md
    ├── 01_git_rebase.md
    ├── 02_cherry_pick.md
    └── 03_merge_options.md
```

# Git Visualizer tool  

### You can use the [Git Visualizer](https://zeqtech.github.io/git-visualizer/) to practice Git commands in a visual and interactive way.

Or If you have Docker installed you can use this docker image alos:
```bash
docker run -it --name git-visualizer -p 8080:80 karimfathi1/git-visualizer:1.1.1
```
Then open your browser and go to `http://localhost:8080` to start using the Git Visualizer.



## Part 1: Core Concepts

This section explains the foundation of Git.

### Topics covered

- what Git is and why it exists
- the difference between local, centralized, and distributed VCS models
- Git architecture and the three-tree model
- configuration basics and the role of `.gitconfig`
- everyday commands like `init`, `add`, `commit`, `status`, `log`, `diff`, and `show`
- `.gitignore` rules and file tracking behavior
- branching basics and branch naming ideas
- undoing work using `restore`, `reset`, `revert`, and `amend`
- tagging releases and important snapshots

### Files in this section

- [00_what_is_git.md](part_1_core_concepts/00_what_is_git.md)
- [01_git_architecture.md](part_1_core_concepts/01_git_architecture.md)
- [02_git_configurations.md](part_1_core_concepts/02_git_configurations.md)
- [03_git_basic_commands.md](part_1_core_concepts/03_git_basic_commands.md)
- [04_gitignore.md](part_1_core_concepts/04_gitignore.md)
- [05_git_branching.md](part_1_core_concepts/05_git_branching.md)
- [06_undoing_things.md](part_1_core_concepts/06_undoing_things.md)
- [07_git_tagging.md](part_1_core_concepts/07_git_tagging.md)

### Why this section matters

Understanding this part makes every later Git workflow easier.
Most Git confusion comes from not knowing the difference between:

- the working directory
- the staging area
- the repository

Once that model is clear, commands become much easier to reason about.

## Part 2: Working with Remotes

This section focuses on collaboration and remote repositories.

### Topics covered

- what a remote repository is
- public vs. private repositories
- authentication methods such as SSH, tokens, and GUI-based login
- upstream tracking with `git push -u`
- the difference between `fetch` and `pull`
- how remote branches are represented locally
- pull request concepts and collaboration workflow

### Files in this section

- [00_git_remote_repositories.md](part_2_working_with_remotes/00_git_remote_repositories.md)
- [01_git_authentication_methods.md](part_2_working_with_remotes/01_git_authentication_methods.md)
- [02_setting_upstream_git_push.md](part_2_working_with_remotes/02_setting_upstream_git_push.md)
- [03_git_fetch_and_pull.md](part_2_working_with_remotes/03_git_fetch_and_pull.md)

### Why this section matters

Git becomes truly useful when multiple people work on the same codebase.
This section explains how local work connects to GitHub, GitLab, and similar platforms.

## Part 3: Advanced Git

This section explains how to rewrite or reorganize history safely.

### Topics covered

- stash for temporary work
- rebase and how it differs from merge
- interactive rebase
- squash workflows
- integration strategies such as merge commit, squash and merge, and rebase and merge
- cherry-pick for moving specific commits between branches

### Files in this section

- [00_git_stash.md](part_3_advanced_git/00_git_stash.md)
- [01_git_rebase.md](part_3_advanced_git/01_git_rebase.md)
- [02_cherry_pick.md](part_3_advanced_git/02_cherry_pick.md)
- [03_merge_options.md](part_3_advanced_git/03_merge_options.md)

### Why this section matters

These tools are powerful, but they require a strong mental model.
Use them carefully, especially on shared branches.

## Suggested Study Path

If you are learning Git from scratch, use this order:

1. What Git is and why it exists
2. Git architecture and the three trees
3. Git configuration
4. Basic commands
5. `.gitignore`
6. Branching and merging
7. Undoing changes
8. Working with remotes
9. Pull requests and collaboration
10. Stash, rebase, and cherry-pick


## Extending the Documentation

You can add more topics later, such as:

- Git hooks
- Git aliases
- Git bisect
- Git LFS
- submodules and subtree workflows
- troubleshooting common merge and rebase problems

## Goal of the Repository

This documentation set is designed to be a personal Git masterclass.
It should help you move from basic command usage to a real understanding of how Git works.

## Quick Summary

- Part 1 builds the foundation
- Part 2 teaches collaboration
- Part 3 covers advanced history management

Read it in order, practice locally, and keep the mental model of the three trees in mind.
