# Arrays in Bash

An **array** is a data structure that stores multiple values of the same type under a single variable name.

- **Declare an array:**
   ```bash
   arr_name=(element1 element2 element3)
   ```

- **Access elements:**
   - First element: `${arr_name[0]}`
   - Second element: `${arr_name[1]}`

- **Print all elements:**
   ```bash
   echo "${arr_name[@]}"
   # output: element1 element2 element3
   ```

- **Print all indices:**
   ```bash
   echo "${!arr_name[@]}"
   # output: 0 1 2
   ```

- **Number of elements:**
   ```bash
   echo "${#arr_name[@]}"
   # output: 3
   ```

- **Add a new element:**
   ```bash
   arr_name+=(element4)
   # output: element1 element2 element3 element4
   ```

- **Remove an element (e.g., index 3):**
   ```bash
   unset arr_name[3]
   echo "${arr_name[@]}"
   # output: element1 element2 element3
   ```

- **Print a range of elements (from index `x`, `y` elements):**
   ```bash
   echo "${arr_name[@]:1:2}"
   # output: element2 element3
   ```


# Don't be confused by the square brackets `[]`, curly braces `{}`, and parentheses `()`.
## - 👉 `[]` is used for indexing arrays and accessing elements.
## - 👉 `{}` is used for parameter expansion. --> printing variables or parts of them.
## - 👉 `()` is used for creating arrays and assigning new values to an array.