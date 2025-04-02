# Shorthands

## The list of shorthands

There are several pre-defined shorthands for the commonly used character sets:

- `\d` is any digit, short for `[0-9]`;

- `\s` is a whitespace character (including tab and newline), short for `[ \t\n\x0B\f\r]`;

- `\w` is an alphanumeric character (letter or numeral), short for `[a-zA-Z_0-9]`;

- `\b` is word boundary `\b` matches the boundary between:  
  - A word character (a-z, A-Z, 0-9, _) and a non-word character (like spaces or punctuation).  
  - The start or end of a string.
  
**Examples:**  `\ba` matches words starting with "a", `a\b` matches words ending with "a", `\ba\b` matches "a" when it stands alone.

There are also negative counterparts of these shorthands

- `\D` is a non-digit, short for `[^0-9]`;

- `\S` is a non-whitespace character, short for `[^ \t\n\x0B\f\r]`;

- `\W` is a non-alphanumeric character, short for `[^a-zA-Z_0-9]`.

- `\B` is a non-word boundary. It matches the case opposite to that of the `\b` shorthand: it finds its match every time whenever there is no `"gap"` between alphanumeric characters. For example, `"a\B"` matches all words that start with `"a"`.

> [!NOTE]
> Each shorthand has the same first letter as its representation (digit, space, word, boundary)