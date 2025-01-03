# Try-catch statement

Kotlin has the exception handling mechanism. After a line of code throws an exception, Kotlin attempts to find a suitable handler for it. As soon as a suitable handler is found and executed, the exception is considered handled and the program runs normally.

```kotlin
try {
    // code that may throw an exception
} catch (e: SomeException) {
    // code for handling the exception
}
```
The `try` block is used to wrap the code that may throw an exception. This block can include all lines of code, including method calls. The `catch` block is a handler for the specified type of exception and all its subtypes. 

Pay attention! The variables announced in the `try` block will only be available inside the block: you can't work with them either outside or in the `catch` block.

> [!NOTE]
>If the result of the execution of the try block throws an exception not foreseen in the catch expression, the program will fail despite all precautions.

## Where and how to handle an exception

Technically, an exception can be handled in the method where it occurs or in the calling method. The best approach to handle an exception is to do it in a method that has sufficient information to make the correct decision based on this exception.

So, why should we throw out specific types of exceptions when there is a general `Exception` that includes all possible cases and is always appropriate? 
Well, keep in mind that your colleagues or maybe even yourself in a couple of weeks may not really know what’s going on in the code. It would be best for you to provide as much information as possible. This will make handling exceptions much easier.

**Always try to find the exception type that fits best to your exceptional event.**

Actually, there is another possible block called `finally`. All the statements present in this block will always execute regardless of whether an exception occurs in the `try` block or not.

You will find `finally` helpful in situations when you need to perform some finishing actions regardless of whether an exception is thrown.

It is also possible to write try and finally without a catch block

## Try-with-resources

When an input stream is created, the JVM notifies the OS about its intention to work with a file.

If the JVM process has enough permissions and everything is fine, the OS returns a file descriptor — a special indicator used by a process to access the file. The problem is that the number of file descriptors is limited.

This is the reason why it is important to notify the OS that the job is done and the file descriptor that is held can be released for further reuse. In previous examples, we invoked the method `close` for this purpose. Once it is called, the JVM releases all system resources associated with the stream.

Resource releasing works if the JVM calls the `close` method, but it is possible that the method will not be called at all.

Look at the example:

```kotlin
val reader: Reader = FileReader("file.txt")
// code which may throw an exception
reader.close()
```

Suppose something goes wrong before the `close` invocation and an exception is thrown. It leads to a situation in which the method will never be called and system resources won't be released. It is possible to solve the problem by using the **try-catch-finally** construction:

```kotlin
var reader: Reader? = null
try {
    reader = FileReader("file.txt")
    // code which may throw an exception
} finally {
    reader!!.close()
}
```

**Unfortunately, this solution still has some problems**. That is, the `close` method can potentially raise exceptions itself. Suppose there are two exceptions: the first was raised inside the `try` section, and the second was thrown by the `finally` section. 

### Solution

A simple and reliable way called **try-with-resources** was introduced in Java 7. In Kotlin, there is no implementation of try-with-resources, but we can apply the `use` extension method:


```kotlin
FileReader("file.txt").use {
    reader ->
    // some code
}
```


As you see, there are no explicit calls of the `close` method at all. It is implicitly invoked for all objects declared in the first part. The construction guarantees closing all resources in a proper way.

> [!NOTE]
> Surely, we do our best to write error-free programs. However, it is difficult to foresee all possible problems. The best practice is to place any code concerning system resources in the use method.

### Closeable resources

We have dealt with a file input stream to demonstrate how try-with-resources is used. However, not only the resources based on files should be released. Closing is also crucial for other outside sources, like web or database connections. Classes that handle them have a `close` method and, therefore, can be wrapped by the try-with-resources statement.

For example, let's consider `java.util.Scanner`. Earlier, we used `Scanner` for reading data from the standard input, but it can read data from a file as well. `Scanner` has a close method for releasing outside sources.

```kotlin
Scanner(File("file.txt")).use { scanner ->
    val first: Int = scanner.nextInt()
    val second: Int = scanner.nextInt()
    println("arguments: $first $second")
}
```

### What's under the hood?

The use implementation looks like this:

```kotlin
public inline fun <T : Closeable?, R> T.use(block: (T) -> R): R {
    contract {
        callsInPlace(block, InvocationKind.EXACTLY_ONCE)
    }
    var exception: Throwable? = null
    try {
        return block(this)
    } catch (e: Throwable) {
        exception = e
        throw e
    } finally {
        when {
            apiVersionIsAtLeast(1, 1, 0) -> this.closeFinally(exception)
            this == null -> {}
            exception == null -> close()
            else ->
                try {
                    close()
                } catch (closeException: Throwable) {
                    // cause.addSuppressed(closeException) // ignored here
                }
        }
    }
}
```

This function is defined as a generic extension on all` Closeable?` types. `Closeable` is Java's interface that uses try-with-resources.

If Kotlin didn't implement the use extension functions, we would need to write more code, take a look:

```kotlin
import java.io.Closeable

fun main() {
    val resource = CustomCloseable()
    resource.use {
        println("I am an example of some code!")
        it.exampleMethod()
    }
    println("End of program!")
}

class CustomCloseable : Closeable {
    override fun close() {
        println("Close resource")
    }

    fun exampleMethod() {
        println("Example of some method for the CustomCloseable class")
    }
}
```

## Nothing

**Kotlin is a statically-typed language**. This means every expression in Kotlin has a known type at compile time

In Kotlin, `Nothing` is a unique type because **it doesn't have an instance**. You might ask when this is useful. It can be used when a function never returns a value, not even Unit.

In essence, `Nothing` is a subtype of every known type in Kotlin. It means that it can represent a value of any type in terms of type checks.

For example, let's consider a situation where the Nothing type is particularly useful:

```kotlin
fun fail(): Nothing {
    throw RuntimeException("This function always throws an exception")
}

fun calculatePercentage(marks: Int, total: Int): Float {
    if (total == 0) {
        fail()  // 'fail()' is used where a Float is expected
    }
    return (marks/total.toFloat()) * 100
}
```

## Catching supertype

Imagine a situation where you encounter different types of exceptions and want to handle them differently. 


```kotlin
fun main() {
    val input = readln()
    try {
        println(100 / input.toInt())
    } catch (e: Exception) {
        println("What else can go wrong!")
    } catch (e: NumberFormatException) {
        println("You didn't type an INT number!")
    } catch (e: ArithmeticException) {
        println("You typed 0!")
    }
}
```

By rearranging the catch blocks and placing the more specific exceptions first, we ensure that the corresponding catch block executes correctly.

the when statement can help us with writing a more concise code to catch multiple exceptions in a single catch block:

```kotlin
fun main() {
    val input = readln()
    try {
        println(100 / input.toInt())
    } catch (e: Exception) {
        when (e) {
            is NumberFormatException -> println("You didn't type an INT number!")
            is ArithmeticException -> println("You typed 0!")
            else -> println("What else can go wrong!")
        }
    }
}
```


