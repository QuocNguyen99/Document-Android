# Enum

"How can I store a bunch of constants in one place and handle them all at the same time?" Well, for this question Kotlin has an answer and we call that answer **Enums**. 


Basically, **Enums** represent a logical set of constants, and they make our code clearer and more readable. Let's take a closer look at them.


`enum` is a keyword, which allows us to create our own enumeration (the word that `enum` represents) just from a usual class:

According to Kotlin Coding Conventions, you can use either uppercase underscore-separated names (as usual Kotlin constants are `RED_COLOR`)


Ex:

```kotlin
enum class Status {
    OPEN, PENDING, IN_PROGRESS, RESOLVED, REJECTED, CLOSED
}


enum class Rainbow(val color: String, val rgb: String) {
    RED("Red", "#FF0000"),
    ORANGE("Orange", "#FF7F00"),
    YELLOW("Yellow", "#FFFF00"),
    GREEN("Green", "#00FF00"),
    BLUE("Blue", "#0000FF"),
    INDIGO("Indigo", "#4B0082"),
    VIOLET("Violet", "#8B00FF")
}

```

`Enum` is still a custom class, so we can add to it our own methods.
Let's add a method which will print full information about an instance of our Class:

```kotlin
enum class Rainbow(val color: String, val rgb: String) {
    RED("Red", "#FF0000"),
    ORANGE("Orange", "#FF7F00"),
    YELLOW("Yellow", "#FFFF00"),
    GREEN("Green", "#00FF00"),
    BLUE("Blue", "#0000FF"),
    INDIGO("Indigo", "#4B0082"),
    VIOLET("Violet", "#8B00FF");

    fun printFullInfo() {
        println("Color - $color, rgb - $rgb")
    }
}
```

## Methods and properties Enum

1. `name` allows you to get the name of Enum's instance

2. `ordinal` contains a position of Enum's instance

3. `entries` property returns an array of all instances of `Enum`. It might be helpful if you want to iterate through `Enum` instances. Now we can check if any specific color is part of the Object or not.

4.  `valueOf()` returns an instance of Enum by its name with String type and case sensitivity

If there isn't any appropriate instance of Enum then `IllegalArgumentException` will be thrown. Please, note that this method is case sensitive.

```kotlin
enum class Color(val hex: String) {
    RED("#FF0000"),
    GREEN("#00FF00"),
    BLUE("#0000FF")
}

fun main() {
    // name - Get the name of Enum instance
    val colorName = Color.RED.name
    println("Color name: $colorName")  // Output: Color name: RED

    // ordinal - Get the position of Enum instance
    val colorOrdinal = Color.RED.ordinal
    println("Color ordinal: $colorOrdinal")  // Output: Color ordinal: 0

    // entries - Get all instances of Enum
    val allColors = Color.entries
    println("All colors: ${allColors.joinToString(", ") { it.name }}")  
    // Output: All colors: RED, GREEN, BLUE

    // valueOf() - Get an instance by name (case-sensitive)
    try {
        val greenColor = Color.valueOf("GREEN")
        println("Color found: $greenColor")  // Output: Color found: GREEN
    } catch (e: IllegalArgumentException) {
        println("Error: ${e.message}")
    }
}
```