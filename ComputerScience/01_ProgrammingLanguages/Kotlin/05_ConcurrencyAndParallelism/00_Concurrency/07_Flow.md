# Asynchronous Flow

A suspending function asynchronously returns a single value, but how can we return multiple asynchronously computed values? This is where Kotlin Flows come in.

## Flow

a `Sequence<Int>` type for synchronously computed values:

```kotlin
fun simple(): Sequence<Int> = sequence { // sequence builder
    for (i in 1..3) {
        Thread.sleep(100) // pretend we are computing it
        yield(i) // yield next value
    }
}

fun main() {
    simple().forEach { value -> println(value) } 
}
```


Flow is a reactive stream, To represent the stream of values that are being computed asynchronously,
we can use a `Flow<Int>` type just like we would use 


```kotlin
              
fun simple(): Flow<Int> = flow { // flow builder
    for (i in 1..3) {
        delay(100) // pretend we are doing something useful here
        emit(i) // emit next value
    }
}

fun main() = runBlocking<Unit> {
    // Launch a concurrent coroutine to check if the main thread is blocked
    launch {
        for (k in 1..3) {
            println("I'm not blocked $k")
            delay(100)
        }
    }
    // Collect the flow
    simple().collect { value -> println(value) } 
}
```
Output
```bash
I'm not blocked 1
1
I'm not blocked 2
2
I'm not blocked 3
3
```

- A builder function of `Flow` type is called `flow`.
- Code inside a `flow { ... }` builder block can suspend.
- The function is no longer marked with a `suspend` modifier.
- Values are **emitted** from the flow using an `emit` function.
- Values are **collected** from the flow using a `collect` function.
## Flows are cold

Flows are **cold** streams similar to sequences.**The code inside a flow builder does not run until the flow is collected**. This becomes clear in the following example:

```kotlin
fun simple(): Flow<Int> = flow { 
    println("Flow started")
    for (i in 1..3) {
        delay(100)
        emit(i)
    }
}

fun main() = runBlocking<Unit> {
    println("Calling simple function...")
    val flow = simple()
    println("Calling collect...")
    flow.collect { value -> println(value) } 
    println("Calling collect again...")
    flow.collect { value -> println(value) } 
}
```

Output

```bash
Calling simple function...
Calling collect...
Flow started
1
2
3
Calling collect again...
Flow started
1
2
3
```

This is a key reason the simple function (which returns a flow) is not marked with suspend modifier. 
The `simple()` call itself returns quickly and does not wait for anything. 
The flow starts afresh every time it is collected and that is why we see "Flow started" every time we call collect again.

## Flow cancellation basics

Flows adhere to the general cooperative cancellation of coroutines. 
As usual, flow collection can be cancelled when the flow is suspended in a cancellable suspending function (like `delay`). 

- The following example shows how the flow gets cancelled on a timeout when running in a `withTimeoutOrNull` block and stops executing its code:

```kotlin
          
fun simple(): Flow<Int> = flow { 
    for (i in 1..3) {
        delay(100)          
        println("Emitting $i")
        emit(i)
    }
}

fun main() = runBlocking<Unit> {
    withTimeoutOrNull(250) { // Timeout after 250ms 
        simple().collect { value -> println(value) } 
    }
    println("Done")
}
```
Output:
```kotlin
Emitting 1
1
Emitting 2
2
Done
```

- In the case where you have a busy loop with coroutines you must explicitly check for cancellation. 
You can add `.onEach { currentCoroutineContext().ensureActive() }`, but there is a ready-to-use `cancellable()` operator provided to do that:

```kotlin          
fun main() = runBlocking<Unit> {
    (1..5).asFlow().cancellable().collect { value -> 
        if (value == 3) cancel()  
        println(value)
    } 
}
```


> [!NOTE]
> However, most other flow operators do not do additional cancellation checks on their own for performance reasons.

## Flow builders

The `flow { ... }` builder from the previous examples is the most basic one. 
There are other builders that allow flows to be declared:

- The `flowOf` builder defines a flow that emits a fixed set of values.

- Various collections and sequences can be converted to flows using the `.asFlow()` extension function.

## Intermediate flow operators

You can transform a flow using operators, just like you would with a list or sequence. 
These operators take an **upstream flow** and create a new **downstream flow** with the transformation applied.

The operators are cold, meaning they don’t do anything until the flow is actually collected. 
Calling an operator is not a suspending function — it just defines a new flow and returns it immediately without running any code yet.

The basic operators have familiar names like `map` and `filter`. 
An important difference of these operators from sequences is **that blocks of code inside these operators can call suspending functions**.

```kotlin
         
suspend fun performRequest(request: Int): String {
    delay(1000) // imitate long-running asynchronous work
    return "response $request"
}

fun main() = runBlocking<Unit> {
    (1..3).asFlow() // a flow of requests
        .map { request -> performRequest(request) }
        .collect { response -> println(response) }
}
```

### Transform operator

The most flexible operator for transforming flows is `transform`. 
You can use it to do simple things like `map` or `filter`, but also more complex logic.

> [!TIP]
> With `transform`, you have full control — you can emit any values you want, and as many times as you need.


```kotlin
(1..3).asFlow() // a flow of requests
    .transform { request ->
        emit("Making request $request") 
        emit(performRequest(request)) 
    }
    .collect { response -> println(response) }
```

### Size-limiting operators

Size-limiting intermediate operators like `take` cancel the execution of the flow when the corresponding limit is reached. 

> [!CAUTION]
> Cancellation in coroutines is always performed by throwing an exception,
>  so that all the resource-management functions (like `try { ... }` `finally { ... }` blocks) operate normally in case of cancellation

```kotlin
fun numbers(): Flow<Int> = flow {
    try {                          
        emit(1)
        emit(2) 
        println("This line will not execute")
        emit(3)    
    } finally {
        println("Finally in numbers")
    }
}

fun main() = runBlocking<Unit> {
    numbers() 
        .take(2) // take only the first two
        .collect { value -> println(value) }
}        
```
Output
```bash
1
2
Finally in numbers
```

## Terminal flow operators

Terminal operators on flows are **suspending functions** that start a collection of the flow. 
The `collect` operator is the most basic one, but there are other terminal operators

- Conversion to various collections like `toList` and `toSet`.
- Operators to get the `first` value and to ensure that a flow emits a `single` value.
- Reducing a flow to a value with `reduce` and `fold`.

## Flows are Sequential

Flows process values one at a time in order, from upstream to downstream. 
When you collect a flow, each emitted value goes through all intermediate operators (like `filter`, `map`) sequentially, then reaches the final collect.

```kotlin

(1..5).asFlow()
    .filter {
        println("Filter $it")
        it % 2 == 0              
    }              
    .map { 
        println("Map $it")
        "string $it"
    }.collect { 
        println("Collect $it")
    }    
```
Output
```bash
Filter 1
Filter 2
Map 2
Collect string 2
Filter 3
Filter 4
Map 4
Collect string 4
Filter 5
```
## Flow context

When you collect a flow, it always runs in **the context of the calling coroutine** — not the context where the flow was created.

For example:

```kotlin
withContext(context) {
    simple().collect { value ->
        println(value) // This runs in 'context'
    }
}
```

This behavior is called **context preservation** 

> [!CAUTION]
> A common pitfall when using `withContext`, Usually, `withContext` is used to change the context in the code using Kotlin coroutines, 
> but code in the `flow { ... }` builder has to honor the context preservation property and is not allowed to emit from a different context.

```kotlin
fun simple(): Flow<Int> = flow {
    // The WRONG way to change context for CPU-consuming code in flow builder
    withContext(Dispatchers.Default) {
        for (i in 1..3) {
            Thread.sleep(100) // pretend we are computing it in CPU-consuming way
            emit(i) // emit next value
        }
    }
}

fun main() = runBlocking<Unit> {
    simple().collect { value -> println(value) } 
}        
```
Ouput
```bash
Exception in thread "main" java.lang.IllegalStateException: Flow invariant is violated:
		Flow was collected in [CoroutineId(1), "coroutine#1":BlockingCoroutine{Active}@5511c7f8, BlockingEventLoop@2eac3323],
		but emission happened in [CoroutineId(1), "coroutine#1":DispatchedCoroutine{Active}@2dae0000, Dispatchers.Default].
		Please refer to 'flow' documentation or use 'flowOn' instead at ...
```
## flowOn operator

The correct way to change the context of a flow is shown in the example below:

```kotlin
fun simple(): Flow<Int> = flow {
    for (i in 1..3) {
        Thread.sleep(100) // pretend we are computing it in CPU-consuming way
        log("Emitting $i")
        emit(i) // emit next value
    }
}.flowOn(Dispatchers.Default) // RIGHT way to change context for CPU-consuming code in flow builder

fun main() = runBlocking<Unit> {
    simple().collect { value ->
        log("Collected $value") 
    } 
}            
```
## Flow exceptions

`Flow` collection can complete with an exception when an emitter or code inside the operators throw an exception. There are several ways to handle these exceptions.

### Collector try and catch 

```kotlin
fun simple(): Flow<Int> = flow {
    for (i in 1..3) {
        println("Emitting $i")
        emit(i) // emit next value
    }
}

fun main() = runBlocking<Unit> {
    try {
        simple().collect { value ->         
            println(value)
            check(value <= 1) { "Collected $value" }
        }
    } catch (e: Throwable) {
        println("Caught $e")
    } 
}            
```
Output
```bash
Emitting 1
1
Emitting 2
2
Caught java.lang.IllegalStateException: Collected 2
```
### Exception transparency

Flows must be transparent to exceptions and it is a violation of the exception transparency to emit values in the `flow { ... }` builder from inside of a `try/catch` block. 

This guarantees that a collector throwing an exception can always catch it using `try/catch` as in the previous example.

The emitter can use a `catch` operator that preserves this exception transparency and allows encapsulation of its exception handling
The body of the `catch` operator can analyze an exception and react to it in different ways depending on which exception was caught:

- Exceptions can be rethrown using `throw`.
- Exceptions can be turned into emission of values using `emit` from the body of `catch`.
- Exceptions can be ignored, logged, or processed by some other code.

```kotlin
simple()
    .catch { e -> emit("Caught $e") } // emit on exception
    .collect { value -> println(value) }
```


> [!CAUTION]
> The `catch` intermediate operator, honoring exception transparency, catches only upstream exceptions (that is an exception from all the operators above catch, but not below it). 
> If the block in `collect { ... }` (placed below catch) throws an exception then it escapes.

