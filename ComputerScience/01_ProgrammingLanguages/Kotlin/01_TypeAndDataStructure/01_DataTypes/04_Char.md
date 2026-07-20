## Char Type

A character can be represented by its Unicode hexadecimal code, starting with `\u`:

```kotlin
val ch = '\u0040' // '@'
println(ch) // @
```

The code represents exactly one character.

### Escape Sequences

Special characters starting with `\` are called **escape sequences**:

- `\n`: newline
- `\t`: tab
- `\r`: carriage return
- `\\`: backslash
- `\'`: single quote
- `\"`: double quote

### Relational operations with characters

Characters can be compared using relational operators (`==`, `<`, `>`, `<=`, `>=`, `!=`) based on their Unicode positions.

To check if a character is a digit (codes `\u0030` to `\u0039`):

```kotlin
fun main() {
    val ch = readln().first()
    val isDigit = ch in '\u0030'..'\u0039'
    println(isDigit)
}
```

