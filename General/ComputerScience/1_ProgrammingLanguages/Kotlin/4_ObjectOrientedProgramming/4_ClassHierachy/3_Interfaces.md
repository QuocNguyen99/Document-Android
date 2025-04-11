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

Then, each **field**  or **method** declared in the interface, needs to be declared in the class with the keyword `override`.

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

## Interface inheritance

Classes in Kotlin cannot extend more than one base class, but they can implement several interfaces (classes may extend the base class, which extends another class, but that's not quite the same as the general idea of multiple inheritance).

Syntax for class and interface inheritance is the same: the name of the new interface goes before a colon `:` and after the `interface` keyword; after the colon goes the name of the base interface – the one whose properties the new interface inherits:

```kotlin
interface Animal {
    val amountOfLimbs: Int
    fun move()
    fun communicate()
}

interface Bird : Animal {
    val canFly: Boolean
    val flyingSpeed: Int
    fun buildNest()
}
```
### Implementation of derived interface
The main rule of implementing derived interfaces is that the class must implement methods and properties from both the base and the derived interface:

```kotlin
class Parrot : Bird // : Animal
{
    // These properties are inherited from the Animal interface...
    override val numberOfLimbs: Int = 2

    override fun move() {
        fly()
    }

    override fun communicate() {
        speak()
    }

    // ...while these ones are specifically from the Bird interface

    override val canFly: Boolean = true

    override val flyingSpeed: Int = 20

    override fun buildNest() {
        collectMaterials()
        findGoodPlace()
        buildSmallNest()
    }
}
```

### Multiple Inheritance

We can also utilize multiple inheritance: a class which implements several different interfaces.

```kotlin
interface Bird : Animal {
    fun buildNest()
}

interface Flying {
    val flyingSpeed: Int
    val flyingManeuverability: Int
}

class Owl : Bird, Flying {

    // Flying interface
    override val flyingSpeed: Int = 100
    override val flyingManeuverability: Int = 95

    // Bird interface
    override fun buildNest() {
        buildSmallNest()
    }

    // Animal Interface
    override val numberOfLimbs: Int = 2

    override fun move() {
        fly()
    }

    override fun communicate() {
        coo()
    }

}
```

### Inheritance from multiple interfaces

Just like classes can implement several interfaces, one interface might be derived from several others.

```kotlin
interface FlyingBird : Bird, Flying  
{  
    /* ... */  
}
```

