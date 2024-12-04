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
You can put simple property declarations inside the primary constructor. To declare a read-only property, put the keyword val in the parentheses before the argument name. For a mutable property, use the keyword var.

## Default and named arguments

Default values in primary constructors are set in the same way as in the class body. You declare the property with a keyword val or var and place the default value after the assignment operator:
```kotlin
class Size(var width: Int = 1, var height: Int = 1) {
    val area: Int = width * height
}
```

## Init

Primary constructors cannot contain any code: they only set the values of class properties based on the passed arguments.

Sometimes, we want to set some of our properties based on other properties' values or other sources of information.
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

The keyword `init` signifies a block of code that serves as an extension of the primary constructor
For example, **the code below prints a message after the object properties have been set in the primary constructor**:

```kotlin
class Size(val width: Int, val height: Int) {
    init {
        println("Initializer block that prints the width ($width) and the height ($height)")
    }
}
```

There may be several initializer blocks in the class body. In this case, property initializers and `init` blocks are executed in the order of their appearance:

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

> [!CAUTION]
> Note that you cannot use the val and var keywords in the secondary constructor.

## Constructors delegation

If a class has a primary constructor, each secondary constructor needs to call the primary one, either directly or indirectly through another secondary constructor(s). This is called delegation.

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

Delegation to the primary constructor becomes the first statement of a secondary constructor, so the properties are initialized before the secondary constructor code is executed. Initializer blocks, if present, are also executed before the secondary constructor. If a class has no primary constructor, the delegation happens implicitly.

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

As mentioned before, constructors cannot be overridden in Kotlin. However, you can define constructors in subclasses that use or "extend" constructors of the superclass.


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

The primary mechanism works for properties as it does for methods. When redeclaring properties from a superclass in a derived class, they must be preceded by the override keyword and possess a compatible type.
```kotlin
open class Shape {
    open val vertexCount: Int = 0
}

class Triangle : Shape() {
    override val vertexCount = 3
}
```
A declared property can be overridden either by a property featuring an initializer or one with a `get` method. Overriding a `val` property with a `var` property is allowed, **but the opposite is not permitted**. This is due to the fact that a `val` property inherently includes a `get` method, and when overridden as a `var`, a `set` method is also declared in the derived class

```kotlin
interface Shape {
    val vertexCount: Int
}


class Polygon : Shape {
    override var vertexCount: Int = 0  // Can be set to any number later
}
```



## Nested and inner classes

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

Write this@Cat.color in the inner class code and you will get the color of the outer class, while using color or this.color will always give you the color property of the current class


### Rules for Inner classes

- An inner class can access all members of its outer class.

- To access the inner class, you need to instantiate the outer class first, as inner classes are associated with an instance of their enclosing class

## Data Class 
the data class is a convenient way to organize data or to create DTOs (Data Transfer Objects).

Example of the path to the solution
we need a class, so here is a nice `Client` class:

```kotlin
class Client(val name: String, val age: Int, val gender: String)
```

Right now it has 3 properties, so far so good! But in order to properly compare the objects (i.e., by their properties) we need to implement `equals()` and `hashCode()` functions:

```kotlin
class Client(val name: String, val age: Int, val gender: String) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as Client

        if (name != other.name) return false
        if (age != other.age) return false
        if (gender != other.gender) return false

        return true
    }

    override fun hashCode(): Int {
        var result = name.hashCode()
        result = 31 * result + age
        result = 31 * result + gender.hashCode()
        return result
    }
}
```

Why do we need such a long piece of code just for standard stuff? That's the right question because with the data class we can simplify it like this:

```kotlin
data class Client(val name: String, val age: Int, val gender: String)
```

Wait! Where are all my functions now? Actually, with the `data` keyword, you don't need them anymore. It will magically work as if you have already implemented them all. This keyword will also provide `toString()` ,`copy()` and `componentN()` functions with default behavior (equals and hashCode). We'll look at `copy()` and `componentN()`a bit later, but right now you need to remember several rules here:
1.  You can only count on properties that are inside the constructor.
```kotlin
data class Client(val name: String, val age: Int, val gender: String) {
    var balance: Int = 0
}
```
All those functions won't consider balance field, **because it isn't inside the constructor.**

2.  You can override all those functions, except for `copy()`:
3. The primary constructor of a data class must have at least one parameter and all of those parameters must be `val` or `var`.

### Copy and ComponentN

To be honest, there isn't really a convenient way to copy an object in Java, but Kotlin is different.

we just used our `copy()` function, which will be provided automatically with the `data` keyword. 
```kotlin
fun main() {
    val bob = Client("Bob", 29, "Male")
    val john = bob.copy(name = "John")
    println(bob) // Client(name='Bob', age=29, gender='Male', balance=0)
    println(john) // Client(name='John', age=29, gender='Male', balance=0)
}
```


The `componentN()` functions correspond to the properties in their order of declaration: `component1()`, `component2()`, ..., for all data class properties. The Component functions generated for data classes make it possible to use them in destructuring declarations

> [!NOTE]
> In Kotlin, a destructuring declaration is a feature that allows you to separate the properties of an object or a collection into individual variables, which can then be used separately in your code.

## Argument naming in overridden functions

Functions can often have several arguments, and to improve the readability of code in Kotlin, you can use named arguments when calling a function.

```kotlin
    val shape: Shape = Circle()
    shape.draw(color = "red", strokeWidth = 3)
``` 

## Destructuring declarations

### Basic destructuring

we can separate all variables from the class and work with them as separate objects:

```kotlin
data class User(val name: String, val age: Int, val isAdmin: Boolean)

val anonym = User("Anonym", 999, false)
val (userName, userAge, isAdmin) = anonym

println(userName)  // prints Anonym
println(userAge)   // prints 999
println(isAdmin)   // prints false
```

A destructuring declaration uses a `componentN()` operator, that returns an n-th element from the class. The code above is compiled into the following code:

```kotlin
val userName = anonym.component1()
val userAge = anonym.component2()
val isAdmin = anonym.component3()
```
### Destructuring without data classes

Destructuring can be used without data classes as well. We simply need to define a componentN **operator** manually.

```kotlin
class User(val name: String, val age: Int, val isAdmin: Boolean){
    operator fun component1(): String = name
    operator fun component2(): Int = age
    operator fun component3(): Boolean = isAdmin
}

// now we can use default destructuring syntax
fun checkIsAdmin(suspiciousUser: User) {
    // destructuring
    val (name, age, isAdmin) = suspiciousUser
}
```

> [!NOTE]
> Note that we can't override componentN operator in data classes because Kotlin does it for us

### Destructuring with lists and loops

Destructuring declarations also work with lists and loops because `List` is a class with the implemented `componentN` operator.


```kotlin
fun processList(customerInfo: MutableList<String>) {
    val (firstName, lastName, city) = customerInfo
}
```

### Underscoring for variables

When we start using destructuring declarations, the Kotlin compiler may warn us about unused variables in the destructuring declaration. The default IDE solution is to rename unused variables as "_" (underscore). but let's try to copy-paste some code from somewhere else:

```kotlin
val usersData = mutableListOf<User>()
for ((_, _, isAdmin) in usersData) {
    // /~
}
```

the `componentN` operator skipped `name` and `age` properties, so they cannot be used in the cycle.


## hashCode and equals

One of the most frequent problems is check two objects for equality. For this task, we can use two fundamental methods: `hashCode()` and `equals()`.


### The hashCode() method

A hash function is a special function that can be used to map data of any size to fixed-size values.

One of the fundamental properties of hash functions is that they always return the same value for the same content or input information, that is, if we pass them the same content value, they will always return the same hash code.

This property can be used to check if two objects are equal based on their content and their hash. **If the content of two objects, that is, their state, is the same, their hash code must be the same.**

To obtain the hash code for the state of an object, we can make use of the `hashCode()` functions for the types or simple classes Kotlin has already pre-calculated: `Int`, `Long`, `String`, etc.

```kotlin
    val intValue = 32
    val intValue2 = 64
    val intValue3 = 32

    println(intValue.hashCode()) // 32
    println(intValue2.hashCode()) // 64
    println(intValue3.hashCode()) // 32

    println(intValue.hashCode() == intValue2.hashCode()) // false
    println(intValue.hashCode() == intValue3.hashCode()) // true
```

To get the hash code for the state of our class, **we must override** the default `hashCode()` (inherited from `Any`) according to the properties of our class. This way, we can get the proper `hashCode()` method to represent the state of our object.

```kotlin
class Person(val name: String, val age: Int) {
    override fun hashCode(): Int {
        var result = name.hashCode()
        result = 31 * result + age.hashCode()
        return result
    }
}

fun main() {
    val person1 = Person("John", 32)
    val person2 = Person("John", 32)
    val person3 = Person("John", 64)

    println(person1.hashCode()) // 71750741
    println(person2.hashCode()) // 71750741
    println(person3.hashCode()) // 71750773

    println(person1.hashCode() == person2.hashCode()) // true
    println(person1.hashCode() == person3.hashCode()) // false
}
```

### The equals method

What is the `equals` method? This special method compares two objects and returns true if they are **equal**. This method exists by default for all objects and is defined in `Any`, **so we must override it to adapt it to the nature and definition of our classes**.

we can make use of the equals method that already exists implemented in the basic Kotlin types or classes: `Int`, `Long`, `String`, etc. we can either call it or use the == operator.


```kotlin
fun main() {
    val intValue = 32
    val intValue2 = 64
    val intValue3 = 32

    println(intValue.equals(intValue2)) // false
    println(intValue.equals(intValue3)) // true
    println(intValue == intValue2) // false
    println(intValue == intValue3) // true

    val stringValue = "Hello"
    val stringValue2 = "Hello"
    val stringValue3 = "Hello World"

    println(stringValue.equals(stringValue2)) // true
    println(stringValue.equals(stringValue3)) // false
    println(stringValue == stringValue2) // true
    println(stringValue == stringValue3) // false
}
```

To perform the right operation of `equals` for the state of our class, we must override the default `equals()`

```kotlin
class Person(val name: String, val age: Int) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is Person) return false

        if (name != other.name) return false
        return age == other.age
    }
}

fun main() {
    println(person1.equals(person2)) // true
    println(person1.equals(person3)) // false
    println(person1 == person2) // true
    println(person1 == person3) // false
}
```

### equals and hashCode relationship

Normally, the `hashCode()` method is overridden so that it behaves in the way `equals()` does: that is, if two objects are equal, they must have the same hash value. So, if two objects are equal, `hashCode()` produces the same integer result. Hence, `equals()` returns true if `hashCode()` is equal, else it returns false. This is very important, as `equals()` and `hashCode()` must be consistent and based on the same object properties to be calculated.

```kotlin
class Person(val name: String, val age: Int) {
    override fun hashCode(): Int {
        var result = name.hashCode()
        result = 31 * result + age.hashCode()
        return result
    }

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is Person) return false

        if (name != other.name) return false
        return age == other.age
    }
}

fun main() {
    println(person1.hashCode() == person2.hashCode()) // true
    println(person1.hashCode() == person3.hashCode()) // false
    println(person1 == person2) // true
    println(person1 == person3) // false
}
```
### equals and hashCode in data classes

When we are working with data classes, the `equals()` and `hashCode()` methods are implemented and defined automatically based on the state of the properties that define our data class in the constructor.

