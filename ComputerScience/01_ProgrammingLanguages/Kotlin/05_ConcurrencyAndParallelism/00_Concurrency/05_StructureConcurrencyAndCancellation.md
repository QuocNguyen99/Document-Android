# Structured Concurrency & Cancellation

If many operations run asynchronously, how do we know when they all finish, or, more important, how do we know if they fail?

If we start downloading a bunch of images for a gallery app but the authentication fails or the user decides to see another screen, what will happen with all the massive loading in the background ?

Well, **we can actually control that in a nice way with structured concurrency.**

## Scopes

Coroutines offer scopes to define the restrictions for running operations.

Example :

- Loading images for one screen should be done in one scope
- An application as a whole may define its own scope

As you can see, scopes can and often should be nested, which includes both.


## Stopping scoped jobs

#### `GlobalScope`

- Since we use `GlobalScope`, the launched coroutines will continue running until they finish or the entire application stops.

- An error in the main function does not affect the running coroutines.

#### `coroutineScope`

- When using `coroutineScope`, if an error occurs, all coroutines within the scope will be canceled.


> [!NOTE]
> Remember that cancellation of coroutines is cooperative: they get canceled only if they actively check for cancellation or if they run suspending functions, so the compiler will do the check for us.


## Manual cancellation

With an access to the `context`, we can now have even more control.
It offers two methods to cancel work:
- `cancel()` → Cancels the entire coroutine scope, stopping everything inside it.
- `cancelChildren()` → Cancels only the child coroutines, allowing the parent coroutine to continue.

## Failures in children


What about the situation when one of the children fails with an exception but we need them all to finish to do the job?

For example, if we are downloading different chunks of a large file in parallel. The scope will cancel all the work, the same way it did before. All exceptions from children are propagated up to the parent. 

```kotlin
suspend fun loadImage(name: String) {
    if (name.endsWith("2")) {
        throw Exception("Error loading image")
    }
    delay(50) // imitate long-running operation
    println("Loaded $name")
}

// ... the rest is the same

suspend fun loadScreenInOwnScope(): Unit = coroutineScope {
    launch { loadImage("image_1") }
    launch { loadImage("image_2") }
    launch { preCache("image_3") }
}
```
There is no more explicit cancellation, but the second loading operation fails.

This code will also print nothing because the parent job will cancel loading of image 1 and caching image 3 immediately.

That's what we want, except that we do not want to cancel everything when pre-caching fails, as it is an optional operation. How can we tell the scope to treat it differently?

## Supervised jobs

To control **the cancellation policy**, we need to change the type of the job of our root function and make it supervised. Each coroutine is represented by a job object. 
That's what the launch coroutine builder returns, and that's what actually gets canceled under the hood when we call `CoroutineScope.cancel`

A regular job class propagates errors both down- and up-stream in the hierarchy to cancel both children and parents.

If we change it to the `SupervisorJob`, we'll say that **now we are going to control cancellation manually.**

An error from a child job won't affect the parent anymore and consequentially won't cancel other children of that parent,
while still canceling everything under the failed child.

```kotlin
suspend fun loadScreenInSupervisedScope() = supervisorScope {
    val job1 = launch { loadImage("image_1") }
    val job2 = launch { loadImage("image_2") }
    val job3 = launch { throw Exception("Fail optional job") }
}
```

`supervisorScope` is another scope builder, it adds `SupervisorJob` instead of a regular `Job` to the context under the hood, and now failure in `job3` won't affect `job1` and `job2` anymore (we can also manually create a scope like that for the later use with `CoroutineScope(SupervisorJob())` call).

## Execution status

Job interface has a lot of handy properties to **check** the current status of execution, **start** it if it's not running yet, or **cancel** it when it's not needed anymore.
It also allows **waiting** for a job to finish: `job1.join()` will suspend until `job1` completes.

So we can wait for tasks as follows:

```kotlin
job1.join()
job2.join()
```

This code will first wait for `job1`, then for `job2`; if we want to wait for all jobs regardless of their order, there is a handy helper `joinAll`:

```kotlin
joinAll(job1, job2)
```





