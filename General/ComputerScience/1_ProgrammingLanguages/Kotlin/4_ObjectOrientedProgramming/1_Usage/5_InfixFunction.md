# Infix functions

## Infix notation

The infix notation is used in arithmetical and logical code.
It is characterized by the placement of operators between operands: for example, `2 + 3`, where "+" is the infix operator.

To define an infix function, you must meet the following requirements.

- They must be member functions or extension functions.
- They must have a single parameter.
- The parameter must not accept variable number of arguments and must have no default value.

To define your own functions with the infix notation, just add the infix keyword to your function definition.

```kotlin
infix fun Int.add(x: Int): Int = this + x

fun main() {
    println(1.add(2)) // result is 3 as extension function
    println(1 add 2)  // result is 3 as infix function
}
```

You can create infix functions whenever you want: for example, to improve the readability of your code or create a DSL (Domain Specific Language).

**But remember**, infix function calls have lower precedence than arithmetic operators or other elements defined in the language, like type casts and the `rangeTo` operator.

On the other hand, an infix function's call precedence is higher than that of the boolean operators `&&` and `||`, `is` and `in` checks, and some other operators.

> [!NOTE]
> Remember also that infix functions always require both the receiver and the parameter to be specified and that you must use this to reference the current receiver.