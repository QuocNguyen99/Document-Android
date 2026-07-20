# Companion object

**You can declare any number of objects inside another object**. 
**But in many cases, you need only one singleton for a class**, and using its full name may seem wordy. In this case, you can use another Kotlin feature, the companion object.

## Companion object

A companion object is a singleton attached to an outer class, and hence it cannot be accessed without accessing the outer class. It allows us to understand that the current object is somehow connected with the outer class. 

For example, we can store the default speed for all players in the `Player` companion object. That also means that every `Player` instance contains a reference to the companion object and will return its instance every time.

```kotlin
class Player(val id: Int) {
    companion object Properties {
        /* Default player speed in playing field - 7 cells per turn */
        val defaultSpeed = 7

        fun calcMovePenalty(cell: Int): Int {
            /* calc move speed penalty */
        }
    }
}

/* prints 7 */
println(Player.Properties.defaultSpeed)
```


However, unlike the case of a nested object, the name can be omitted. Let's try it:

```kotlin
class Player(val id: Int) {
    companion object {
        /* Default player speed in playing field - 7 cells per turn */
        val defaultSpeed = 7

        fun calcMovePenalty(cell: Int): Int {
            /* calc move speed penalty */
        }
    }
}

/* prints 7 */
println(Player.defaultSpeed)
```

we can still access it through the outer class declaration. If a companion object doesn't have a name, we can also use the default name Companion:

```kotlin
/* prints 7 too */
println(Player.Companion.defaultSpeed)
```
## Companion object and outer class

You may freely use properties and functions from the companion object in the outer class. For example:

```kotlin
class Deck {
    companion object {
        val size = 10
        val height = 2
        fun volume(bottom: Int, height: Int) = bottom * height
    }

    val square = size * size             //100
    val volume = volume(square, height)  //200
}
```

But what happens if the outer class has a property with the same name as the companion object? Well, in this case, the properties from the class will shadow the properties of the companion.

```kotlin
class Deck {
    companion object {
        val size = 10
    }
    val size = 2
    val square = size * size // 4
}
```

In this case, if you want to use a property from the companion, you must use the companion's name, or, if it wasn't named, the default name Companion:
```kotlin
class Deck {
    companion object {
        val size = 10
    }
    val size = 2
    val square = Companion.size * Companion.size // 100
}
```

Similar to the case of nested objects, you cannot use the properties and the functions of the outer class in the inner one

```kotlin
class Deck() {    
    val size = 2
    object Properties {
        val defaultSize = size // you cannot get this variable
    }
}
```

## Limitations of companion objects

- Only one companion object is available for each class. That means you can't create multiple companion objects for a class because Kotlin does not support this behavior, even if they have different names

- We cannot create a companion object inside another singleton (or a companion object) because that violates the global access principle.

```kotlin
object OuterSingleton {
    companion object InnerSingleton { // Modifier 'companion' is not applicable inside 'object'  
  
    }
}
```
## Analogue in other languages

If you come from another programming language, you may be a little confused by companion objects. The closest concept to it is `static` members. The keyword `static` means that fields and methods with this modifier are common for all objects of the class and can be used without creating an instance of the class. You may encounter this keyword in several languages.

```java
class Dog {
    public static int numOfPaws = 4;

    public static String createSound() {
        return "WUF-WUF";
    }
}
/*prints WUF-WUF*/
System.out.println(Dog.createSound());
```
As you may know, Kotlin doesn’t have the `static` keyword. 

> [!TIP]
> If you need something common to all instances of a class, you can use a `companion` object