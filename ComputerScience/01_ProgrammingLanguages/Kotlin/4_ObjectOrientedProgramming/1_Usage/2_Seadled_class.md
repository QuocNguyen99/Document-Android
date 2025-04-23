# Seadled class

Do you remember enums, containers for a collection of constants? We will talk about another kind of container – the one for fixed subclasses: a sealed class or sealed interface.

## Basic syntax

To declare a sealed class or interface, we just need to put the `sealed` modifier in front of the class or interface:

```kotlin
sealed class CustomError 
sealed interface CustomErrors
```

As sealed classes and sealed interfaces are similar (the only difference is that between a class and an interface), we will continue with sealed class examples only.

- A sealed class is abstract, so it can't be instantiated. 

```kotlin
fun main() {
    // Sealed types cannot be instantiated
    val customError = CustomError()
}
```
-  you can extend it.
```kotlin
open class Person {
    fun whoAmI(name: String): String {
        return "I am $name"
    }
}


sealed class Staff : Person() {
    class Teacher(val numberOfLessons: Int) : Staff()
    class Manager(val Responsibility: String) : Staff()
    object Worker : Staff()
}

```
- Like with normal classes, you can declare constructors, but constructors in a sealed class must be private or protected:

```kotlin
sealed class CustomError {
    constructor(type: String) {} // protected (default) 
    private constructor(type: String, code: Int) {} // private
    public constructor() {} //  Public gives error
}
```
- You can also use a primary constructor, exactly like in any normal class:

```kotlin
//primary constructor 
sealed class CustomError(type: String) 
```

## Sealed class vs enum

Enum constants have only one single type, while sealed classes offer multiple instances with greater flexibility. **We can conclude that an enum is used to represent a fixed set of values, while a sealed class is a class used to represent a fixed set of subclasses of the type of the given class.**

```kotlin
enum class Staff(numberOfLessons: Int)  {
    TEACHER(2), MANAGER("Manager is managing")
}
```

That is not possible with an enum but can be done with a sealed class:

```kotlin
sealed class Staff {
    class Teacher(val numberOfLessons: Int) : Staff()
    class Manager(val Responsibility: String) : Staff()
    object Worker : Staff()
}
```

## Sealed classes and the when expression

Sealed classes are often used with the when expression, as each class is considered as a case.

```kotlin
sealed class Result {
    object Success : Result()
    data class Error(val message: String) : Result()
    object Loading : Result()
}

fun handleResult(result: Result) {
    when (result) {
        is Result.Success -> println("Operation successful!")
        is Result.Error -> println("Error occurred: ${result.message}")
        Result.Loading -> println("Loading...") // Trường hợp Loading
    }
}

fun main() {
    val success = Result.Success
    val error = Result.Error("Network failure")
    val loading = Result.Loading

    // Xử lý từng trường hợp
    handleResult(success)
    handleResult(error)
    handleResult(loading)
}
```

>[!CAUTION]
> All direct subclasses of a sealed class are known at compile time. No other subclasses may appear outside a module/ package within which the sealed class is defined

Example for direct and redirect subclass
```kotlin
open class B : A() // class B is direct subclass of class A 
open class C : B() // class C is indirect subclass of class A and direct subclass of class B
```

> [!TIP]
> In Kotlin, when working with a sealed class, objects like `Success`, `Error`, and `Loading` are often declared as `object` rather than `class`. 
> This is because they represent unique, unchanging states throughout the application's lifecycle. 
> Using `object` ensures that there is only a single instance of each state, saving memory and improving performance. 
> On the other hand, if `class` was used, multiple instances would need to be created for each state, which is unnecessary in this case.