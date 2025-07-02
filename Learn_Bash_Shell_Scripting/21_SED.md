# SED: Stream Editor

SED is a text editor with **no interactive interface**.

- SED can edit files without opening them.
- Can perform search and replace operations.

---

## Syntax

```bash
$ sed [option] 'commands' input_file
```
> By default, SED doesn't change the original file.

---

## Basic Substitution

- **Replace the first occurrence of a word in every line:**

   ```bash
   $ sed 's/old/new/' input.txt
   ```
   **Example:**
   ```
   Input:  hello old world
   Output: hello new world
   ```

- **Replace the second occurrence of a word in every line:**

   ```bash
   $ sed 's/old/new/2' input.txt
   ```
   **Example:**
   ```
   Input:  old old old
   Output: old new old
   ```

- **Replace all occurrences of a word in every line (global):**

   ```bash
   $ sed 's/old/new/g' input.txt
   ```
   **Example:**
   ```
   Input:  old old old
   Output: new new new
   ```

---

## Addressing

- **Replace a word in a specific line:**

   ```bash
   $ sed '1 s/old/new/g' input.txt
   ```
   **Example:**
   ```
   Input:
   old old
   old world
   Output:
   new new
   old world
   ```

---

## Regular Expressions

- **Replace the first word at the beginning of each line:**

   ```bash
   $ sed 's/^old/new/' input.txt
   ```
   **Example:**
   ```
   Input:  old world
   Output: new world
   ```

- **Replace a word at the end of each line:**

   ```bash
   $ sed 's/old$/new/' input.txt
   ```
   **Example:**
   ```
   Input:  hello old
   Output: hello new
   ```

- **Replace words in a range of lines:**

   ```bash
   $ sed '2,3 s/old/new/g' input.txt
   ```
   **Example:**
   ```
   Input:
   old
   old old
   old old old
   Output:
   old
   new new
   new new new
   ```

   ```bash
   $ sed '2,$ s/old/new/g' input.txt
   ```
   **Example:**
   ```
   Input:
   old
   old old
   old old old
   Output:
   old
   new new
   new new new
   ```
---

## SED Operators

- **Duplicate the replaced line(s):**

   ```bash
   $ sed 's/old/new/p' input.txt
   ```
   **Example:**
   ```
   Input:  old world
   Output:
   new world
   new world
   ```

- **Print only changed lines:**

   ```bash
   $ sed -n 's/old/new/p' input.txt
   ```
   **Example:**
   ```
   Input:  old world
         hello world
   Output:
   new world
   ```

- **Delete a line containing a certain word:**

   ```bash
   $ sed '/old/d' input.txt
   ```
   **Example:**
   ```
   Input:  old world
         hello world
   Output:
   hello world
   ```
   ```bash
   # delete multiple lines
   $ sed '2,3d' input.txt
   ```
   **Example:**
   ```
   Input:
   old
   old old
   old old old
   Output:
   old
   new new
   new new new
   ``` 
   **Example:**
   ```bash
   # Delete empty lines
   $ sed '/^$/d' input.txt
   ```

   **execute multiple commands**
   ```bash
   $ sed -e 's/old/new/g' -e 's/world/planet/g' input.txt
   ```
   **Example:**
   ```
   Input:  old world
   Output: new planet
   ```

- **Read SED commands from a file:**

   ```bash
   $ sed -f commands.sed input.txt
   ```
   *(where `commands.sed` contains SED commands)*

- **Change and save to input file (in-place):**

   ```bash
   $ sed -i 's/old/new/g' input.txt
   ```

---

**Note:**  
- `$` refers to the last line.
- `g` is for global replacement.
- `p` prints the replaced line.
- `-n` suppresses automatic printing.
- `-i` edits files in place.
- `-f` reads SED commands from a file.
- `-e` allows multiple commands to be executed.
- `d` deletes lines matching the pattern.
- `s` is the substitute command.
- `^` matches the start of a line.