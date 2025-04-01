# Lambda expressions

the opportunity to create a function at runtime and without a predefined name. That's lambda! Lambda is one of the most important features and is used profusely in modern programming.

## Functions without names

To create a Kotlin function that isn't bound to its name, you can use either an **anonymous function** or a **lambda expression**:

- `fun(arguments): ReturnType { body }` – this is commonly called an **anonymous function**.
- `{ arguments -> body }` – this is commonly called a "lambda expression".

Example:

```kotlin
fun(a: Int, b: Int): Int {
    return a * b
} // normal function but no name 

{ a: Int, b: Int -> a * b } // we shifted the parameter or argument in the curly braces
```


Note that if you want to declare a **lambda without arguments**, you do not need to write the "arrow symbols". A lambda without argument definition looks like this: `{ body }`.

## So how can we use a function without a known name?.

1. You can assign the function to a variable and then invoke it by invoking the variable
```kotlin
val greet = { name: String -> println("Hello, $name!") }
greet("Alice") // Output: Hello, Alice!
```
2. You can pass such a function as an argument or return such a function from another function.
```kotlin
fun execute(action: (Int) -> Int, number: Int) {
    println("Result: ${action(number)}")
}

val double = { x: Int -> x * 2 }
execute(double, 5) // Output: Result: 10

fun createMultiplier(factor: Int): (Int) -> Int {
    return { x: Int -> x * factor }
}

val triple = createMultiplier(3)
println(triple(4)) // Output: 12
```
3. You can place parentheses with desired arguments right after the function definition to invoke it in place.

```kotlin
({ x: Int, y: Int -> x + y })(3, 5) // Output: 8
```

> [!WARNING]
> Moreover, there are programmers who don't stick to Kotlin official naming rules and can say "an anonymous function" instead of "a lambda". Despite the fact that everybody understands them, we suggest that you use the proper naming.

## Implicit name of a single parameter: it

When there is a single parameter in a lambda, there is an opportunity to skip it. The parameter is available under the `it` name. The type of `it` is inferred from the type of the argument being passed to the lambda. 

Returning from a lambda expression in Kotlin is achieved using `return@label`, where `label` is a tag, usually matching the name of the **higher-order function** in the context of which the lambda was called. Returning with `return@label` allows for exiting the lambda expression without interrupting the execution of the outer function.
