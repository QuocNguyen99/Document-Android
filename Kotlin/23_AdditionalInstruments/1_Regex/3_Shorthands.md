# Shorthands

## The list of shorthands

There are several pre-defined shorthands for the commonly used character sets:

- `\d` is any digit, short for `[0-9]`;

- `\s` is a whitespace character (including tab and newline), short for `[ \t\n\x0B\f\r]`;

- `\w` is an alphanumeric character (letter or numeral), short for `[a-zA-Z_0-9]`;

- `\b` is a word boundary. This one is a bit trickier: it doesn't match any specific character but rather matches the boundary between 
    - an alphanumeric character or underscore and a non-alphanumeric character (for example, a whitespace character) 
    - a boundary of a string (its end or start). 
    
    
This way, `"\ba"` matches all words (sequences of alphanumeric characters) starting with `"a"`, `"a\b"` matches all words ending with `"a"`, and `"\ba\b"` matches the standalone letter `"a"` when it is surrounded by non-alphanumeric characters (like spaces or punctuation).

There are also negative counterparts of these shorthands

- `\D` is a non-digit, short for `[^0-9]`;

- `\S` is a non-whitespace character, short for `[^ \t\n\x0B\f\r]`;

- `\W` is a non-alphanumeric character, short for `[^a-zA-Z_0-9]`.

- `\B` is a non-word boundary. It matches the case opposite to that of the `\b` shorthand: it finds its match every time whenever there is no `"gap"` between alphanumeric characters. For example, `"a\B"` matches all words that start with `"a"`.

> [!NOTE]
> Each shorthand has the same first letter as its representation (digit, space, word, boundary)