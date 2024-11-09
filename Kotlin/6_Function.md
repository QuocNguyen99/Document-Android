# Kotlin function

A function is a sequence of instructions, we can invoke it from a program by calling its name. Functions represent subprograms, and they perform some actions
Basically, it is just a box that processes input arguments (input data) and produces either a useful result or nothing.

## Function arguments

When we want to use a function, we can invoke (or call) it using its name followed by parentheses. 
If a function takes one or more arguments (input data), they should be passed in the parentheses.
Function can also take no arguments at all.

## Function result

Some functions not only take arguments but also produce (return) some results. You can also assign it to a variable

## Basic syntax

A function has a name, so you can invoke it when you need it.

To declare a new function, you need to indicate the fun keyword and a function name, a list of parameters in parentheses, and the type of the result value.

```kotlin
fun functionName(p1: Type1, p2: Type2, ...): ReturnType {
    // body
    return result
}
```

> [!NOTE]
> The arguments of a function can be accessed only in the function. 
> The line after the return statement will not be executed (the so-called unreachable code)

## Named arguments

### Improving code readability

We can declare standard variables and pass them on, but sometimes you have to work with literals, not variables. Named arguments can make our code more readable.

```kotlin
val amount = calcEndDayAmount(
    startAmount = 1000,
    ticketPrice = 10,
    soldTickets = 500
) 
```
### Reordering arguments

You can change the order of arguments in a function call with the help of named arguments. All you need to do is to specify the names in any order you want:

```kotlin
val amount = calcEndDayAmount(
    ticketPrice = 10,
    soldTickets = 500,
    startAmount = 1000
)
```
### Named and positional arguments

You can also call a function with named and regular (positional) arguments, as long as named arguments are placed after positional ones:

```kotrlin
calcEndDayAmount(1000, ticketPrice = 10, soldTickets = 500)  // 6000
```

Kotlin 1.4 or later allows you to use positional arguments after named arguments, but you need to maintain their order. For example:

```kotlin
calcEndDayAmount(ticketPrice = 10, 500, 1000)   // Incorrect invocation!
calcEndDayAmount(startAmount = 1000, 10, 500)   // OK


calcEndDayAmount(soldTickets = 500, ticketPrice = 10, startAmount = 500) // OK
calcEndDayAmount(soldTickets = 500, ticketPrice = 10, 500)  // Incorrect invocation!
```

### Named arguments and default values

The default values for function parameters may or may not be constant. They can also be another named argument or a function.

```kotlin
fun sum2(a: Int, b: Int = a) = a + b
 
sum2(1)    // 1 + 1
sum2(2, 3) // 2 + 3
```

## Single-expression functions

If a function returns a single expression, you can write it without curly braces. It's an idiomatic way to create concise functions

Ex: 

```kotlin
    fun sum(a: Int, b: Int): Int = a + b
    fun sayHello(): Unit = println("Hello")\
    fun isPositive(number: Int): Boolean = number > 0
```

## Functions as objects

Kotlin provides a way to work with functions as if they were objects.

### First-class citizen

First-class citizens in programming are the objects that:

1. can be stored as variables,
2. can be returned by a function,
3. can be passed to a function as an argument,
4. don't depend on their name (Ex: An Int with the ten name doesn't need to be 10. And vice versa: the 10 value doesn't need to be stored under the ten name.)
5. can be created at the program runtime (the time when the program is working).

For example, an Int is a first-class citizen in Kotlin. In fact, functions are first-class citizens in the Kotlin language too.

### Function types

Kotlin has built-in support for function types. The syntax of a function type is this:

`(parameters' types) -> return value type`

In a function type there are **arrow symbols** `(->)` in the **middle**, also, there are **parenthesized parameters' types split by commas** on the **left**, and, finally, the return value **type** is written on the **right**.

Let's recall some functions from previous topics and use them as examples:

```kotlin
fun sum(a: Int, b: Int): Int = a + b
```

`sum` has a type of `(Int, Int) -> Int`.

```kotlin
fun sayHello() {
    println("Hello")
}
```
`sayHello` has a type of `() -> Unit` 

### Function references as objects

Also, Kotlin allows getting references to functions. 
To get a reference to a top-level function, we simply need to write double colon (::) before its name and we don't write parentheses and arguments after the name.  Take a look at the example: `::sum` gives us an object of the `(Int, Int) -> Int` type.

> [!NOTE] 
> In Kotlin, a top-level function is a function that is defined at the top level of a file, outside of any class or object.



Now we are ready to assign function references to values! We can create values this way:

```kotlin
val sumObject = ::sum
```

Don't confuse this assignment with saving function result to a value like this: `val sumResult = sum(1, 2)`. The `sumResult` value has the `Int` type because the **result** of the invoked sum function is just a **number.** Meanwhile, the `sumObject` value is initialized with a reference to the `sum` function (`::sum`), so it has the type of the `sum` function.

We can also specify the type of the sumObject value explicitly:

```kotlin
val sumObject: (Int, Int) -> Int = ::sum
```

In both cases, we have an opportunity to invoke the original sum function by **invoking the object**: `sumObject(10, 20)` returns `30` as if we invoked the original function with these arguments directly.


### Functions returning other functions
Since a function can be stored as an object, why not create a function that returns such an object?
Example:

```kotlin
fun getRealGrade(x: Double) = x
fun getGradeWithPenalty(x: Double) = x - 1

fun getScoringFunction(isCheater: Boolean): (Double) -> Double {
    if (isCheater) {
        return ::getGradeWithPenalty
    }

    return ::getRealGrade
}
```

So if we do `val wantedFunction = getScoringFunction(false)`, the wantedFunction value will contain a reference to a grade function for an honest student. Seeing the `getScoringFunction` function implementation, we can say that in this case the `wantedFunction` value contains a reference to the `getRealGrade` function. So the result of the `wantedFunction(9.0)` will be equal to `9.0`.

### Function references as function parameters

Also, you can create functions that take other functions as arguments.

Ex:
```kotlin
fun applyAndSum(a: Int, b: Int, transformation: (Int) -> Int): Int {
    return transformation(a) + transformation(b)
}
```
It receives two integers, transforms them using the received transformation function, and returns the sum of the transformed integers. We can declare some transformation functions:

```kotlin
fun same(x: Int) = x
fun square(x: Int) = x * x
fun triple(x: Int) = 3 * x
```

And then pass them to the former function:

```kotlin
applyAndSum(1, 2, ::same)    // returns 3 = 1 + 2
applyAndSum(1, 2, ::square)  // returns 5 = 1 * 1 + 2 * 2
applyAndSum(1, 2, ::triple)  // returns 9 = 3 * 1 + 3 * 2
```

### Real-world usage

What about more realistic examples? Well, see for yourself.

The String type has the filter method to filter symbols. How does it know which symbols to remove from the string and which ones to leave in it? The answer is simple: this method takes a **predicate** as an argument and then uses it for internal computations. **A predicate is a function that takes an argument and returns a Boolean result**. So in the filter method, the predicate says if the symbol should be left and has the (Char) -> Boolean type.

Let's try to use this method. If we want to remove dots from a string, we declare this predicate:

```kotlin
fun isNotDot(c: Char): Boolean = c != '.'
```

Then we can do something like this:

```kotlin
val originalText = "I don't know... what to say..."
val textWithoutDots = originalText.filter(::isNotDot)
```

## Lambda expressions

the opportunity to create a function at runtime and without a predefined name. That's lambda! Lambda is one of the most important features and is used profusely in modern programming.

### Functions without names

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

So how can we use a function without a known name?.

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

### Implicit name of a single parameter: it

When there is a single parameter in a lambda, there is an opportunity to skip it. The parameter is available under the `it` name. The type of `it` is inferred from the type of the argument being passed to the lambda. 

Returning from a lambda expression in Kotlin is achieved using `return@label`, where `label` is a tag, usually matching the name of the **higher-order function** in the context of which the lambda was called. Returning with `return@label` allows for exiting the lambda expression without interrupting the execution of the outer function.





