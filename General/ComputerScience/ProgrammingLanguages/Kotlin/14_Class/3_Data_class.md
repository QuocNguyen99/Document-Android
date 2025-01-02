

## Data Class 
the data class is a convenient way to organize data or to create DTOs (Data Transfer Objects).

Example of the path to the solution
we need a class, so here is a nice `Client` class:

```kotlin
class Client(val name: String, val age: Int, val gender: String)
```

Right now it has 3 properties, so far so good! But in order to properly compare the objects (i.e., by their properties) we need to implement `equals()` and `hashCode()` functions:

```kotlin
class Client(val name: String, val age: Int, val gender: String) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as Client

        if (name != other.name) return false
        if (age != other.age) return false
        if (gender != other.gender) return false

        return true
    }

    override fun hashCode(): Int {
        var result = name.hashCode()
        result = 31 * result + age
        result = 31 * result + gender.hashCode()
        return result
    }
}
```

Why do we need such a long piece of code just for standard stuff? That's the right question because with the data class we can simplify it like this:

```kotlin
data class Client(val name: String, val age: Int, val gender: String)
```

Wait! Where are all my functions now? Actually, with the `data` keyword, you don't need them anymore. It will magically work as if you have already implemented them all. This keyword will also provide `toString()` ,`copy()` and `componentN()` functions with default behavior (equals and hashCode). We'll look at `copy()` and `componentN()`a bit later, but right now you need to remember several rules here:
1.  You can only count on properties that are inside the constructor.
```kotlin
data class Client(val name: String, val age: Int, val gender: String) {
    var balance: Int = 0
}
```
All those functions won't consider balance field, **because it isn't inside the constructor.**

2.  You can override all those functions, except for `copy()`:
3. The primary constructor of a data class must have at least one parameter and all of those parameters must be `val` or `var`.

### Copy and ComponentN

To be honest, there isn't really a convenient way to copy an object in Java, but Kotlin is different.

we just used our `copy()` function, which will be provided automatically with the `data` keyword. 
```kotlin
fun main() {
    val bob = Client("Bob", 29, "Male")
    val john = bob.copy(name = "John")
    println(bob) // Client(name='Bob', age=29, gender='Male', balance=0)
    println(john) // Client(name='John', age=29, gender='Male', balance=0)
}
```


The `componentN()` functions correspond to the properties in their order of declaration: `component1()`, `component2()`, ..., for all data class properties. The Component functions generated for data classes make it possible to use them in destructuring declarations

> [!NOTE]
> In Kotlin, a destructuring declaration is a feature that allows you to separate the properties of an object or a collection into individual variables, which can then be used separately in your code.

## Argument naming in overridden functions

Functions can often have several arguments, and to improve the readability of code in Kotlin, you can use named arguments when calling a function.

```kotlin
    val shape: Shape = Circle()
    shape.draw(color = "red", strokeWidth = 3)
``` 

## Destructuring declarations

### Basic destructuring

we can separate all variables from the class and work with them as separate objects:

```kotlin
data class User(val name: String, val age: Int, val isAdmin: Boolean)

val anonym = User("Anonym", 999, false)
val (userName, userAge, isAdmin) = anonym

println(userName)  // prints Anonym
println(userAge)   // prints 999
println(isAdmin)   // prints false
```

A destructuring declaration uses a `componentN()` operator, that returns an n-th element from the class. The code above is compiled into the following code:

```kotlin
val userName = anonym.component1()
val userAge = anonym.component2()
val isAdmin = anonym.component3()
```
### Destructuring without data classes

Destructuring can be used without data classes as well. We simply need to define a componentN **operator** manually.

```kotlin
class User(val name: String, val age: Int, val isAdmin: Boolean){
    operator fun component1(): String = name
    operator fun component2(): Int = age
    operator fun component3(): Boolean = isAdmin
}

// now we can use default destructuring syntax
fun checkIsAdmin(suspiciousUser: User) {
    // destructuring
    val (name, age, isAdmin) = suspiciousUser
}
```

> [!NOTE]
> Note that we can't override componentN operator in data classes because Kotlin does it for us

### Destructuring with lists and loops

Destructuring declarations also work with lists and loops because `List` is a class with the implemented `componentN` operator.


```kotlin
fun processList(customerInfo: MutableList<String>) {
    val (firstName, lastName, city) = customerInfo
}
```

### Underscoring for variables

When we start using destructuring declarations, the Kotlin compiler may warn us about unused variables in the destructuring declaration. The default IDE solution is to rename unused variables as "_" (underscore). but let's try to copy-paste some code from somewhere else:

```kotlin
val usersData = mutableListOf<User>()
for ((_, _, isAdmin) in usersData) {
    // /~
}
```

the `componentN` operator skipped `name` and `age` properties, so they cannot be used in the cycle.