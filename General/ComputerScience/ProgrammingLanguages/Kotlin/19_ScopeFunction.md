# Scope function

There is a lot of syntax sugar in Kotlin that allows you to make your code more readable and clear. One of the examples is scope functions. 

There are five scope functions in Kotlin: `let`, `run`, `with`, `apply`, and `also`.

They don't perform any specific actions but just organize your code and execute certain operations in the object context. 
These functions create a temporary scope for objects and invoke code from lambdas.
Inside a lambda, we can communicate with objects using the keywords `it` or `this`

## apply

Here are two major features of the `apply` function:
- The context object is available as `this`.
- The function returns the context object.

We have to use `apply` to set object parameters.

Example

```kotlin
fun main() {
    val thom = Musician("Jonny Greenwood")
        .apply {
            instrument = "Harmonica"
            band = "Pavement"
        }.copy(name = "Thom York") // After .apply we have an instance of Musician()
}
```

## also
Here are two major characteristics of the `also` function:
- The context object is available as `it`.
- The function returns the context object.

We have to use `also` to do some additional things with objects.

## with

Here are the main characteristics of the with function:
- Context object is available as `this`.
- It returns the result of a lambda.
- It isn't an extension function.

`with` is used in two cases:

1. when we want to do something with the context object and don't want to receive a result.

```kotlin
val musicians = mutableListOf("Thom York", "Jonny Greenwood", "Colin Greenwood")
with(musicians) {
    println("'with' is called with the argument $this")
    println("List contains $size elements")
} // We print the needed data and don't try to get a certain result
```

2. we use `with` when we want to make an accessory object whose parameters or functions may be used to calculate the result.

```kotlin
val musicians = mutableListOf("Thom York", "Jonny Greenwood", "Colin Greenwood")
val firstAndLast = with(musicians) {
    "First list element - ${first()}," +
    " last list element - ${last()}"
}
println(firstAndLast) // We create a new variable firstAndLast and pass the result of calculations inside the function body to it. After that we print this variable.
```

## let

Here are the main features of the `let` function:
- Context object is available as `it`.
- It returns the result of a lambda.

`let` is used in two general cases:
1. when we want to do something with the safety call operator `?` and non-null objects

```kotlin
val str: String? = "Jonny Greenwood"  
//processNonNullString(str)       // compilation error: str can be null

val length = str?.let {
    println("let() is called on $it")       
    processNonNullString(it)      // OK: 'it' is not null inside '?.let { }'
    it.length
}
```

2. we use let when we want to enter local variables with a limited scope.


```kotlin
val musicians = listOf("Thom York", "Jonny Greenwood", "Colin Greenwood")
val modifiedFirstItem = musicians.first().let { firstItem ->
    println("The first item of the list is '$firstItem'")
    if (firstItem.length >= 5) firstItem else "!" + firstItem + "!"
}.uppercase()
println("First item after modifications: '$modifiedFirstItem'")
```
## run

Now, look at the characteristics of the run function:

- Context object is available as `this`.
- It returns the result of a lambda.

`run` is used in two general cases:

- when we want to initialize a new object and pass the result of a lambda to it. It is important — our new object is independent and valuable, unlike in the case of the with function

```kotlin

fun main() {
    val service = MultiportService("https://example.kotlinlang.org", 80)

    val result = service.run {
        port = 8080
        query(prepareRequest() + " to port $port")
    }
}
```

when we want to use a function without an extension and execute a block of several operators.

```kotlin
fun main() {
    val hexNumberRegex = run {
        val digits = "0-9"
        val hexDigits = "A-Fa-f"
        val sign = "+-"

        Regex("[$sign]?[$digits$hexDigits]+")
    }

    for (match in hexNumberRegex.findAll("+1234 -FFFF not-a-number")) {
        println(match.value)
    }
}
```

However, we have also encountered a few complicated issues: some of the functions can be used interchangeably, and there is also some confusion with choosing `it` or `this` when accessing the context object. Now it's time to cut this famous "Kotlinian knot"! We will learn how to choose the right function and why we need these two similar keywords: `it` and `this`. Let's get started!

## What is the difference: result of functions

There is an **important difference between the scope functions**, which greatly influences our choice of the most appropriate one.

1.  `apply` and `also` return context objects.
2.  `let`, `run`, and `with` return a lambda result.


### Usecase for `apply` and `also`


- we change the original context object and can make a long chain of functions around it.


### Usecase for 

- we can assign the result of these functions to a variable or make a long chain and transform different data.
- Another way to use these functions is making a temporary scope for a variable, performing some actions, getting the results, and forgetting about it.

## What is the difference: context object

there are five practical differences between `this` and `it`.

1. `this` refers directly to the context object, while `it` can refer to separate members of the object on which we invoke a scope function.

```kotlin
    user.apply {
        // `this` refers to the `user` object, so we can access its properties directly.
        println("Using `this`: Name = $name, Age = $age")
    }
    user.let {
        // `it` refers to the `user` object in this scope.
        println("Using `it`: Name = ${it.name}, Age = ${it.age}")
    }
```

2. In both cases, we refer to some object with which we will work, but with `it` we can pass several parameters, while with `this` we're dealing with one function parameter.

```kotlin
    val listOfUsers = listOf(User("Bob", 20), User("Charlie", 30))
    listOfUsers.forEach {
        // `it` refers to each User object in the list, accessed individually in each iteration.
        println("User name: ${it.name}, age: ${it.age}")
    }
    user.apply {
        // With `this`, we're referring to a single `user` object here, not multiple objects.
        println("Single User with `this`: Name = $name, Age = $age")
    }
```

3. We can omit `this` in a function and access the arguments or object methods directly, but in the case of `it`, we have to call arguments and parameters with the it keyword.

```kotlin
    user.apply {
        // No need to use `this` explicitly, we can directly call properties and methods.
        println("Omitted `this`: Name = $name, Age = $age")
    }
    user.let {
        // Must use `it` to refer to properties of the object
        println("With `it`: Name = ${it.name}, Age = ${it.age}")
    }
```
4. With `it` we can rename our parameters and use a more appropriate name inside the function.

```kotlin
    user.let { person ->
        println("Renamed `it`: Person's Name = ${person.name}, Age = ${person.age}")
    }
```
5. If you have only one function in the body and `it` as a parameter, you can replace that with the `::` reference to the function.

```kotlin
    val printUser = { user: User -> println("User with :: function reference: ${user.name}, ${user.age}") }
    listOfUsers.forEach(::printUser)  // Replacing `it` by directly referencing `printUser`
```

Example:

## Function selection 

You might think: "Hey, I can receive the same result if I, for example, replace run with let and add the word it to a parameter inside the function body. And I can replace run with with." Indeed, in many cases you can do so.

they can help you make code more readable and clear. We can say that scope functions are primarily semantic elements.

However, Kotlin language creators give us the following recommendations (they refer to them in Kotlin coding conventions):

- Executing a lambda on non-null objects: `let`
- Introducing an expression as a variable in local scope: `let`
- Object configuration: `apply`
- Object configuration and computing the result: `run`
- Running statements where an expression is required: non-extension `run`
- Additional effects: `also`
- Grouping function calls on an object: `with`