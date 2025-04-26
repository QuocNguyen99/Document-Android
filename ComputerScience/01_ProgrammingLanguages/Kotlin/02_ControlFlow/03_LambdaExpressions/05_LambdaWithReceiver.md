# Lambda with receiver

**Receiver Definition**

In the context of extension functions, the receiver is an object instance that extends its functionality by the function.  Receivers can be omitted to give you direct access to the receiver’s members.
## Working with lambdas with receivers

- A **lambda with a receiver** is a way to define behavior similar to an extension function, and it uses lambda expressions to operate with some object.

- With **lambdas with receivers**, you indicate how methods are resolved in the lambda body. The receiver is an extension function type.

-  It **enables the access to the visible methods and properties of the receiver of the lambda** in its body without any additional qualifier.

Example :

```kotlin
val sum: Int.(Int) -> Int = { a -> this + a }

fun main() {
    println(sum(1, 2)) // 3
    println(1.sum(2)) // 3
}
```

Function types can optionally have an additional receiver type, which is specified before the dot in the notation: ` A.(B) -> C { body }`  **represents functions that can be called on a receiver object A with a parameter B, return a value C, and perform any action in the body.**
