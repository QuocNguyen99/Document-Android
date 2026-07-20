# StringBuffer

`StringBuffer` is a thread-safe alternative to `StringBuilder`, designed for use in multi-threaded environments. It ensures synchronization, allowing only one thread to access its methods at a time, preventing race conditions. 

## Constructor of StringBuffesr

- **Default Constructor**: Creates an empty `StringBuffer` with a default capacity of 16 characters:
```kotlin
val buffer = StringBuffer()
```
- **With Initial Content**: Initializes with a given string:
```kotlin
val buffer = StringBuffer("Kotlin")
```
- **With Specified Capacity**: Sets a custom initial capacity:
```kotlin
val buffer = StringBuffer(10)
```

## Key Methods

`StringBuffer` shares methods with `StringBuilder`, such as `append()`, `insert()`, `delete()`, `reverse()`, and `replace()`.

> **Note**: The `toString()` method creates a new `String` object. Changes to the `StringBuffer` after calling `toString()` do not affect the `String`.

## Thread Safety

All `StringBuffer` methods are synchronized, making it thread-safe. However, synchronization applies only to its methods, not the object itself. Ensure shared resources are synchronized externally when used across threads.

### Example:
```kotlin
fun main() {
        val sharedSequence = StringBuilder("InitialData")
    val stringBuffer = StringBuffer()

        val thread1 = Thread {
        synchronized(sharedSequence) {
            stringBuffer.append(sharedSequence)
        }
        println("Thread 1: $stringBuffer")
    }

        val thread2 = Thread {
        synchronized(sharedSequence) {
            sharedSequence.append("ModifiedByThread2")
        }
        println("Thread 2: $sharedSequence")
    }

        thread1.start()
    thread2.start()
    thread1.join()
    thread2.join()

    println("Final StringBuffer content: $stringBuffer")
    println("Final shared sequence content: $sharedSequence")
}
```

## Best Practices

### Use `StringBuilder` When:
1. Single-threaded operations like string concatenation, logging, or dynamic content generation.
2. Performance-critical tasks where synchronization is unnecessary.

### Use `StringBuffer` When:
1. Multi-threaded operations requiring thread-safe string manipulation.
2. Concurrent text generation or caching shared strings across threads.

## Performance Trade-off

`StringBuffer` is slower than `StringBuilder` due to synchronization overhead. Use `StringBuilder` if thread safety is not required.

### Example:
```kotlin
const val N = 99999999

fun main() {
        val buffer = StringBuffer()
        val builder = StringBuilder()
    
    val bufferTime = measureTimeMillis {
        for (i in N downTo 1) buffer.append("")
    }

    val builderTime = measureTimeMillis {
    for (i in N downTo 1) builder.append("")
    }
    
    println("StringBuffer: $bufferTime ms")
    println("StringBuilder: $builderTime ms")
}
```
**Output:**
```bash
StringBuffer: 1999 ms
StringBuilder: 193 ms
```