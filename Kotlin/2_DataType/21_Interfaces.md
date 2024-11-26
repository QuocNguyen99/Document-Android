# Interface in Kotlin

We can't create an instance of an interface, but we can create an instance of the class implementing that interface.

The interface is implemented similarly to inheriting from another class:

```kotlin
interface Animal {
    val numberOfLimbs: Int
    fun move()
    fun communicate(): String
}

class MyAnimalClass : Animal {
	/* ... */    
}
```

Then, each **field**  or **method** declared in the interface, needs to be declared in the class with the keyword override. as it shows that we "overwrite" the general case of the interface with the specifics of its implementation.

## Adding default implementation

Since an interface cannot maintain states, we can't use property initializers to define the default value:

```kotlin
interface Animal {
    val age = 10 // Error: Property initializers are not allowed in interfaces
}
```

However, we can use getters to achieve the same result (you can't use setters, though, since there are no instances to assign anything to):

```kotlin
interface Animal {
    val age: Int
        get() = 10
}
```

Since methods represent a kind of series of actions or a certain behavior, default implementation applies to them as well:

```kotlin
interface Animal {
    val numberOfLimbs: Int
    // Default implementation of a method
    fun printNumberOfLimbs() {
        print(numberOfLimbs)
    }
}
```

> [!NOTE]
> Default implementation allows you to skip overriding certain properties or methods in a derived class, except for the cases when the default functionality is not sufficient.