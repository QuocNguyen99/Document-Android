# Object declaration

Singleton is a really useful pattern, and Kotlin provides a specific structure to declare singletons: **object declaration**. 

This is a special class with an object keyword that creates a singleton. This keyword hides all complicated steps so you don't have to think about the ways to implement this pattern: just use **object declaration**.


```kotlin
object Engine {

    fun getEngine(): Engine {
        /* ... */
    }
    
    fun isRunning(): Boolean {
        /* ... */
    }

}
```

When you use `object` declaration, the constructor is not available because Kotlin does it itself. To get an instance of our playing field, use `Engine` declaration. We can use it anywhere and it will return the same object every time.

```kotlin
val engine = Engine.getEngine()
```

## Nested object

Often you need to create a singleton that is somehow related to another class. For example, you create a `Player` class to store information about different characters in the game. All these characters can share some characteristics, for example, speed. How would we store such information?

Of course, you may use an object declaration and create something like that:

```kotlin
object PlayerProperties {
    /* Default player speed in playing field – 7 cells per turn */
    val defaultSpeed = 7

    fun calcMovePenalty(cell: Int): Int {
        /* calc move speed penalty */
    }
}
```

However, there can be many classes and related singletons, which makes the code confusing and difficult to read. Another way to store this information is by using a nested object.

Object declaration can be nested in a class declaration. A nested class is created inside another class; it cannot be accessed without an outer class declaration.

```kotlin
class Player(val id: Int) {
    object Properties {
        /* Default player speed in playing field – 7 cells per turn */
        val defaultSpeed = 7

        fun calcMovePenalty(cell: Int): Int {
            /* calc move speed penalty */
        }
    }
}

/* prints 7 */
println(Player.Properties.defaultSpeed)
```

The object `Properties` has the scope `Player`, which means we can access it only through `Player.Properties`. 
**You can also use properties and functions from a nested object in the outer class. This can be useful for storing some data common to all instances of a class and for initializing variables**.
Example :

```kotlin
class Player(val id: Int) {
    object Properties {
        val defaultSpeed = 7
    }
    
    val superSpeed = Properties.defaultSpeed * 2 // 14
}
```

**The opposite is not true. You cannot use the properties and the functions of the outer class in the inner.**

```kotlin
class Player(val id: Int) {    
    val speed = 7
    object Properties {
        val defaultSpeed = speed // you cannot get this variable
    }
}
```

As you can see, it's similar to **static** in the other languages. Kotlin doesn't provide static members by default, but you may use nested objects if you need something related to the class.


## Compile-time constants
As you know, sometimes it is necessary to use values in your code that will never change. We call them constant values, you can declare it as `const`:

```kotlin
object Languages {
    const val FAVORITE_LANGUAGE = "Kotlin"

    // ...
}
```

The values of such constants are already known at compile time.

> [!NOTE]
> Note that the constant must meet the following requirements: firstly, it must be initialized with a value of type String or a basic type (Int, Double, etc.). Also, it cannot be a custom getter. And remember that constants should be named using the SCREAMING_SNAKE_CASE.


You might wonder: why not just declare all constants as top-level? Why do we need to declare them in an object?

Generally speaking, both approaches may make sense depending on the situation. 

The fact is that careless use of top-level properties reduces the readability and organization of the code and, as a result, leads to unpleasant errors. **If you declare all the constants at the top of the file, then eventually, you may realize that in one place you have hundreds of declarations that are not related to each other. Therefore, if a constant refers to a specific object, it is better to declare it in that object.**

## Objects and nested objects

Sometimes you want to create more than one singleton associated with a class. You can declare any number of objects inside another class:

```kotlin
class Player(val id: Int) {
    object Properties {
        /* Default player speed in playing field – 7 cells per turn */
        val defaultSpeed = 7

        fun calcMovePenalty(cell: Int): Int {
            /* calc move speed penalty */
        }
    }

    /* creates a new instance of Player */
    object Factory {
        fun create(playerId: Int): Player {
            return Player(playerId)
        }
    }
}

/* prints 7 */
println(Player.Properties.defaultSpeed)


/* prints 13 */
println(Player.Factory.create(13).id)
```

You can declare any number of objects inside another object.

```kotlin
object Game {
    object Properties {
        val maxPlayersCount = 13
        val maxGameDurationInSec = 2400
    }

    object Info {
        val name = "My super game"
    }
}
```

This is helpful for organizing the data in the singletons.

## Data objects


Just like data classes, you can mark an object declaration with the `data` modifier. This instructs the compiler to generate a number of functions for your object:

- `toString()` returns the name of the data object
- `equals()`/`hashCode()` pair

You should not confuse this functionality with what already exists in data classes. A data object declaration is intended to be used as singleton objects, no `copy()` function is generated. Unlike a `data` class, a `data` object does not have any data properties.




