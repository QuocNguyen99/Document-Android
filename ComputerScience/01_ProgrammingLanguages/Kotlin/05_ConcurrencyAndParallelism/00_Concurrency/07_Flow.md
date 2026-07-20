# Asynchronous Flow
While suspending functions return a single value asynchronously, Kotlin Flows allow returning multiple asynchronously computed values.

## Flow basics and feature

A `Sequence<Int>` handles synchronously computed values:

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

For asynchronous streams, use `Flow<Int>`:

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

Key points:

- Use `flow { }` builder to create flows
- Code inside flow builders can suspend
- No `suspend` modifier on the function itself
- Values are **emitted** with `emit()` function
- Values are **collected** with `collect()` function

### Flows are cold
Flows are cold streams - code inside a flow builder only runs when collected:

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

Output:

```kotlin
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
The `simple()` function returns quickly without waiting. Flow execution starts fresh each time it's collected.

### Collecting from a flow

As `collect` is a suspend function, it needs to be executed within a coroutine.
It takes a lambda as a parameter that is called on every new value.

> [!CAUTION]
> Since it's a suspend function, the coroutine that calls collect may suspend until the flow is closed.

If you want to collect the multiple value from the several flow, you need to create  new coroutine from the current one.

```kotlin
fun main() = runBlocking {
    val flowA = flow {
        repeat(3) {
            emit("A$it")
            delay(400)
        }
    }
    val flowB = flow {
        repeat(3) {
            emit("B$it")
            delay(700)
        }
    }

    val jobA = launch {
        flowA.collect { println("From A: $it") }
    }
    val jobB = launch {
        flowB.collect { println("From B: $it") }
    }

    joinAll(jobA, jobB)
}
```

### Flow cancellation basics
Flows honor coroutine cancellation when suspended in cancellable functions like `delay`:

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

```bash
Emitting 1
1
Emitting 2
2
Done
```

For busy loops, use the `cancellable()` operator:

```kotlin
fun main() = runBlocking<Unit> {
    (1..5).asFlow().cancellable().collect { value -> 
        if (value == 3) cancel()  
        println(value)
    } 
}
```

> [!NOTE] 
> Most flow operators don't perform additional cancellation checks for performance reasons.

## Flow builders

Besides `flow { }`, you can use:

- `flowOf` builder to emit fixed values
- `.asFlow()` extension function to convert **collections and sequences** to flows

### callbackFlow

`callbackFlow` is a flow builder that **lets you convert callback-based APIs into flows**.

When you want to wrap an external listener, broadcast receiver, or any async API that uses callbacks, not suspending functions.

```kotlin
interface MyListener {
    fun onEvent(value: Int)
}

fun myListenerFlow(): Flow<Int> = callbackFlow {
    val listener = object : MyListener {
        override fun onEvent(value: Int) {
            trySend(value) // emit to flow
        }
    }
    // Simulate registering the listener
    registerListener(listener)
    // Remove listener when the flow is cancelled
    awaitClose { unregisterListener(listener) }
}

// --- Mock implementation for demo purposes ---
fun registerListener(listener: MyListener) {
    // Simulate callback events from another thread
    GlobalScope.launch {
        delay(100)
        listener.onEvent(1)
        delay(100)
        listener.onEvent(2)
    }
}
fun unregisterListener(listener: MyListener) { /* cleanup if needed */ }

// --- Usage ---
fun main() = runBlocking {
    myListenerFlow().collect { println("Flow received: $it") }
}
```

> [!NOTE]
> Unlike the `flow` builder, `callbackFlow` allows values to be emitted from a different `CoroutineContext` with the `send` function or outside a coroutine with the `trySend` function.Because internally, callbackFlow uses a channel

## Intermediate flow operators

Intermediaries can use intermediate operators to modify the stream of data without consuming the values. 

### Map operator

Flow operators transform one flow into another:

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


Important difference: operator blocks can call suspending functions.

### Transform operator
`transform` allowing emit multiple response value for each input value:

```kotlin
(1..3).asFlow() // a flow of requests
    .transform { request ->
        emit("Making request $request") 
        emit(performRequest(request)) 
    }
    .collect { response -> println(response) }
```

### Size-limiting operators
Operators like `take` cancel flow execution when limits are reached:

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
Output:
```bash
1
2
Finally in numbers
```
## Terminal flow operators
Terminal operators are suspending functions that start flow collection:

- `collect` - basic collection
- `toList`, `toSet` - conversion to collections
- `first`, `single` - get specific values
- `reduce`, `fold` - reduce to a single value

## Flows are Sequential
Flow processing happens sequentially from upstream to downstream:

> [!NOTE]
> - **upstream flow**, is a meaning the producer and any intermediate operators applied before or above operator
> - **downstream flow**, the intermediate operators after current consideration operator along with the consumer

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
Output:
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
Flows always run in the context of the collecting coroutine:

```kotlin
withContext(context) {
    simple().collect { value ->
        println(value) // This runs in 'context'
    }
}
```
This is called **context preservation**.


> [!CAUTION] 
> You cannot emit from a different context in flow builders:

```kotlin
// WRONG - emitting from different context
flow {
    withContext(Dispatchers.Default) {
        emit(value) // Will throw IllegalStateException
    }
}
```
### flowOn operator
To change the `CoroutineContext` of a flow, flowOn changes the `CoroutineContext` of the upstream flow

The downstream flow is not affected and executes on the `CoroutineContext` used to `collect` from the flow.

```kotlin
class NewsRepository(
    private val newsRemoteDataSource: NewsRemoteDataSource,
    private val userData: UserData,
    private val defaultDispatcher: CoroutineDispatcher
) {
    val favoriteLatestNews: Flow<List<ArticleHeadline>> =
        newsRemoteDataSource.latestNews
            .map { news -> // Executes on the default dispatcher
                news.filter { userData.isFavoriteTopic(it) }
            }
            .onEach { news -> // Executes on the default dispatcher
                saveInCache(news)
            }
            // flowOn affects the upstream flow ↑
            .flowOn(defaultDispatcher)
            // the downstream flow ↓ is not affected
            .catch { exception -> // Executes in the consumer's context
                emit(lastCachedNews())
            }
}
```

With this code, the `onEach` and `map` operators use the `defaultDispatcher`, whereas the `catch` operator and the consumer are executed on `Dispatchers.Main` used by `viewModelScope`.


> [!NOTE]
> If there are multiple `flowOn` operators, each one changes the upstream from its current location.


As the data source layer is doing I/O work, you should use a dispatcher that is optimized for I/O operations:

```kotlin
class NewsRemoteDataSource(
    ...,
    private val ioDispatcher: CoroutineDispatcher
) {
    val latestNews: Flow<List<ArticleHeadline>> = flow {
        // Executes on the IO dispatcher
        ...
    }
        .flowOn(ioDispatcher)
}
```

### `buffer()`

The emitter doesn’t have to wait for the collector to finish before emitting the next value.


```kotlin
fun main() = runBlocking {
    println("=== buffer() ===")
    val time = measureTimeMillis {
        slowFlowEmit100ms()
            .onEach { log("Emitted $it") }
            .buffer() // do not blocked by collector
            .collect { value ->
                log("Collecting $value ...")
                delay(300)
                log("Done   $value")
            }
    }
    println("Total time ~ ${time}ms\n")
}
fun slowFlowEmit100ms(): Flow<Int> = flow {
    repeat(3) { i ->
        delay(100) // slow-ish emitter
        emit(i + 1)
    }
}
```

### `conflate()`

Skip intermediate values, keep the latest

```kotlin
fun main() = runBlocking {
    println("=== conflate() ===")
    val time = measureTimeMillis {
        fastFlow()
            .onEach { log("Emitted $it") }
            .conflate()
            .collect { value ->
                log("Collecting $value ...")
                delay(300)
                log("Done   $value")
            }
    }
    println("Total time ~ ${time}ms\n")
}

fun fastFlow(): Flow<Int> = flow {
    // Emit quickly (no delay here to exaggerate the effect)
    emit(1)
    emit(2)
    emit(3)
}
```

Output :

```bash
Emitted 1
Emitted 2
Emitted 3
Collecting 1 ... (300ms)
Done 1
Collecting 3 ... (300ms)
Done 3
```

### collectLatest

Cancel previous work when a new value arrives

```kotlin
fun main() = runBlocking {
    println("=== collectLatest ===")
    val time = measureTimeMillis {
        fastFlow()
            .onEach { log("Emitted $it") }
            .collectLatest { value ->
                log("Start   $value")
                try {
                    delay(300) // long work
                    log("Finish  $value")
                } finally {
                    // This runs when the block is cancelled by a newer value
                    log("Cancel  $value (if not finished)")
                }
            }
    }
    println("Total time ~ ${time}ms\n")
}
```

```bash
Emitted 1
Start 1
Emitted 2
Cancel 1 (if not finished)
Start 2
Emitted 3
Cancel 2 (if not finished)
Start 3
Finish 3
```

## Composition and Flattening 

### zip


Combines two flows into one by pairing values in order: 
(A1 with B1), (A2 with B2), etc.
If either flow is slower, zip waits for both to be ready.

```kotlin

fun main() = runBlocking {
    println("=== zip ===")
    val numbers = flowOf(1, 2, 3).onEach { delay(100) }  // emit every 100ms
    val words = flowOf("one", "two", "three").onEach { delay(200) } // emit every 200ms

    numbers.zip(words) { number, word -> "$number:$word" }
        .collect { println(it) }
}
```

Output:

```bash
1:one
2:two
3:three
```

### combine

Latest Combination

Whenever either flow emits, combine with the latest value from the other.
Emits right away when any source updates.

```kotlin
fun main() = runBlocking {
    println("=== combine ===")
    val a = flowOf(1, 2, 3).onEach { delay(300) }
    val b = flowOf("one", "two", "three").onEach { delay(400) }

    a.combine(b) { num, word -> "$num + $word" }
        .collect { println(it) }
}
```

### flatMapConcat

Sequential Flattening, Each request waits for the previous one to finish.

```kotlin
fun main() = runBlocking {
    println("=== flatMapConcat ===")
    flowOf("A", "B", "C")
        .flatMapConcat { item ->
            flow {
                println("Start job $item")
                delay(500)
                emit("Done $item")
            }
        }
        .collect { println(it) }
}
```

Output:

```bash
Start job A
Done A
Start job B
Done B
Start job C
Done C
```

### flatMapMerge

Parallel Flattening, All requests are started at the same time, and results appear as soon as each finishes.

```kotlin
fun main() = runBlocking {
    println("=== flatMapMerge ===")
    flowOf("A", "B", "C")
        .flatMapMerge { item ->
            flow {
                println("Start job $item")
                delay(500)
                emit("Done $item")
            }
        }
        .collect { println(it) }
}
```

Output:

```bash
Start job A
Start job B
Start job C
Done A
Done B
Done C
```

## Flow exceptions

Wrap your collect call in a try/catch block. If any error occurs during emission or collection, it will be caught, and the Flow is immediately cancelled.

```kotlin
val flow = flow {
    emit("A")
    emit("B")
    emit("Error") // Giả sử giá trị này gây lỗi
    emit("C")
}

try {
    flow.collect { value ->
        println("Collecting $value")
        if (value == "Error") throw IllegalStateException("Unexpected value: $value")
    }
} catch (e: Throwable) {
    println("Caught error: ${e.message}")
}
```
Output:
```bash
Collecting A
Collecting B
Collecting Error
Caught error: Unexpected value: Error
```

### Exception transparency
Flows must be transparent to exceptions. Don't emit values from `try/catch` blocks in flow builders.

Use the `catch` operator to preserve exception transparency (continue to emit the others value instead of cancel):

```kotlin
simple()
    .catch { e -> emit("Caught $e") } // emit on exception
    .collect { value -> println(value) }
```

> [!CAUTION] 
> The `catch` operator only catches upstream exceptions (from operators above it). Exceptions from `collect` or operators below `catch` will still escape.


### onCompletion operator

Use `.onCompletion { }` to run logic when the flow completes—successfully or with an exception. 
You can check if the cause is not null to distinguish exceptional completion.

## Launching Flow

### launchIn

operator starts collecting the Flow in a new coroutine, without blocking the current one

```kotlin
fun main() = runBlocking {
    val eventsFlow = flow {
        repeat(3) {
            emit("Event #$it")
            delay(500)
        }
    }

    eventsFlow
        .onEach { println(it) }
        .launchIn(this) // collect at current coroutine, non-blocking

    println("Done!")

    delay(2000) // wait for event
}
```