# CharSequence

CharSequence in Kotlin is an interface that represents a sequence of characters. It is designed to be **immutable**. which means that its contents cannot be changed after it has been created.


some of the methods available for `CharSequence`:

- `charAt()` returns the character at the specified index (in this case, the first character).

- `subSequence()` returns a new `CharSequence` representing a range of characters from the original `CharSequence` (in this case, the characters from index 1 to 4).

- `contains()` checks if a specified character or character sequence is present in the CharSequence (in this case, checking if "amp", case-insensitive, is present in the CharSequence).

## CharSequence vs String (difference)

The most significant difference between `CharSequence` and `String` is that `CharSequence` is an interface, whereas `String` is a concrete class in Kotlin.

`CharSequence` can be thought of as a more general interface that String implements. Any `String` is a `CharSequence`, but not every `CharSequence` is a String.

Another difference between `CharSequence` and `String` is case sensitivity. `CharSequence` is case-sensitive, while `String` is case-insensitive

```kotlin
fun main() {
    val string: String = "Hello, World!"
    val charSequence: CharSequence = string

    println(string.uppercase()) // prints "HELLO, WORLD!"
    // The following line won't compile because CharSequence doesn't have an uppercase() function
    // println(charSequence.toUpperCase())
}
```

In summary, `String` is a concrete class that implements the `CharSequence` interface and provides additional functionality, while `CharSequence` is an interface that defines a sequence of characters that can be implemented by different classes.

## CharSequence usage (when to use, how to convert to String)

`CharSequence` can be used in situations where we need to represent a sequence of characters but do not know the exact implementation of the sequence beforehand.

For example, if we want to read a large file into memory, we may not know the exact length of the file, so we can use `CharSequence` to represent the file's contents.

To convert `CharSequence` to String, we can simply use the `toString()` method.

Note that any `String` object can be also used as a `CharSequence` object, since `String` implements the `CharSequence` interface.