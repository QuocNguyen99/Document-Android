# Functional (SAM) interfaces

## Functional Interfaces in Kotlin

Functional interfaces, also known as Single Abstract Method (SAM) interfaces, are a crucial concept in Kotlin. They let you pass functions as parameters, return functions from other functions, and simplify event listeners and callback patterns.

## Passing Functions as Parameters:

Kotlin lets you pass a lambda expression where a functional interface is expected, which can notably simplify your code. Here's an example:

```kotlin
fun interface IntPredicate {
    fun accept(i: Int): Boolean
}

fun filter(numbers: List<Int>, predicate: IntPredicate): List<Int> {
    return numbers.filter { predicate.accept(it) }
}

fun main() {
    val isEven = IntPredicate { it % 2 == 0 }
    val evenNumbers = filter(listOf(1, 2, 3, 4), isEven)
    println(evenNumbers) // output: [2, 4] 
  
}
```

## Returning Functions from Functions:

You can also return a function from another function by defining a functional interface as the return type:

```kotlin
fun comparator(): Comparator<Int> {
    return Comparator { a, b -> a - b }
}

fun main() {
    val compareInts = comparator()
    println(compareInts.compare(10, 2)) // output: 8
}
```

## Simplifying Event Listeners and Callbacks:

Functional interfaces simplify the implementation of event listeners and callbacks significantly. Instead of creating an anonymous object, you can pass a lambda directly:

```kotlin
button.setOnClickListener { view ->
    // handle click
}
``` 

## Lambda Expressions and Functional Interfaces in Kotlin

Kotlin streamlines coding with lambda expressions and functional interfaces. You can use Kotlin's lambda expressions seamlessly with these interfaces to write concise code.

Here's an example of a functional interface in Kotlin:

```kotlin
fun interface ClickListener {
    fun onClick(viewId: Int)
}
```

By using a lambda expression, you can create a `ClickListener` instance without needing an anonymous class:

```kotlin
val clickListener = ClickListener { viewId ->
    println("Clicked on view with ID $viewId")
}
```


## Interoperability with Java: Kotlin's Functional Interfaces

Kotlin's functional interfaces interoperate seamlessly with Java's functional interfaces, such as those in the java.util.function package. This interoperability ensures Kotlin code can easily use Java libraries that rely on functional interfaces.

In Java, functional interfaces bear the `@FunctionalInterface` annotation. This tag suggests that the interface should be implemented via a Single Abstract Method (SAM). This is key for lambda expressions in Java.

```kotlin
@FunctionalInterface
public interface Consumer<T> {
    void accept(T t);
}
```

Kotlin, however, doesn't need an annotation to identify a functional interface. Any interface with a single abstract method counts as a functional (SAM) interface in Kotlin and can be instantiated using a lambda expression.

```kotlin
fun interface KConsumer<T> {
    fun accept(t: T)
}
```

When using Java functional interfaces in Kotlin, you can pass a lambda directly where a Java functional interface is expected, thanks to Kotlin's SAM conversion. This way:

```kotlin
val javaConsumer: Consumer<String> = Consumer { s -> println(s) }
```

Similarly, you can use Kotlin functional interfaces in Java. However, you need to use the class that Kotlin generates to implement the functional interface:

```kotlin
KConsumer<String> kotlinConsumer = new KConsumer<String>() {
    @Override
    public void accept(String s) {
        System.out.println(s);
    }
};
```

### Best Practices:

1. **Use SAM Conversions for Simplicity**: When interfacing with Java code or simplifying your Kotlin code, use SAM conversions to replace anonymous classes with lambda expressions, which makes your code cleaner and easier to read.

    ```kotlin
    fun interface ClickListener {
        fun onClick(view: View)
    }

    val clickListener = ClickListener { view ->
        // handle click
    }
    ```

2. **Leverage Type Inference**: Kotlin's type inference feature allows you to omit the interface type when it can be inferred from the context, further reducing boilerplate.
    ```kotlin
    button.setOnClickListener { view ->
        // handle click
    }
    ```
3. **Keep Functional Interfaces Simple**: Functional interfaces should only have one abstract method. This simplicity ensures they're perfect for SAM conversions and lambda expressions.


### Limitations and Considerations

1. **Single Abstract Method Restriction**: SAM interfaces can have only one abstract method, which can be restrictive for complex interfaces. Make sure your functional interface fits a single responsibility.

2. **No SAM Conversions for Kotlin Interfaces**: SAM conversions only apply to Java interfaces in Kotlin. For Kotlin interfaces, you need to use function types or define a full class implementation.

3. **Explicit Types for Ambiguity**: In cases where the lambda could match multiple functional interfaces, declare the type explicitly to avoid confusion.

```kotlin
val runnable: Runnable = Runnable {
    // implementation
}
```

