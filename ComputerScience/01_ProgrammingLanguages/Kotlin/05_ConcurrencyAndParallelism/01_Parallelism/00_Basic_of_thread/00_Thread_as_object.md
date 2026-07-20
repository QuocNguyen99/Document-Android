# Thread as Object

## Threads in Kotlin

Kotlin was originally designed with built-in multithreading support. Threads are supported on the level of the JVM, the level of the language (special keywords), and the level of the standard library. Every Kotlin program has at least one thread, which is called **main**; it is created automatically by the JVM process to execute statements inside the `main()` function.

## A class for threads

A thread is a sequence of instructions that a program can execute when it runs. Each thread is represented by an object – an instance of the `java.lang.Thread` class (or its subclass).


The `Thread` class has a static method named `currentThread` to obtain a reference to the currently executing thread object

## The information on the main thread

The `Thread` class stores basic information about the thread: its name, identifier (`long`), priority, and some other characteristics that can be obtained through its functions. 

The example below demonstrates how to obtain the characteristics of the main thread by making references to it through an object of the `Thread` class.

```kotlin
fun main() {
    val t: Thread = Thread.currentThread() // main thread

    println("Name: ${t.name}")
    println("ID: ${t.id}")
    println("Alive: ${t.isAlive}")
    println("Priority: ${t.priority}")
    println("Daemon: ${t.isDaemon}")
}
```


- `t.name` returns the thread's name;

- `t.id` returns the thread's unique identifier;

- `t.isAlive` tells us whether the thread has been started and hasn't died yet;

- `t.priority` returns the priority of the given thread.

- `t.isDaemon` checks whether the thread is a **daemon**. 

> [!NOTE]
> A daemon thread (comes from UNIX terminology) is a low priority thread that runs in the background to perform tasks such as garbage collection and so on. The JVM does not wait for daemon threads to stop before exiting, while it does so for non-daemon threads.

Each characteristic can be changed by setting a new value