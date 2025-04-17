# StringBuffer

`StringBuilder`, as you might already know, is a powerful tool that provides you with mutable strings. However, it may not be the best solution in situations where **multiple threads** need to modify the same `StringBuilder` object **simultaneously**.


That's where `StringBuffer` comes in. It is a peer class to `StringBuilder`, with an additional feature:

**synchronization** (a mechanism that ensures that only one thread can access a shared resource at a time, preventing race conditions and other concurrency issues). 

## Constructors of StringBuffer

- An empty `StringBuffer` with a default initial capacity (16 bytes) can be created using the default constructor:

```kotlin
val buffer = StringBuffer()
```

- You can also create a `StringBuffer` with some initial content by passing a String to the constructor:
```kotlin
val buffer = StringBuffer("Kotlin")
```

- If you want to specify the capacity of the `StringBuffer` at the time of creation, you can pass an `Int` to the constructor:

```kotlin
val buffer = StringBuffer(10) // creates a StringBuffer with an initial capacity of 10 characters
```

## Methods of StringBuffer

`StringBuffer` shares many similar methods with `StringBuilder` such as `append()`, `insert()`, `delete()`, `reverse()`, and `replace()`,`tostring()`.

> [!NOTE]
> The toString method returns a new String object that represents the content of the StringBuffer. Therefore, any subsequent changes made to the StringBuffer after calling toString will not affect the String object. 

However, it's important to note that there is a crucial difference under the hood. A closer look at the `StringBuffer` class inside the `java.lang` library reveals that all `StringBuffer` methods are marked with the `synchronized` modifier. 

This is what makes `StringBuffer` synchronized and thread-safe, allowing it to be used by multiple threads without the need for external synchronization.

> [!CAUTION]
> When using a StringBuffer to append or insert data from a source sequence that is shared across threads, it is important to ensure that the source sequence is not modified by other threads while the operation is in progress. This is because only the methods of the StringBuffer are synchronized, not the StringBuffer itself.

Example for the correct way: 

```kotlin
fun main() {
    // Shared sequence across threads
    val sharedSequence = StringBuilder("InitialData")

    // A StringBuffer instance
    val stringBuffer = StringBuffer()

    // Thread 1: Appends the shared sequence to the StringBuffer
    val thread1 = Thread {
        synchronized(sharedSequence) {
            stringBuffer.append(sharedSequence)
        }
        println("Thread 1: $stringBuffer")
    }

    // Thread 2: Modifies the shared sequence
    val thread2 = Thread {
        synchronized(sharedSequence) {
            sharedSequence.append("ModifiedByThread2")
        }
        println("Thread 2: $sharedSequence")
    }

    // Start both threads
    thread1.start()
    thread2.start()

    // Wait for threads to finish
    thread1.join()
    thread2.join()

    println("Final StringBuffer content: $stringBuffer")
    println("Final shared sequence content: $sharedSequence")
}
```

## Best practice

Best scenarios for using `StringBuilder`:

1. **String concatenation**: If you're working on tasks that involve heavy string concatenation operations, such as generating dynamic SQL queries or constructing large JSON/XML payloads, `StringBuilder` is an excellent choice. Its mutable nature allows for efficient appending of strings, reducing memory consumption and avoiding unnecessary object creations.

2. **Logging and formatting**: When logging or formatting messages that involve dynamic or variable data, `StringBuilder` proves beneficial. By appending different values or variables to the `StringBuilder`, you can efficiently build complex log messages or formatted strings without unnecessary overhead.

3. **Generating HTML or XML markup**: When dynamically generating HTML or XML markup, `StringBuilder` can be a suitable choice.


Best scenarios for using `StringBuffer`:

1. **Concurrent data processing**: When processing data concurrently in a multi-threaded environment, `StringBuffer` can be used to safely manipulate shared strings. For example, if multiple threads need to extract and process data from a shared log file or data stream, `StringBuffer` can be used to ensure that the data is consistently and accurately processed.

2. **Multi-threaded text generation**: In applications that generate text concurrently, such as report generation or document formatting, `StringBuffer` can be used to safely build the final text output. By using `StringBuffer`, multiple threads can append text to the shared buffer without worrying about synchronization issues.

3. **Thread-safe string caching**: In applications that cache frequently used strings, such as web servers or database systems, `StringBuffer` can be used to implement a thread-safe cache. By using `StringBuffer`, multiple threads can safely access and manipulate the cached strings without data corruption or inconsistencies.

## The price of synchronization

When trying to choose between `StringBuilder` and `StringBuffer`, **you should consider the trade-off between synchronization and performance**.

**It introduces a slight overhead, making it slightly slower than StringBuilder.**

Therefore, if thread safety is not a concern in your specific scenario, it will be more efficient to use `StringBuilder`

Example :

```kotlin
const val N = 99999999 // Number of iterations for the test

fun main() {
    var time: Long
    var executionTime: Long

    println("For the same task:")

    // Using StringBuffer
    val buffer = StringBuffer()
    time = System.currentTimeMillis() // We save the start time of the task
    for (i in N downTo 1) {
        buffer.append("")
    }
    executionTime = System.currentTimeMillis() - time // We find the execution time of the task
                                                      // by subtracting the start time from the end time
    println("StringBuffer gets it finished in $executionTime ms,")

    // Using StringBuilder
    val builder = StringBuilder()
    time = System.currentTimeMillis()
    for (i in N downTo 1) {
        builder.append("")
    }
    executionTime = System.currentTimeMillis() - time
    println("while StringBuilder gets it finished in just $executionTime ms!")
}
```

output look like this :

```bash
For the same task:
StringBuffer gets it finished in 1999 ms,
while StringBuilder gets it finished in just 193 ms!
```