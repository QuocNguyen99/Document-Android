# Advanced lambda expressions

## Complex lambdas

the last line inside the lambda is treated as the lambda return value.

In Kotlin, "earlier returns" refer to the ability to terminate the execution of a lambda expression or a function before reaching the end of its block by using the `return` keyword.

Earlier returns must be written using the **qualified return syntax**. This means that after the `return` keyword, we need to write the `@` symbol and the label name. The label name is usually the name of the function where the lambda is passed.

Example:

```kotlin
fun processNumbers(numbers: List<Int>, action: (Int) -> Unit) {
    numbers.forEach label@{ number ->
        if (number < 0) return@label // Using qualified return to skip negative numbers
        println("Processing: $number")
        action(number) // Calling the lambda function
    }
    println("Processing completed!") // This line still executes because return only exits the lambda
}

fun main() {
    val numbers = listOf(5, -3, 8, -1, 10)

    processNumbers(numbers) { num ->
        val result = num * 2 // Last line in lambda -> implicitly returned value
        println("Doubled: $result")
    }
}
```

## Capturing variables

Capturing variables also known as using a captured value, refers to the process of enclosing a variable in a lambda expression or anonymous function so that it can be used inside the function's body.

> [!NOTE]
> When you capture a variable in a closure, you're essentially making a copy of the variable and making it available to the function even if the original variable goes out of scope or is no longer accessible. That allows you to write functions that depend on variables from their surrounding environment, without having to pass those variables as arguments to the function.

Now let's discuss the advantage of creating functions at runtime. The point is that all the variables and values that are visible where the lambda is created are visible inside the lambda, too.

**If a lambda uses a variable that is declared outside the lambda, then we say that the lambda captures the variable**.

That works intuitively. In the case of a captured value, the lambda can just read it. If a variable is captured, the lambda and the outside code can change it, and these changes will be visible both in the lambda and in the outside code.

Take a look at the example below:

```kotlin
var count = 0

val changeAndPrint = {
    ++count
    println(count)
}

println(count)    // 0
changeAndPrint()  // 1
count += 10
changeAndPrint()  // 12
println(count)    // 12
```
