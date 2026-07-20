# Object-Oriented Programming (OOP)

## Core Principles of OOP

### 1. **Encapsulation**

Encapsulation restricts direct access to some of an object's components, enhancing data security and integrity. 

For example, in Kotlin:

```kotlin
class BankAccount(private var balance: Double) {

    fun getBalance(): Double = balance

    fun deposit(amount: Double) {
        if (amount > 0) balance += amount
    }

    fun withdraw(amount: Double) {
        if (amount in 0.0..balance) balance -= amount
    }
}
```

### 2. **Abstraction**

Abstraction involves hiding complex implementation details and showing only the essential features of an object. This simplifies code management and enhances readability. 

In Kotlin, abstraction can be achieved using abstract classes and interfaces:

```kotlin
abstract class Animal {
    abstract fun makeSound()
}

class Dog : Animal() {
    override fun makeSound() {
        println("Bark")
    }
}
```

### 3. **Inheritance**

This principle allows a new class (child or subclass) to inherit attributes and methods from an existing class (parent or superclass), 
promoting code reusability and establishing a hierarchical relationship between classes.


For instance:

```kotlin
open class Vehicle(val brand: String) {
    open fun honk() {
        println("Beep beep!")
    }
}

class Car(brand: String, val model: String) : Vehicle(brand) {
    override fun honk() {
        println("Honk! I'm a $brand $model")
    }
}

```

### 4. **Polymorphism**

Polymorphism allows objects of different classes to respond to the same method call in different ways, enabling a single interface to control access to a variety of data types. This enhances flexibility and integration. 

An example in Kotlin:

```kotlin
open class Animal {
    open fun speak() = println("Some generic sound")
}

class Cat : Animal() {
    override fun speak() = println("Meow")
}

class Dog : Animal() {
    override fun speak() = println("Woof")
}

```

## Benefits of OOP

- **Modularity**: The source code for an object can be written and maintained independently of the source code for other objects. Once created, an object can be easily passed around inside the system.

- **Reusability**: Through inheritance, programmers can create new classes built upon existing ones, promoting code reusability and reducing redundancy.

- **Scalability**: Systems can be easily expanded by adding new objects, attributes, and methods without modifying existing code.

- **Maintainability**: OOP's modular structure makes it easier to debug, test, and maintain code.
