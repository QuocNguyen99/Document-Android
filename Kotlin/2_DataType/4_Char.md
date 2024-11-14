## Char type

A character can also be represented by its hexadecimal code in the Unicode table. The code starts with `\u`:

```kotlin
val ch = '\u0040' // it represents '@'
println(ch) // @
```

Although we use a sequence of characters to represent such code, the code itself represents exactly one character.

### Escape sequences

There are some special characters starting with a backslash `\`, which are known as **escape** or **control sequences**.

- `'\n'` is the newline character;
- `'\t'` is the tab character;

- `'\r'` is the carriage return character;

- `'\\'` is the backslash character itself;

- `'\''` is the single quote mark;

- `'\"'` is the double quote mark.

### Relational operations with characters

You can compare characters using relational operations (`==,` `<`, `>`, `<=`, `>=`, and `!=`) according to their position in the Unicode table.


Using relational operations and codes, we can check whether a Char is a digit: all ten digits have codes from '\u0030' to '\u0039'.

```kotlin
fun main() {
    val ch = readln().first()
    val isDigit = ch >= '\u0030' && ch <= '\u0039'

    println(isDigit)
}
```

