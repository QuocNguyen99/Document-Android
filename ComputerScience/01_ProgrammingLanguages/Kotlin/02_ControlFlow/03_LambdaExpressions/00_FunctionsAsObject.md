# Functions as objects

Kotlin provides a way to work with functions as if they were objects.

## First-class citizen

First-class citizens in programming are the objects that:

1. can be stored as variables,
2. can be returned by a function,
3. can be passed to a function as an argument,
4. don't depend on their name (Ex: An `Int` with the ten name doesn't need to be `10`. And vice versa: the `10` value doesn't need to be stored under the ten name.)
5. can be created at the program runtime (the time when the program is working).

For example, an `Int` is a first-class citizen in Kotlin. 
In fact, **functions are first-class citizens in the Kotlin language too**.

## Function types

Kotlin has built-in support for function types.
The syntax of a function type is this:

`(parameters' types) -> return value type`

In a function type there are:
- **arrow symbols** `(->)` in the middle
- **parenthesized parameters' types split by commas** on the left
- **the return value type** is written on the right.

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

## Function references as objects

Also, Kotlin allows getting references to functions. 
To get a reference to a top-level function, we simply need to write double colon (`::`) before its name and we don't write parentheses and arguments after the name. 

Take a look at the example: `::sum` gives us an object of the `(Int, Int) -> Int` type.

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


## Functions returning other functions
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

## Function references as function parameters

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

## Reference by class

Also, you can reference functions that belong to a class. The base syntax in such cases looks like this:

```kotlin
objectOrClass::functionName
```

Here, `objectOrClass` can be a **class name** or a **particular instance** of a class.

Example: 

```kotlin
class Person(val name: String, val lastname: String) {

    fun printFullName(): String {
        return("full name: $name $lastname")
    }
}
```
Here, we create a function reference:
```kotlin
val person: Person = Person("Sara", "Rogers")
val personFun: () -> String = person::printFullName

```
## Reference to a Class constructor
This reference has the following declaration:
```kotlin
class Person (val name: String){
}

val personGenerator: (String) -> Person = ::Person

val johnFoster: Person = personGenerator("John Foster")
```



## Real-world usage

What about more realistic examples? Well, see for yourself.

The `String` type has the filter method to filter symbols. 
How does it know which symbols to remove from the string and which ones to leave in it? 

The answer is simple: this method takes a **predicate** as an argument and then uses it for internal computations. **A predicate is a function that takes an argument and returns a Boolean result**.

So in the filter method, the predicate says if the symbol should be left and has the `(Char) -> Boolean` type.

Let's try to use this method. If we want to remove dots from a string, we declare this predicate:

```kotlin
fun isNotDot(c: Char): Boolean = c != '.'
```

Then we can do something like this:

```kotlin
val originalText = "I don't know... what to say..."
val textWithoutDots = originalText.filter(::isNotDot)
```