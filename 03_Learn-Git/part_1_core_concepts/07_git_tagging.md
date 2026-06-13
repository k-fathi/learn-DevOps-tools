# Tags in Git 
Tags in Git are used to mark specific points in the commit history as important. They are often used to mark release points (e.g., v1.0, v2.0) or other significant milestones in the project. Tags can be lightweight (just a name pointing to a commit) or annotated (which includes additional metadata such as the tagger's name, email, date, and a message).
Tags are applied on the current commit.

## Common Git Tag Commands

```bash
# Create a lightweight tag
git tag <tag_name>        

# Create an annotated tag
git tage -a <tag_name> -m "Tag message" 

# List all tags
git tag

# Show details of a specific tag
git show <tag_name>
```

You can also search for tags that match a particular pattern. The Git source repo, for instance, contains more than 500 tags. If you’re interested only in looking at the 1.8.5 series, you can run this:

```bash
git tag -l "v1.8.5*"

# Example output
# v1.8.5
# v1.8.5-rc0
# v1.8.5-rc1
# v1.8.5-rc2
# v1.8.5-rc3
# v1.8.5.1
# v1.8.5.2
# v1.8.5.3
# v1.8.5.4
# v1.8.5.5
```

## Deleting tags
To delete a tag on your local repository, you can use git tag -d <tagname>. For example, we could remove our lightweight tag above as follows:

```bash
git tag -d v1.4-lw

# output: Deleted tag 'v1.4-lw' (was e7d5add)
```