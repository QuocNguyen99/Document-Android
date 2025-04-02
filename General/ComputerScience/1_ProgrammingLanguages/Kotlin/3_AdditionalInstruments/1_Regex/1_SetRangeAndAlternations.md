# Sets, ranges, and alternations


## Sets of characters

Each set consists of multiple characters but corresponds to a single character in the string. Sets are enclosed in square brackets `[]`. For example, the set `"[abc]"` means that a single character `"a"`, `"b"`, or `"c"` can match it. Take a look at the example below:

```kotlin
val regex = Regex("[bcr]at") // it matches strings "bat", "cat", "rat", but not "fat"

regex.matches("rat") // true
regex.matches("fat") // false
```

You can use as many sets as you want and combine them with regular characters. There are two sets in the following example:

```kotlin
val pattern = "[ab]x[12]" // can match a or b followed by x followed by either 1 or 2
```

This pattern can be successfully matched by the following strings:
```kotlin
"ax1", "ax2", "bx1", "bx2"
```

Meanwhile, the following strings do not match the pattern:

```kotlin
"xa1", "aax1", "bx"
```


**As you can see, the order of sets in regular expressions is important. On the other hand, the order of characters within the set does not matter.**

## Ranges of characters

we can specify a range designated by the hyphen symbol `-` instead. The character that precedes the hyphen denotes the starting point of the range; the character after the hyphen is the last character that falls into the range. We can put characters into a set as a range if they immediately follow each other in the ASCII/Unicode encoding table.

```kotlin
val anyDigitPattern = "[0-9]" // matches any digit from 0 to 9
```

The same works for letter ranges, such as `"[a-z]"` or `"[A-Z]"`. These ranges match all Latin lowercase and uppercase letters respectively. These patterns are case-sensitive; for a case-insensitive match, we can write the following regex:

```kotlin
val anyLetterPattern = "[a-zA-Z]" // matches any letter "a", "b", ..., "A", "B", ...
```

> [!WARNING]
> Note that although the range [A-z] is technically valid, it includes additional symbols that are placed between uppercase and lowercase letters in the ASCII table.

> [!TIP]
> you can easily put several ranges in one set and mix them with separate characters in any order:

```kotlin
val anyLetterPattern = "[a-z!?.A-Z]" // matches any letter as well as "!", "?", and "."
```

## Excluding characters

In some cases, you may want to define which characters are not wanted. Then, you can write a set that will match everything except the characters mentioned in it. To do that, we write the hat character `^` as the first one in the set.

```kotlin
val regex = "[^abc]".toRegex() // matches everything except "a", "b", and "c"

regex.matches("a") // false
regex.matches("b") // false
regex.matches("c") // false
regex.matches("d") // true
```
## Avoiding characters in sets


- **Literal characters** inside sets `[ ]` don’t need escaping.
- Example: `[.?!]` matches `.`, `?`, and `!` only.

## 🔹 Handling Special Cases:
- **Hyphen (`-`)**: Place it first or last to match literally.  
  - Example: `[-a-z]` (matches hyphen + lowercase letters), `[A-Z-]` (matches hyphen + uppercase letters).  
- **Caret (`^`)**: Escaping is needed **only if at the start** of the set.  
  - Example: `[^a-z^]` (matches everything except lowercase letters and `^`).  
- **Square brackets (`[]`)**: Always escape them (`\[ \]`) to match literally.
  - Example: `val regex = Regex("[\\[\\]]") // matches "[" and "]"`

## Alternations

So far, we've been talking about **single characters**. However, there's also a way to match **longer sequences**. The vertical bar `|` is used to match character sequences either before or after the symbol:

```kotlin
val regex = "yes|no|maybe".toRegex() // matches "yes", "no", or "maybe", but not "y" or "e"

regex.matches("no") // true
```

In general, alternations are quite similar to sets: they describe multiple alternatives that a particular part of the pattern can match. **However, while sets can match only a single character in the string, alternations are used to define multi-character alternatives**.

