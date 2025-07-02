# Reading Files in Bash

The `read` command is commonly used to read a file line by line in Bash. A `while` loop is typically used to process each line until the end of the file.

## Basic Syntax

```bash
while read line
do
    # command to process "$line"
done < input.file.txt
```

## Explanation of Options

- `IFS=`: Clears the Internal Field Separator to preserve leading/trailing whitespace.
- `read -r`: Reads the line as-is, without interpreting backslashes (`\`) as escape characters.
- `input.file.txt`: The file to be read.
- `<`: Redirects the file input to the `while` loop.
- `line`: Variable that stores each line read from the file.
- `line` can be replaced with any variable name. 
- `line` can be replaced by multiple variable names to split each line into fields. For example, `read filed1 filed2` will assign the first filed of each line to `filed1` and the rest to `filed2`, depending on the `IFS` setting.
## Example

Suppose `input.file.txt` contains:

```
Hello, World!
    This is a test.
\Line with a \ backslash.
```

**Script:**

```bash
while IFS= read -r line
do
    echo "Read line: $line"
done < input.file.txt
```

**Output:**

```
Read line: Hello, World!
Read line:     This is a test.
Read line: \Line with a \ backslash.
```

## Notes

- By default, `read` interprets `\` as an escape character. Use `-r` to read lines literally.
- Setting `IFS=` prevents word splitting and preserves whitespace.
- Always quote variables (e.g., `"$line"`) to avoid issues with spaces or special characters.
