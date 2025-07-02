# Groups
> `cat /etc/group` # display all groups and its members, primary groups will not be printed.
- ![alt text](screens/image-32.png)

### Content of `group` file:
- each line has 4 fields
- ![alt text](screens/image-33.png)

- `groups <user>`		# to display the groups that  the user is member in
- > ![alt text](screens/image-54.png) 


# `Hwo to create a group?!`
- `groupadd <option> group`
	- -g 		# assign a group id
- `usermod -aG group user` #adding a user to group

# `How to Modifiy a group?!`
- `groupmod <option> group`
> ![alt text](screens/image-53.png)
- `groupmod -n <newname> <oldname>` # change the group name

- `newgrp group` 		# to change the current primary group at the current session

> new group id = last group id + 1, [if -g is not used]

> ![alt text](screens/image-49.png)



# `How to add/remove Users to/from groups?!`
- ## `usermod -aG group user` 
> ![alt text](screens/image-50.png)

- ## `gpasswd -a user group`
> ![alt text](screens/image-51.png)


# `How to delete a group?!`
- `groupdel group`
> ![alt text](screens/image-52.png)
