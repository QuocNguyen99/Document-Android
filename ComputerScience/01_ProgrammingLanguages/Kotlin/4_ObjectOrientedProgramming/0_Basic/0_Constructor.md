# Constructors

You already know how to declare simple classes with simple properties. Now let's learn about another kind of a class member: constructors.

## Default constructor

Constructors are class members that initialize a new object of the class.

Every class needs to have a constructor, so if it isn't explicitly defined, the compiler automatically generates a primary constructor without arguments, which only creates an object and doesn't have any logic inside.

## Primary constructor

Often you know the object's properties before you create it. To make your code more concise, you can set the properties in the constructor: just make the constructor receive the arguments you need.
The primary constructor is the right tool for that. It does not contain any code, it just initializes an instance of a class and its properties.

Usually, to define a constructor, you should put the keyword constructor before its parameters. **Kotlin's primary constructor allows you to omit the keyword.**

## Property declarations
You can put simple property declarations inside the primary constructor.
To declare a read-only property, put the keyword `val` in the parentheses before the argument name.
For a mutable property, use the keyword `var`.

## Default and named arguments

Default values in primary constructors are set in the same way as in the class body. You declare the property with a keyword `val` or `var` and place the default value after the assignment operator:
```kotlin
class Size(var width: Int = 1, var height: Int = 1) {
    val area: Int = width * height
}
```

## Init

Primary constructors cannot contain any code: they only set the values of class properties based on the passed arguments.

- Sometimes, we want to set some of our properties based on other properties' values or other sources of information.
In such cases, we would use initializer blocks, which are prefixed with the keyword `init`:

```kotlin
class Size(_width: Int, _height: Int) {
    var width: Int = 0
    var height: Int = 0

    init {
        width = if (_width >= 0) _width else {
            println("Error, the width should be a non-negative value")
            0
        }
        height = if (_height >= 0) _height else {
            println("Error, the height should be a non-negative value")
            0
        }
    }
}
```

- The keyword `init` signifies a block of code that serves as an extension of the primary constructor
For example, **the code below prints a message after the object properties have been set in the primary constructor**:

```kotlin
class Size(val width: Int, val height: Int) {
    init {
        println("Initializer block that prints the width ($width) and the height ($height)")
    }
}
```

- There may be several initializer blocks in the class body. 

In this case, property initializers and `init` blocks are executed in the order of their appearance:

```kotlin
class Size(_width: Int, _height: Int) {
    // 1: the width property is initialized
    val width = _width

    // 2: 1st init block is executed
    init {
        println("First initializer block that prints the width $width")
    }

    // 3: the height property is initialized
    val height = _height

    // 4: 2nd init block is executed
    init {
        println("Second initializer block that prints the height $height")
    }

    // 5: the area property is initialized
    val area = width * height
}
```

## Extension function

the syntax to define an extension function is like defining a simple function.
Just write the **name** of a **class** that you would like to extend and add a **dot** before the function name. The class to be extended is called a **receiver type**.

>[!NOTE]
> In Kotlin, a receiver type is a special parameter of a lambda function that gives it the ability to access the members (properties and methods) of the corresponding receiver object directly, 
> without any qualifier.


You can get access to the field of an object in the extension function almost as easily, as in the member function. That object is called a **receiver object**.

>[!NOTE]
> In Kotlin, a receiver object is an object instance that extends its functionality by the function.


```kotlin
class Client(val name: String, val age: Int)

fun Client.getInfo() = "$name $age" // Client is the receiver type


val client = Client("John", 32)
print(client.getInfo()) // client is the receiver object
```

>[!NOTE]
>Note, if the developer hides some information and your code cannot get it, the extension function can't have access too. So, it works more like a simple function, not a member function

## Secondary constructor

To declare a secondary constructor, write the keyword `constructor` inside the class body and parentheses with the constructor's parameters after the keyword.

## Multiple constructors

Creating several constructors for a class is almost as simple as creating just one, but there is a particular constraint you need to keep in mind. Every secondary constructor has to have a unique **signature**. You cannot use the same **signature** for the primary or any other constructor

**The constructor signature consists of the number, the types, and the order of the parameters**. To create a valid constructor, you need to make sure it has a unique list of parameters.

```kotlin
class Person {
    var name: String
    var age: Int

    // Primary constructor
    constructor(name: String, age: Int) {
        this.name = name
        this.age = age
    }

    // Secondary constructor with a different signature
    constructor(name: String) : this(name, 18) // Default age = 18

    // Another secondary constructor with a different parameter type
    constructor(age: Int) : this("Unknown", age)

    fun printInfo() {
        println("Name: $name, Age: $age")
    }
}
```

> [!CAUTION]
> Note that you cannot use the val and var keywords in the secondary constructor.

## Constructors delegation

If a class has a primary constructor, each secondary constructor needs to call the primary one, either directly or indirectly through another secondary constructor(s). **This is called delegation**.

Delegation to another constructor of the same class is done with the keyword `this` placed after the constructor arguments and before the constructor body:

```kotlin
class Size(val width: Int, val height: Int) {
    var area: Int = width * height

    constructor(width: Int, height: Int, outerSize: Size) : this(width, height) {
        outerSize.area -= this.area
        println("Updated outer object's area is equal to ${outerSize.area}")
    }
}
```

> [!IMPORTANT]
> Delegation to the primary constructor becomes the first statement of a secondary constructor, so the properties are initialized before the secondary constructor code is executed. 
> Initializer blocks, if present, are also executed before the secondary constructor. If a class has no primary constructor, the delegation happens implicitly.

### Constructor execution

Let's look at the example and see in which order the class code is executed:

```kotlin
class Size(val width: Int, val height: Int) {
    var area: Int = width * height

    init {
        println("Object with area equal to $area is created")
    }

    constructor(width: Int, height: Int, outerSize: Size) : this(width, height) {
        outerSize.area -= this.area
        println("Updated outer object's area is equal to ${outerSize.area}")
    }
}

fun main() {
    val outerObject = Size(5, 8)
    val innerObject = Size(2, 3, outerObject)
}
```
Output:
```bash
Object with area equal to 40 is created
Object with area equal to 6 is created
Updated outer object's area is equal to 34
```

## Overriding constructors

Using inheritance and polymorphism, we can extend superclass constructors in subclasses.

### Basic principles of overriding

In the context of object-oriented programming (OOP), **overriding** is a mechanism that allows a subclass to provide its implementation of a method already defined in its superclass.

### Overriding constructors in Kotlin

As mentioned before, constructors cannot be overridden in Kotlin. However, you can define constructors in subclasses that use or **extend** constructors of the superclass.


When declaring a subclass, we can use the keywords `open`, `final`, and `override` to control inheritance and polymorphism.

- `open`: it allows subclasses to inherit or override functions and properties.
- `final`: it prevents subclasses from overriding functions or properties.
- `override`: it is used by the subclass to override functions or properties of the superclass.

```kotlin
open class Person(open val name: String)

class Employee(override val name: String, val id: Int) : Person(name)  // We override the property name.
```

### Constructor overriding in practice

Even though constructors cannot be directly overridden in Kotlin, you can still use the constructors of the superclass when defining subclasses, which is an important element of inheritance in OOP.

### Inheritance and secondary constructor

A derived class might use one or more of those in order to initiate the base class by implementing multiple constructors itself.

```kotlin
open class Base(val beta: Int, val gamma: Int, var message: String = "") {
    constructor(beta: Int, message: String = "") : this(beta, 0, message)
}

class Derived(val alpha: Int, beta: Int, gamma: Int, message: String = "") : Base(beta, gamma, message) {
    constructor(alpha: Int, beta: Int, message: String = "") : this(alpha, beta, 0, message)
}

Base(10)                    // beta is set
Base(10, 20)                // beta and gamma are set
Base(10, 20, "My message")  // beta, gamma, and a message are set
Base(10, "My message")      // beta and a message are set

Derived(0, 10)
Derived(0, 10, 20)
Derived(0, 10, 20, "My message")
Derived(0, 10, "My message")
```

Of course, if we want to restrict the ways in which our `Derived` class can be initiated, then we should make further use of the secondary constructors.

```kotlin
open class Base(val beta: Int, val gamma: Int = 0, var message: String = "")

class Derived : Base {
    val alpha: Int

    constructor(alphaConstr: Int, beta: Int) : super(beta) {
        alpha = alphaConstr
    }

    constructor(alphaConstr: Int, beta: Int, gamma: Int) : super(beta, gamma) {
        alpha = alphaConstr
    }

    constructor(alphaConstr: Int, beta: Int, gamma: Int, message: String) : super(beta, gamma, message) {
        alpha = alphaConstr
    }

    constructor(alphaConstr: Int, beta: Int, message: String) : super(beta, message = message) {
        alpha = alphaConstr
    }
}
```

### Inheritance and init

In case a class has a primary constructor, some `init` blocks, and some secondary constructors, then the order of execution is the following:

- The primary constructor, even if a secondary one is called. The primary one is called first through the keyword `this`;
- All `init` blocks, sequentially in the order they appear;
- The second constructor block, in case this constructor was called.
- Base class primary constructor, even if a base class secondary constructor is called through the derived class;
- Base class `init` blocks, sequentially in the order they appear;
- Base class secondary constructor block, in case this constructor was called;
- Derived class primary constructor, even if a derived class secondary constructor is called;
- Derived class `init` blocks, sequentially in the order they appear;
- Derived class secondary constructor block, in case this constructor was called.

The following code is an example of the above

```kotlin
open class Base(val message: String, val email: String) {
    init { println("Base class init") }
    constructor(email: String) : this("No message", email) { println("Base class secondary") }
}

class Derived(email: String) : Base(email) {
    init { println("Derived class init") }
    constructor() : this("example.com") { println("Derived class secondary") }
}

fun main() {
    val myDerived = Derived()
}
```
Output : 

```bash
Base class init
Base class secondary
Derived class init
Derived class secondary
```

## Overriding properties

> [!NOTE]
> The primary mechanism works for properties as it does for methods. 

When redeclaring properties from a superclass in a derived class, they must be preceded by the override keyword and possess a compatible type.
```kotlin
open class Shape {
    open val vertexCount: Int = 0
}

class Triangle : Shape() {
    override val vertexCount = 3
}
```
A declared property can be overridden either by a property featuring an initializer or one with a `get` method. 

> [!CAUTION]
> Overriding a `val` property with a `var` property is allowed, but the opposite is not permitted. 
> This is due to the fact that a `val` property inherently includes a `get` method, and when overridden as a `var`, a `set` method is also declared in the derived class

```kotlin
interface Shape {
    val vertexCount: Int
}


class Polygon : Shape {
    override var vertexCount: Int = 0  // Can be set to any number later
}
```
