# Abstract classes

an abstract class is a class that cannot be instantiated directly but serves as a blueprint for other classes.
It acts as a partially implemented class, providing a common structure and behavior that subclasses can inherit and build upon.

An abstract class can have both abstract and non-abstract members (properties and methods).

To declare a member as abstract, you must use the `abstract` keyword explicitly. 
Notice that an abstract member does not have a body (an implementation) in its class.

```kotlin
abstract class Animal(val id: Int) {
    val name: String // We get here a compile-time error: property must be initialized or be abstract
    
    abstract fun makeSound()

    fun isSleeping(): Boolean {
        ...
        return false
    }
}
```

> [!NOTE]
> By default, abstract classes in Kotlin are open to being extended, and their abstract methods and properties are open to being overridden.

## Implementation

When a class extends an abstract class, it must provide implementations for all the abstract members declared in the abstract class.

```kotlin
abstract class Animal {
    abstract fun move()
    abstract fun makeSound()

    fun eat(): Boolean = false
    fun sleep(): Boolean = false
}

class Cat : Animal() {
    override fun move() {
        // Implementation specific to how the cat moves
    }

    override fun makeSound() {
        // Implementation specific to what sound the cat makes
    }
}
```
## Inheritance

An abstract class can also serve as a base class for other abstract classes. In such cases, subclasses are responsible for implementing any abstract methods inherited from both the superclass and its direct abstract superclass.

```kotlin
abstract class Animal {
    abstract fun makeSound()
}

abstract class Mammal : Animal() {
    abstract fun eat()
}

class Cat : Mammal() {
    override fun makeSound() {
        println("Meow!")
    }

    override fun eat() {
        println("The cat is eating.")
    }
}
```

In Kotlin, it is also possible to make an abstract class inherit from an open class while overriding a non-abstract `open` member with an abstract one using two keywords: `abstract override`.

```kotlin
open class Polygon {
    open fun draw() {
        // Some default polygon drawing method
    }
}

abstract class WildShape : Polygon() {
    // Classes that inherit WildShape need to provide their own draw method instead of using the default on Polygon
    abstract override fun draw()
}
```



## Abstract classes vs. interfaces


| Feature | **Abstract Classes** | **Interfaces** |
|---------|----------------------|----------------|
| **Instantiation** | They cannot be instantiated directly. They are meant to serve as a base for subclasses to inherit from. | They cannot be instantiated directly. They define a contract of methods and properties that implementing classes must adhere to. |
| **Constructors** | They can have constructors, including both primary and secondary constructors. Subclasses are responsible for invoking the appropriate superclass constructor. | They cannot have constructors. They only declare methods and properties without any implementation. |
| **State** | They can have member variables and non-abstract methods with default implementations. They can also hold state and maintain internal data. | They cannot hold state or define member variables. They are purely focused on declaring behavior. |
| **Inheritance** | Subclasses can extend only one abstract class. In Kotlin, class inheritance is limited to a single class, and abstract classes provide a way to establish an inheritance hierarchy. | Implementing classes can implement multiple interfaces. Kotlin supports multiple inheritance through interfaces, allowing classes to implement multiple interfaces at once. |
| **Abstract and Non-Abstract Members** | They can have both abstract and non-abstract methods and properties. Subclasses must provide implementations for abstract members while inheriting non-abstract members. | They can declare abstract methods or methods that have default implementations. Both types of methods can be overridden by implementing classes. |


When deciding between abstract classes and interfaces, consider the following guidelines:
- Use `abstract` classes when you want to **provide a default implementation** or when you need to **maintain internal state within the base class**.
- Use `interface` when you want to **define a contract of behavior that multiple unrelated classes can implement** or **when you need to achieve multiple inheritance**.