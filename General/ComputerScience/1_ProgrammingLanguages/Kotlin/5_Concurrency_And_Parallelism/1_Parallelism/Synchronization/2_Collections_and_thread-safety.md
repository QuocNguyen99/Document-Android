# Collections and thread-safety

## Classic collections and multithreading


several threads may access the same data concurrently, which often leads to different problems unless we use some kind of synchronization.

Similar problems occur when multiple threads access a collection:

- Most of the classic collections like `Array`, `List`, `Map`, and `Set` are non-synchronized and, as a consequence, do not provide thread safety.
- There is a set of collections like `Hashtable`, `Vector`, or `Stack` (which will be discussed in following topics) that are totally synchronized and thread-safe, but their performance is low.
- When one thread is iterating over a standard totally synchronized collection and another thread tries to add a new element to it, then we get a runtime exception called `ConcurrentModificationException`.

The following program demonstrates a race condition, which appears when two threads add elements to the same collection.


```kotlin
import kotlin.concurrent.thread

fun addNumbers(target: MutableList<Int>) {
    for (i in 0 until 100_000) target += i
}

fun main() {
    val numbers = mutableListOf<Int>()

    val writer = thread(start = false, name = "Thread 1", block = {
        addNumbers(numbers)
    })
    writer.start()

    addNumbers(numbers) // add a number from the main thread

    writer.join() // wait for the writer thread

    println(numbers.size) // the result can vary
}
```

The expected result is 200000 (100000 + 100000), but in fact, it changes every time you run this code. Some list elements are lost.

We started the program three times and got the following results:

```bash
162527
140487
143736
```

So, it is a bad idea to use standard collections in multithreaded environments without explicit synchronization. However, once again, such synchronization may lead to poor performance and hard-to-find errors in large programs.

## Concurrent collections

To avoid all the problems associated with custom synchronization, the Java Class Library provides alternative collection implementations that are adapted for multithreaded applications and are fully thread-safe. You may find them in the `java.util.concurrent` package, which includes collections like `ConcurrentMap`, `ConcurrentLinkedQueue`, and `CopyOnWriteArrayList`. They make it easier to develop modern Java applications.

These concurrent collections allow you to avoid custom synchronization in many cases and have a high performance – close to that of classic collections

Concurrent collections do not use the `@Synchronized` annotation but rely on more complex synchronization primitives and a lock-free algorithm, which allows them to be both thread-safe and high-performance. **However, if you do not really need multithreading, use classic collections, since they are still more efficient than concurrent ones.**

