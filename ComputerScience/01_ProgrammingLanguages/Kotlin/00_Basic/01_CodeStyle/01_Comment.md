# Comment in Kotlin

## End-of-line comments

After "//", the compiler ignores any remaining text on the line.

## Multi-line comments

The compiler ignores any text between the /* and */ symbols. You can use them for writing both single-line and multiple-line comments:

```kotlin
fun main() {
    /* This is a single-line comment */
    /*  This is an example of
        a multi-line comment */

    /*** Valid multiline comment
        println("Hello")
        println("World")
    **/
}
```

## Documentation comments (doc comments)

Documentation is a text that helps others understand what your code does. You can use these kinds of comments to automatically generate documentation about your source code using a special tool. Usually, these comments are placed above the declarations of respective program elements. Also, in this case, some special labels, such as `@param`, `@return`, and others are used for controlling the tool.