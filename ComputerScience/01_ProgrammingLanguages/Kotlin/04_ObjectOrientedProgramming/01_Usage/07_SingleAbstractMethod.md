# Single Abstract Method (SAM)

An interface with only one abstract member function is called a functional interface or a **Single Abstract Method (SAM) interface.**

The functional interface can have several non-abstract member functions but only one abstract member function.

you can use SAM conversions that help make your code more concise and readable by using lambda expressions.

For example, consider the following Kotlin functional interface:

```kotlin
fun interface IntPredicate {
   fun accept(i: Int): Boolean
}
```

If you don't use a SAM conversion, you will need to write code like this:

```kotlin
// Creating an instance of a class
val isEven = object : IntPredicate {
   override fun accept(i: Int): Boolean {
       return i % 2 == 0
   }
}
```

By leveraging Kotlin's SAM conversion, you can write the following equivalent code instead:


```kotlin
// Creating an instance using lambda
val isEven = IntPredicate { it % 2 == 0 }
```