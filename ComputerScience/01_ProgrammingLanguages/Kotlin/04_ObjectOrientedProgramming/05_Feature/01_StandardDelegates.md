# Standard delegates

In addition to **class delegates**, Kotlin has a robust functionality known as **delegated properties**.

This feature allows the delegation of getter and setter methods of a property to another object.

This capability proves valuable when it comes to reusing **common behavior**, **separating logic**, or **calculating a value only once**

## delegated properties

Unlike traditional properties, delegated properties are not backed by a class field. Instead, they **delegate getting and setting to another piece of code.**

Delegated properties are used by declaring the property and the delegate that it uses. The `by` keyword indicates that the property is controlled by the provided delegate instead of its own field.

For example:

```kotlin
class Example {
    var p: String by Delegate()
}
```

Under the hood, the delegate has the `getValue()` and `setValue()` methods, which take over the `get()` and `set()` methods, respectively, corresponding to the property.

## Standard delegates

The Kotlin standard library comes with a set of standard delegates that are ready to be used in order to create:

### 1. **Lazy properties**: 

The lazy function takes a lambda and returns an instance of `Lazy<T>`, which serves as a delegate for implementing a lazy property. 
The first call to `get()` executes the lambda passed to `lazy()` and remembers the result. Subsequent calls to `get()` simply return the remembered (cached) result.

```kotlin
val lazyValue: String by lazy {
    print("Computed! ")
    "Hello"
}

fun main() {
    println(lazyValue) // Computed! Hello
    println(lazyValue) // Hello
}
```

### 2. **Observable properties**: 
The observable delegate **allows for a lambda to be triggered any time the value of the property changes**, resulting in change notifications or updating of other related properties.

```kotlin
import kotlin.properties.Delegates

class User {
    var rank: String by Delegates.observable("<no rank>") {
        prop, old, new -> println("${prop.name}: $old -> $new")
    }
}

fun main() {
    val user = User()
    user.rank = "first"  // rank: <no rank> -> first
    user.rank = "second" // rank: first -> second
}
```


### 3. **Vetoable properties**: 
The lambda function is called before a new value is set, and it allows the function to decide if the new value should be accepted or rejected.

```kotlin
import kotlin.properties.Delegates

var max: Int by Delegates.vetoable(0) { prop, old, new ->
    new > old
}

fun main() {
    println(max) // 0
    max = 10
    println(max) // 10
    max = 5
    println(max) // 10
}
```

### 4. **NotNull properties**:

a property delegate for a non-null property that must be initialized before it is accessed.

```kotlin
import kotlin.properties.Delegates

class Person{
    var name: String by Delegates.notNull()
}

fun main() {
    val person = Person()
    person.name // Throws IllegalStateException:
                // Property name should be initialized before get.
    person.name = "Ahmed Omar"
    println(person.name) // Prints "Ahmed Omar"
}
```


### 5. **Storing properties in a map**: 

Properties can be stored in a `MutableMap` or `Map` to back mutable or immutable properties, respectively.

```kotlin
class User(val map: MutableMap<String, Any?>) {
    var name: String by map
    var age: Int     by map
}

fun main() {
    val user = User(mutableMapOf(
        "name" to "Ahmed Omar",
        "age"  to 25
    ))

    println(user.name) // Prints "Ahmed Omar"
    println(user.age)  // Prints 25

    user.name = "Ahmed Omar"
    user.age = 30

    println(user.name) // Prints "Ahmed Omar"
    println(user.age)  // Prints 30
}
```

## Practical use cases

Standard delegated properties in Kotlin can be utilized in various practical scenarios. 

Some of those include:

1. **Lazy initialization**: The `lazy` delegate is useful for properties that are expensive to compute or that might not be needed at all.

2. **Observing property changes**: The `observable` delegate can be used to observe changes to a property and perform actions when the property is changed, such as updating the UI or validating the new value.

3. **Vetoing property changes**: The `vetoable` delegate can be used to veto changes to a property based on custom logic, such as ensuring that a value remains within a certain range or meets certain criteria.

4. **NotNull properties**: This can be useful for ensuring that certain preconditions are met before an object is used.

5. **Storing properties in a map**: The map and `mutableMap` delegates can be used to store properties in a map instead of separate fields for each property; they are useful for dynamic data structures or for serializing and deserializing objects.









