# Visibility for classes, packages, and modules

## Defining class visibility

In Kotlin, class visibility is determined by visibility modifiers, which specify what code can access the class. There are four visibility modifiers:

- **public**: The class is accessible from any code.
- **internal**: The class is accessible only within the module.
- **protected**: The class is accessible only within the class and its subclasses.
- **private**: The class is accessible only within the file it is declared in.
## Inheritance and visibility

In Kotlin, if a class inherits another class, **it can access its protected and internal members.**

## Modules and internal visibility

A module is a set of source files compiled together.

In Kotlin, a module can be an IntelliJ IDEA project, a Gradle or Maven project, or another compilation unit.

The `internal` modifier is used to indicate that a certain code element is accessible only within a single module. This is useful when you want to restrict access to parts of the code that should only be available within the module and should not be visible outside of it.


```kotlin
// In the file mymodule/MyInternalClass.kt
package mymodule

internal class MyInternalClass {
    val value = 42
}
```

```kotlin
// In another file within the same module
import mymodule.MyInternalClass

fun main() {
    val instance = MyInternalClass() // Allowed, as MyInternalClass is part of the same module
    println(instance.value)
}
```