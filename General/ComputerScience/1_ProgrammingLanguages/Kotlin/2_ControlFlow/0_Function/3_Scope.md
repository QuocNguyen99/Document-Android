# Scope

Each variable has a special scope in which it can be used. 
**The scope of a variable is the syntactically-delimited area of code in which this variable or identifier, once declared, can be used in one way or another.**
That is, it is visible. For example, the scope can be an entire program, or a function, or a file.


In the simplest cases, the scope is determined by where the identifier is declared. Out of this scope, the same identifier can be associated with another variable or not be associated with any of the variables at all.

Let's look at this in more detail below:

```kotlin
val outer = 10
if (outer > 0) {
    val inner = 10
    print(inner)
} else {
    // beyond the if block 
    print(outer)
    print(inner)  // Unresolved reference: inner
}
// beyond the if-else expression
print(outer)
print(inner)  // Unresolved reference: inner
```
loop

```kotlin
var outer = 5
while (outer < 10) {
    var inner = 10
    inner *= 2
    print(inner)
    outer++
}  // prints 2020202020

// outside the while loop
print(inner)  // Unresolved reference: inner
```
function
```kotlin
fun localScope() {
    val identifier = "Variable in the function localScope()"
    println(identifier)  // prints "Variable in the function localScope()"
}

fun main() {
    val identifier = "Variable in fun main()"
    localScope()
    println(identifier)  // prints "Variable in fun main()"
}
```

## Interaction of scopes

In general, program scopes are often layered. Some scopes are included in others, and all this forms a hierarchy.

Example: 

```kotlin
var id = 5  // id (outer scope) = 5
if (true) {
    id = 6  // id (outer scope) = 6
    var id = 10  // id (inner scope) = 10
    println(id)  // prints inner id
}
println(id)  // prints outer id
```

- If scope B is nested in scope A, then identifiers from scope A can be used in scope B without additional declarations.
- If any identifiers are defined in such nested scope B, they are not visible in scope A.
- The called identifier is first searched in the current scope and then in scopes up the hierarchy.

## Top-level variables

The variables in the program, depending on the scope, can be divided into top-level and local ones.
**Top-level variables are declared outside the body of any class or function, and their scope is the whole file**, while local variables are created when you define them, for example, in the body of a function.

Example:


```kotlin
val top = "Top-level variable"
fun localScope() {
    println(top) 
}

fun main() {
    println(top)  // prints "Top-level variable"
    localScope()  // prints "Top-level variable"
}
```

As you can easily see, it is accessible from anywhere in the program. This is the way to define constants.

```kotlin
const val CONSTANT = 0 // constant value definition

fun main() {
    // ...
}
```

A common courtesy rule:
- It is better, if possible, to use local variables. 
- It is not very good to use top-level ones: it impairs the readability of the code and leads to errors, which are sometimes difficult to find and correct.