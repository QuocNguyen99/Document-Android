# Variable Declaretion

## Declaring variables

To declare a variable, Kotlin provides two keywords:
- val (for value) declares a **read-only variable (just a named value)**, which cannot be changed after it has been initialized, so a value can be assigned once (this is actually not entirely true, we will discuss this issue in more detail later);
- var (for variable) declares a mutable variable, which can be changed (as many times as needed).
- const is used for variables (with val) **that are known at compile-time**.

### Val variables and mutability

It is important to note that `val` is not a synonym of **immutable**

Example:

```kotlin
// list creation
val myMutableList = mutableListOf(1, 2, 3, 4, 5)
// trying to update the list
myMutableList = mutableListOf(1, 2, 3, 4, 5, 6) // error line
```

**It is always possible to change the internal state of a val variable**: while it is prohibited to reassign the variable, its content can be modified in some other ways.

Example:

```kotlin
// list creation
val myMutableList = mutableListOf(1, 2, 3, 4, 5)
// adding a new element
myMutableList.add(6)   // it works
// printing the list
println(myMutableList) // [1, 2, 3, 4, 5, 6]
```

As you can see, this code changed the internal state of the `myMutableList` by adding another integer number. When we invoked the `add()` function, we changed not the variable itself but the list it represents.

> [!TIP]
> If you are familiar with the Java programming language, it may be easier for you to think about Kotlin val variables as Java final variables.
> They are quite similar: both prohibit reassigning a value to the variable but allow changing the internal state of the object.

### Const variables

In Kotlin, there is also a const modifier, which is used before the val keyword to declare a compile-time constant. The value of a const variable is known at compile time and won't be changed at runtime, There are some restrictions on when the const modifier can be applied.
- First, it can only be used with a String or a primitive type variable.

```kotlin
const val CONST_INT = 127
const val CONST_DOUBLE = 3.14
const val CONST_CHAR = 'c'
const val CONST_STRING = "I am constant"
const val CONST_ARRAY = arrayOf(1, 2, 3) // error: only primitives and strings are allowed
```

- Besides, const variables need to be declared on top level, outside of any functions:

```kotlin
const val MY_INT_1 = 1024 // correct line

fun main() {
    const val MY_INT_2 = 2048 // error: Modifier 'const' is not applicable to 'local variable'
}
```

### When to use val variables

A good practice is to use val variables by default. Then, when it appears to be necessary for the code, change them to var variables
This approach allows you to write programs with the minimum number of mutable variables, which leads to fewer errors.

### Naming conventions

When declaring val and const variables in Kotlin, it's the best practice to follow Kotlin's naming conventions to ensure your code is easily readable and maintainable.

For `val` variables use the **camelCase** format. 

```kotlin
val numberOfWheels: Int
val isConnectionAvailable: Boolean
val userFirstName: String
```
`const` variables are compile-time constants. Since they represent static, unchangeable values, their names should be in uppercase letters, with underscores separating words

```kotlin
const val MAX_USER_COUNT = 50
const val COMPANY_NAME = "TechCorp"
const val VERSION_CODE = 3
```

### Naming variables

Experienced programmers are very cautious with choosing names for variables, so their code is easy to follow. It is very important, as programmers spend a lot of time reading code written by others. 

To avoid unreadable code mistakes:

- Always give descriptive and concise names to all variables.
- Follow the naming conventions.
- Avoid Magic numbers, Such values must be stored in immutable variables, namely constants.
- Follow Kotlin rules that restrict possible names for variables.
    - Names are case-sensitive (number is not the same as Number);
    - Each name can include only letters, digits, and underscores;
    - A name cannot start with a digit;
    - A name cannot be a keyword (for example, val, var, fun are illegal).



## Lazy initialization

Lazy initialization lets us create an object at the exact point when the first reference to it occurs.

This means that we don't need to waste time by immediately using our program's resources to allocate memory to objects that aren't required from the outset.

If we allow objects to be initialized when they're needed, we can save a lot of time by redistributing the allocation of resources over the life cycle of our program.


Kotlin has a special `lazy()` function that accepts a lambda. The first call executes this lambda and remembers the result. Subsequent calls simply return this value.

Example:

```kotlin
fun main() {
    val a: String by lazy {
        print("Variable a is initialized. ")
        "I love Hyperskill!"
    }

    println("Initializing a! ") // Initializing a!
    println(a) // Variable a is initialized. I love Hyperskill!
    println(a) // I love Hyperskill!
}
```

> [!NOTE]
> When using lazy initialization in Kotlin, you must declare variables with the val keyword because the value can only be initialized once.

### Synchronization problems

If your programs take advantage of multithreading, you need to know about the `lazy()` function's mode parameter.

- `LazyThreadSafetyMode.SYNCHRONIZED` means that the value is only computed in one thread, and all threads will get the same value. It's the default option, so you can omit it if you wish:

```kotlin
val a: String by lazy(LazyThreadSafetyMode.SYNCHRONIZED) {
     //... 
     }
```
- `LazyThreadSafetyMode.PUBLICATION` specifies that the lambda can be called several times with an uninitialized lazy object value, but the value that is returned first will be used:

```kotlin
val a: String by lazy(LazyThreadSafetyMode.PUBLICATION) {
     //...
     }
```

- `LazyThreadSafetyMode.NONE` means there's no synchronization at all, so if we call the variable from different threads, its value can't be uniquely defined. Using this option isn't recommended if your program allows a lazy object to be called for the first time from more than one thread:

```kotlin
val a: String by lazy(LazyThreadSafetyMode.None) {
     //..
     }
```

You may be wondering why the keyword by is used before lazy? Well, it's to do with delegates. This is how we **delegate** the implementation of the corresponding property to a lambda.

### lateinit

Another delayed initialization feature in Kotlin that's worth mentioning is `lateinit`. This is a keyword rather than a function like `lazy()`.

We can't use the following approach because the default value of the field must be initialized:

```kotlin
var a: String
```

We could make a nullable, but we don't want it to be!
```kotlin
var a: String? = null
```
Fortunately, `lateinit` can be used to solve this problem:

```kotlin
lateinit var a: String

fun initA(a: String) {
    this.a = a
}
```

This method allows us to set the value of `a` in the `initA()`
function at a convenient point after the object has been created.

> [!NOTE]
> lateinit variables must be declared with var, unlike those declared with lazy().

We can also check whether the property has already been initialized.
To see how this works, let's add a function to our class.
As shown below, `isInitialized` can be called on the current object's field via `this::a`,
returning either true or false:

```kotlin 
lateinit var a: String

fun initA(a: String) {
    this.a = a
}

fun doSmth() {
    if (::a.isInitialized)
        println("a is Initialized")
    else
        println("a isn't Initialized")
}
```

> [!CAUTION]
> If you try to access a property before it has been initialized, an error will be thrown:
> Caused by: kotlin.UninitializedPropertyAccessException: lateinit property a has not been initialized

## Final members

In programming languages such as Java and C++, the final keyword is used to indicate that a value, method, or class cannot be changed or overridden. In Kotlin, however, the situation is somewhat different.

**In Kotlin, all classes and methods are final by default.** This means that if you declare a class in Kotlin, you will not be able to inherit it until you clearly make it `open`.  **Similarly, methods and properties in Kotlin are also final by default**, and they cannot be overridden in subclasses until they are declared `open`.
**Error declaretion**
```kotlin
class MyFinalClass {
    fun myFinalMethod() {
        println("This method cannot be overridden!")
    }
}

class MyChildClass : MyFinalClass() { // Error! Cannot inherit MyFinalClass
    override fun myFinalMethod() { // Error! Cannot override myFinalMethod
        println("I'm trying to override your method!")
    }
}
```
**Right way declaretion**
```kotlin
open class MyBaseClass {
    open fun myMethod() {
        println("Basic implementation")
    }
}

class MyDerivedClass : MyBaseClass() {
    override fun myMethod() {
        println("Overridden implementation")
    }
}
```
You might wonder why Kotlin takes such an approach. The answer is simple: the approach contributes to safer, more predictable code. After all, if a class or method can be arbitrarily inherited or overridden, that can lead to undesirable consequences.

### 'final' after 'open'

It is important to note that you can use `final` for overridden methods or properties to prevent them from being further redefined. Let's take an example:

```kotlin
open class MyBaseClass {
    open fun myMethod() {
        println("Basic implementation")
    }
}

open class MyIntermediateClass : MyBaseClass() {
    final override fun myMethod() {
        println("An overridden implementation that cannot be redefined further")
    }
}

class MyDerivedClass : MyIntermediateClass() {
    override fun myMethod() { // Error! Cannot override myMethod
        println("I'm trying to override your method!")
    }
}
```

## Visibility modifiers for members

Visibility modifiers are special keywords that define which part of your code is allowed to use. There are four access modifiers in Kotlin: **private**, **protected**, **internal**, and **public**.

- The `public` keyword is used to tell the compiler that something should be available to everywhere
- If you mark a declaration as `private`, it will only be visible inside the file that contains the declaration.
- `protected` is the same as `private`, except it can be seen in subclasses.
- If you mark it as `internal`, it will be visible everywhere in the same module.

## Visibility of constructors in a class

You can also specify a modifier for constructors: for example, make the class primary constructor private. Remember to add an explicit `constructor` keyword:

```kotlin
class Student private constructor(val name: String) {
    var age: Int = 0

    constructor(name: String, _age: Int) : this(name) {
        age = _age
    }
}

val anna: Student = Student("Anna")     // Error Cannot access 'constructor(name: String): Student': it is private in '/Student'.
val mark: Student = Student("Mark", 23) // ok
```