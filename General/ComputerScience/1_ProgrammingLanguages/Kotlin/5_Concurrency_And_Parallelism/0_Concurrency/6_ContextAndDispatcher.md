# Сontext and Dispatchers

## Context

The `CoroutineScope` interface has only one property – `coroutineContext`, which contains all the information the coroutine needs for execution.

It's similar to a **map or dictionary** — all the values are stored there along with their keys. If we take our previous example with a supervised scope, we can see what's inside the context.


```kotlin
fun main() {
    val supervisedScope = CoroutineScope(SupervisorJob())

    println(supervisedScope)
}
```


It will print something like `CoroutineScope(coroutineContext=SupervisorJobImpl{Active}@4534b60d)`

In our case, the context contains only one value — the job, which we can access using the `Job` interface's companion Key like that:

`supervisedScope.coroutineContext[Job]`. We can add more things to the context – for example, an error handler:

```kotlin
val handler = CoroutineExceptionHandler { _, exception ->
    println("Caught ${exception.message}")
}

fun main() {
    val supervisedScope = CoroutineScope(SupervisorJob() + handler)

    println(supervisedScope)
}
```

The output will look like this: `CoroutineScope(coroutineContext=[SupervisorJobImpl{Active}@7e32c033, MainKt$special$$inlined$CoroutineExceptionHandler$1@7ab2bfe1])`. Now we have two elements in the context.


But what's the handler and what else can we put there?

## Jobs, ExceptionHandlers, Dispatchers

**The most important elements we can add to the context** are `Job`, `ExceptionHandler`, `Dispatcher`and the others else (`CoroutineName`...).

- **Job** represents the work itself, including the hierarchy of children jobs. It has a state (Active/Completed/Cancelled) and defines how a failure or cancellation propagates to parent and children jobs.

- **ExceptionHandler** handles uncaught exceptions in a coroutine or its children. **It can be very helpful for logging, but note that it doesn't provide a way to catch the exception**, so it cannot be used to recover from failures – we have `try/catch` for that. Also, it has to be installed on the root coroutine only, because children automatically propagate uncaught errors to the parent all the way up to the root.

- **Dispatcher** defines which thread or threads will be used to run the coroutine code.

### Important

- It's important to note that even though we can add multiple jobs, handlers, or dispatchers to the coroutine builder, **a coroutine can only have one element of each type, so the last one always overrides all previous**. For example, `CoroutineScope(SupervisorJob() + handler1 + handler2)` will use `handler2`.

- **Another important fact is that if we don't provide an element of each type, the default one will be used.** There is a default error handler and a default dispatcher for each platform. as for the job, if it's not provided, a new one will be created for us. There can't be a single default job, because each one represents its own coroutine.

## More about Dispatchers

Dispatcher is just an interface and we can implement our own, if needed.

In fact, most platforms (like JS, JVM/Android, Native), have their own specific dispatchers in addition to the three standard ones available everywhere.

- `Dispatchers.Default` – as the name implies, this dispatcher will be used if none is specified explicitly. **It schedules coroutine execution in a background thread from a shared thread pool**. It's a good choice for all types of computations that consume CPU.
- `Dispatchers.IO` – it uses another shared thread pool and is designed to handle I/O load with a lot of operations that can block on waiting for data. Use it for disk read/write and network requests.
- `Dispatchers.Unconfined` — it starts execution of a coroutine in the current thread and runs until the first suspension; after that, it resumes in a different suitable thread. Normally, this dispatcher **should not be used**.


In case we need to use our own pool of one or multiple threads, there are helper functions `newSingleThreadContext()` and `newFixedThreadPoolContext()`, which take care of creating a thread pool, and the dispatcher that uses it for execution.
**They may be handy if we need to run a fixed number of long-running background jobs.**

However, to simply limit the number of parallel threads allowed for execution, **coroutines v1.6** offer a better option — `limitedParallelism()`. 
This function can be applied to any multi-threaded dispatcher to guarantee that no more than N coroutines will run in parallel.

For instance, `Dispatchers.IO.limitedParallelism(2)` uses the same shared IO pool but allows to use two threads only.
For example, it can be useful if we are allowed to open only a limited number of DB connections. Any number of limited parallelism views can be created on top of the dispatcher.

## Context inheritance

When a coroutine is created, it inherits most parts of its parent’s context, except for the Job. This means:

- If nothing is explicitly overridden, the child coroutine will use the same `Dispatcher`, `CoroutineExceptionHandler`, etc., as the parent.

- If a child coroutine overrides the `Dispatcher`, the change will apply to itself and its own children only.

```kotlin
val handler = CoroutineExceptionHandler { _, exception ->
    println("Caught ${exception.message}")
}

fun main(): Unit = runBlocking(handler) {
    println("root              : ${this.coroutineContext}")
    launch { // uses context of the parent, creates a new job
        println("first             : ${this.coroutineContext}")

        launch { // still same context, another new job
            println("first->same       : ${this.coroutineContext}")
        }

        launch(Dispatchers.Default) { // overrides the dispatcher
            println("first->default    : ${this.coroutineContext}")

            launch(Dispatchers.IO) { // overrides the dispatcher once more
                println("first->default->IO: ${this.coroutineContext}")
            }
        }
    }
}
```

output:

```bash
root              : [MainKt$special$$inlined$CoroutineExceptionHandler$1@73a8dfcc, BlockingCoroutine{Active}@1c655221, BlockingEventLoop@58d25a40]
first             : [MainKt$special$$inlined$CoroutineExceptionHandler$1@73a8dfcc, StandaloneCoroutine{Active}@626b2d4a, BlockingEventLoop@58d25a40]
first->same       : [MainKt$special$$inlined$CoroutineExceptionHandler$1@73a8dfcc, StandaloneCoroutine{Active}@14899482, BlockingEventLoop@58d25a40]
first->default    : [MainKt$special$$inlined$CoroutineExceptionHandler$1@73a8dfcc, StandaloneCoroutine{Active}@1c1817d6, Dispatchers.Default]
first->default->IO: [MainKt$special$$inlined$CoroutineExceptionHandler$1@73a8dfcc, StandaloneCoroutine{Active}@6809a6a3, Dispatchers.IO]
```

1. The `CoroutineExceptionHandler` to handle errors. It is assigned to runBlocking, meaning the root coroutine can handle exceptions, and its children will inherit this behavior.
2. `runBlocking` acts as the root coroutine and contains the `handler`.
3. Creating the first child coroutine: This coroutine inherits the entire **context** of `runBlocking`, including `handler` and `BlockingEventLoop`.
4. However, it creates a new `Job`, since each launch always starts with a separate `Job`.
5. Creating a nested coroutine inside first: Inherits the entire context of `first`, including `handler` and `BlockingEventLoop`. Still gets a separate `Job`.
6. Overriding the `Dispatcher` to `Default`: Still inherits `handler`, but changes the Dispatcher from `BlockingEventLoop` to `Dispatchers.Default`.
7. Further overriding the Dispatcher to `IO`: Still inherits `handler`, but changes the Dispatcher from `Default` to `IO`.

## Context switching

The example above shows how to run multiple concurrent jobs in different contexts, but in real life we often need something much simpler.


For example, consider a UI application that needs to load some data from disk to be displayed, which can take some time and therefore can not be executed in the main thread without freezing the UI.

Kotlin offers a solution for that problem. It's called `withContext`. As the name implies, it executes a block of code with a new context.
As shown before, it inherits the context and, if the dispatcher is specified, switches the execution to a new thread. **But now the execution order is sequential.**
























