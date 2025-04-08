# Nested and inner classes

Nested class is a class declared inside another class.
They help us group classes logically and increase the encapsulation of our code.

Example:

```kotlin
class Superhero {
    class MagicCloak {
    }

    class Hammer {
    }
}
```

Both classes `MagicCloak` and `Hammer` are nested classes. 
The `Superhero` class is often called an outer class, while a nested class, along with its properties, functions, and constructors, is a member of an outer class.

The problem here is that `MagicCloak` and `Hammer` aren't really bound to `Superhero`.
If you need to use `MagicCloak` and `Hammer` outside the class `Superhero`, you must create the corresponding objects:

```kotlin
val cloak = Superhero.MagicCloak()
val hammer = Superhero.Hammer()
```

## Inner class

We are going to focus on a special case of **nested classes** — inner classes.

A regular nested class cannot access members of its outer class. But a nested class marked as an `inner` class can.

Example:

```kotlin
class Cat(val name: String) {
    inner class Bow(val color: String) {
        fun printColor() {
            println("The cat named $name has a $color bow.") // access members of its outer class   
        }
    }
}

fun main() {
    val cat: Cat = Cat("Bob")
    val bow: Cat.Bow = cat.Bow("red")

    bow.printColor()
}
```

## Scope of the inner class

You may encounter inner classes that have members with the same names as their outer classes. 
For example, both `Cat` and `Bow` may have the property `color`. How can you access the outer class members from the inner class in such cases? 

**The qualified this expression will help!**

Write `this@Cat.color` in the inner class code and you will get the color of the outer class, while using color or `this.color` will always give you the color property of the current class


### Rules for Inner classes

- An inner class can access all members of its outer class.

- To access the inner class, you need to instantiate the outer class first, as inner classes are associated with an instance of their enclosing class