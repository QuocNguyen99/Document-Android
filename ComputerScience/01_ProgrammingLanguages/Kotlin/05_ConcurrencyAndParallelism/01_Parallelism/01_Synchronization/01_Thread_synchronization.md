# Thread synchronization

Concurrent use of shared data by multiple threads may cause unexpected or erroneous behavior. Fortunately, Kotlin allows us to control the access of multiple threads to a shared resource of any type.

## Important terms and concepts

1.  **Thread synchronization** is a mechanism which ensures that two or more concurrent threads do not simultaneously execute a code segment called a critical section.
2.  **A critical section** is a region of code that accesses shared resources and should not be executed by more than one thread at the same time. A shared resource may be a variable, file, input/output port, database, or something else.

## Code synchronizing

The "classic" and simplest way to protect code from being concurrently accessed by multiple threads involves using synchronized methods.

There are two different forms of synchronization:

- synchronized function (we use the annotation `@Synchronized`)

```kotlin
@Synchronized fun myFunction() {
    //do something
}
```

Note that **annotations** are a means of attaching metadata to code; in the following topics, you will learn more about them. For now, just remember that `@Synchronized` is an easy way to tell the compiler that a method can only be used by one thread at a time.

- synchronized blocks or statements (we use the function `synchronized()`)

```kotlin
 fun myOtherFunction() {
 
    // a synchronized block
    synchronized(this) {
         // block's code
    }
}
```

A synchronized function or block needs an object for locking threads. Only one thread can execute code in a synchronized block or method at the same time. Other threads are blocked until the thread inside the synchronized block or method exits it.
