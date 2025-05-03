# Coroutine builders

As you remember, a regular non-suspending function cannot call a suspending function directly.
At the same time, many types of applications start with regular functions, so how then can we use coroutines?

The solution for this is **coroutine builders**.

A coroutine builder is a function that takes a suspending function as its parameter and schedules its execution.

The builder can be called from regular code, acting as a bridge between suspending and non-suspending planes.

## Wait for suspending code: `runBlocking`

`runBlocking` is a regular function that takes exactly one suspending function, executes it, waits until it finishes, and returns its result. This is exactly what we need in our situation! Let's give it a try:

```kotlin
import kotlinx.coroutines.delay
import kotlinx.coroutines.runBlocking

suspend fun doLotsOfWorkWithFile(file: String) = delay(5_000)

fun main() {
    runBlocking {                      // this lambda is our root suspending function
        println("Starting coroutine.") // it can contain regular functions
        doLotsOfWorkWithFile("a")      // and suspending functions as well
    }
    println("Work is done!")
}
```

As you can see, our main function is not suspending, but now it compiles and runs properly: the delay between the two outputs is 5 seconds.
We can say that we are waiting for the coroutine to finish in the regular code.

In fact, this is a common approach for simple apps or tests.
But what if we need to do multiple independent operations, for example, receive two files from two different servers? We can still run them using blocking:

```kotlin
fun main() = runBlocking {
    println("Starting coroutine")
    doLotsOfWorkWithFile("a")   // there is no limit on how many suspending 
    doLotsOfWorkWithFile("b")   // functions a suspending function can call
    println("Work is done!")
}
```

Suspending functions are executed sequentially, and we're waiting for the whole coroutine to finish. It will take about 10 seconds. **To launch different operations that can be suspended independently we can use another builder** — `launch`.

## Fire and forget: `launch`

`launch` is similar to `runBlocking` in terms of syntax but has a different purpose:
it does not wait for the coroutine to finish but immediately returns a special handler to the launched coroutine called a `Job`.

The coroutine itself continues working, but we can check the status or even cancel it through a `Job` object.

We'll talk about scopes later, now we are using `GlobalScope` for example purposes only.

```kotlin
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

fun main() {
    println("Starting")
    val importantJob = GlobalScope.launch {
        doLotsOfWorkWithFile("important_file") // waits for 5s
        println("Important file processed")    // will only print after 5s
    }
    val notImportantJob = GlobalScope.launch {
        doLotsOfWorkWithFile("optional_file")  // also waits 
        println("Optional file processed")
    }
    println("Finishing")
}       
```

This code will not print `Important file processed` or `Optional file processed` because `main` doesn't wait for the launched coroutines and returns immediately. The output would be:


```bash
Starting
Finishing
```

To wait for the result, we still need to block the main function:

```kotlin
fun main() {
    println("Starting")
    val importantJob = GlobalScope.launch {
        doLotsOfWorkWithFile("important_file")
        println("Important file processed")
    }
    val notImportantJob = GlobalScope.launch {
        doLotsOfWorkWithFile("optional_file")
        println("Optional file processed")
    }
    // we still have to use runBlocking because join() is a suspending function
    runBlocking {
        importantJob.join()  // join() suspends until the job is done
    }
    notImportantJob.cancel() // cancel non important job if it's not done yet
    println("Finishing")
}
```


















    