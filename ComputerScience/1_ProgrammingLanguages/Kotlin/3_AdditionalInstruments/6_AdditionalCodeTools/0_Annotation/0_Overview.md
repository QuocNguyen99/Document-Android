# Annotation

Annotations offer a way of providing instructions and metadata (data about data) to the compiler, IDE, or framework to handle some complex tasks and make your life easier.

> [!NOTE]
> Metadata is the information about data that makes this data more meaningful, so in our case, the compiler or frameworks will have useful information about our code to perform complex tasks.

The most common case is using libraries like **Room** or **Retrofit** when you develop android apps or frameworks like **Spring** or **Spring Boot**. 
These frameworks come with many built-in annotations, and through them, frameworks will know what you want to do and will do it for you without showing you the complex implementation. 

You may conceive of an annotation as magic – one word does a lot of work in the background.
You can add as many annotations as you want to one target

## Suppress annotation

`@Suppress("name of warning")` is an annotation that tells the compiler to suppress a specific warning, which is passed in quotation marks in the parentheses.

## Annotation target

Annotation targets are all kinds of annotated elements, such as classes, functions, properties, and expressions.

Some annotations can work with specific elements, and some can work with all elements, so it's important to know the target if you are creating a custom annotation or using them.

Example :

```kotlin
fun main() {
    @Suppress("CanBeVal") 
    var number = 45       // Warning will disappear from here
    var anotherNumber = 5 // Warning will still appear here
    println(number)
    println(anotherNumber)
}
```

We can also target a whole function. Consider the example below:

```kotlin
// no warning at all!
@Suppress("CanBeVal")
fun main() {
    var number = 45
    var anotherNumber = 5
    println(number)
    println(anotherNumber)
}
```

Also, we can target a whole class, like in the example below.

```kotlin
@Suppress("unused")
class MyClass {
    fun printNumber() {
        /*..*/
    }

    fun sumNumber() {
        /*..*/
    }
}
```
Last but not least, we can target a whole file by writing `@file:NameOfAnnotation()` at the top of the file.

```kotlin
@file:Suppress("unused")

class MyClass {
    fun printNumber() {
        /*..*/
    }

    fun sumNumber() {
        /*..*/
    }
}

class AnotherClass {
    fun printNumber() {
        /*..*/
    }

    fun sumNumber() {
        /*..*/
    }
}
```