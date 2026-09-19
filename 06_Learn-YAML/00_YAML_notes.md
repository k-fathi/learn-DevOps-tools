# The three primitive/basic data structure 

- Scaler (string, numbers, Boolen)
- Mapping [Hashes or Dictionaries]
- Sequences [Arrays, List] 

----------------------------------

## Comments
    # This is a comment

## Start and End of Document
    ---
        Document
    ...
   - Markers For each Document
   - The streem/YAML file can has more than Document  

## YAML tools:

> ``https://onlineyamltools.com/validate-yaml``
> ``http://jsonformatter.org/yaml-viewer``

-----------
# [1] YAMEL Data Structure [Key/Value pairs]
   - > ``key: value``   # Key/value pair 
        - space must be spisified after colon ":" 
        - the kay may be one or more words separted by spase, dash or underscore  
        - they are not the same 

        * In YAML, 'key': 'pair' is not equal to key: pair.
        * 'key': 'pair' treats both the key and value as strings with explicit quotes.
        * key: pair treats the key as a plain scalar and the value as a plain scalar without quotes.
### Example:
![key: pair](screens/image-1.png)

# [2] YAMEL Data Structure [Dictionaries / Mappings / Hashes]

   - list of items with indented space
   - mappings means assign pairs to a key
     - parent & childs
   - {} ->  means dictionary of items
   - Dictionary may be only one key pair or more 
![Mappings](screens/image.png)
        

# [3] YAMEL Data Structure [Listst / Arrays / Sequences]
    - list of items with indentation 
### Example
![Lists](screens/image-2.png) 



# Advanced YAML Features:
- Aliases/Anchor:
   - make aliases for values to use it anywhere
	   * ![alias](screens/image-7.png)
	- make anchor for the whole dictonary:
		* ![alt text](screens/image-8.png)
- Multi line String (> , | , ?): 
   - key: > 
      ![alt text](screens/image-3.png)
   - key: |  
      * adding a line feed '\n' after each line 
      * kep the formating correct
      * ![alt text](screens/image-4.png)
   - ? key:
      * for multi-line key
      * ![alt text](screens/image-5.png)	
	

# Application Programming Interface [API]
![API](screens/image-9.png)
