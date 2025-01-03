# Packages and imports

## Packages

In a package, we group classes, functions, and/or variables according to a specific use case or functionality.

To define a package, we use a `package` header. 

All the elements within this package, whether they are in the same file or not (classes and functions), are encapsulated under that package. To be able to use them, we must indicate the complete name of the element, which includes the package name.

```kotlin
package packages

data class Person(val name: String, val age: Int)

fun sayHello() {
    println("Hello")
}

fun main() {
    val person = packages.Person("John", 30)
    packages.sayHello()
}
```

## Imports

If we want to use code that is grouped or encapsulated within a package, we must `import` it. 

We can import either the entire package 

```kotlin
import allpackage.*
```

or some specific elements from that package.

```kotlin
import oneclass.Person
```

## Default imports

The are a number of packages that are imported into every Kotlin file by default:

- kotlin.*
- kotlin.annotation.*
- kotlin.collections.*
- kotlin.comparisons.*
- kotlin.io.*
- kotlin.ranges.*
- kotlin.sequences.*
- kotlin.text.*

## Import alias

Sometimes, we may need to import two elements that have the same name but belong to different packages or import the same class and use it with two different names. 

We do that with the `as` modifier.

```kotlin
import packagetwo.Person as PersonAdavanced
```

