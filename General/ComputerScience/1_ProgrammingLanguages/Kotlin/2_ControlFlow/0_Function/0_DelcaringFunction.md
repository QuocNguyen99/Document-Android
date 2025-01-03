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


## Single-expression functions

If a function returns a single expression, you can write it without curly braces. It's an idiomatic way to create concise functions

Ex: 

```kotlin
    fun sum(a: Int, b: Int): Int = a + b
    fun sayHello(): Unit = println("Hello")\
    fun isPositive(number: Int): Boolean = number > 0
```