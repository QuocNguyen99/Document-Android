# Asynchronous programming techniques & problems

## Callbacks


A solution is to let one function call another function back when it's done. We pass the continuation function to the first one as an argument. This argument is called a callback.

```kotlin
fun sendData() {
    /** first call inside `sendData` is the same,
     it executes `prepareRequest` immediately **/
    prepareRequest { data ->
        /** code inside this lambda by convention will be executed 
        by `prepareRequest` when it's done **/
        submitRequest(data) { result ->
            /** another lambda is nested inside `submitRequest` 
            and will be called when it's done **/
            processResult(result)
        }
    }
}
```

Note that this fairly simple code is already deeply nested and we don't even have error handling in place.

In real life, this tends to grow out of control pretty fast. 

We can pass callback functions as parameters (callback lambdas are just parameters)

```kotlin
fun sendData() {
    prepareRequest { data ->
        /** `processResult` callback can be passed directly if the input arguments match,
         but we can't pass `submitRequest` the same way to `prepareRequest` 
         because it doesn't know which callback `submitRequest` should call when done;
         only the root function `sendData` knows that  **/
        submitRequest(::processResult)
    }
}
```

but that obscures the logic of the code and also becomes messy when more than one operation is performed.

## Futures and Reactive extensions

There are multiple libraries and SDKs that do just that with so-called [Futures/Promises](https://en.wikipedia.org/wiki/Futures_and_promises) 

A typical promise code would look like that:


```js
fun sendData() {
    prepareRequest()
        .thenCompose { data ->  // this line means "execute this lambda" when done without errors
            submitRequest(data)
        }
        .thenAccept { result -> // this is similar but also means it's the final operation
            processResult(result)
        }
}
```

Now `submitRequest` and `processResult` are on the same level again (even if we still have an extra nesting), but we can now add more then steps in between without going deeper.

It looks nicer, but it has its own problems:
errors are still not easy to handle and traditional if/else and loops are not supported out of the box.

[Reactive Extensions](https://en.wikipedia.org/wiki/ReactiveX) such as 
RX libraries (RxJava, RxJS) partially solve that last problem by treating each result as a stream of values and providing
a rich set of helper functions (called operators) to work with that stream, but that adds even more complexity.

## Coroutines and Suspending functions

Here is where coroutines come into play.
**A coroutine** may be thought of as a lightweight thread that performs **suspendable** computations.
It means the function can suspend its execution on some blocking operation and resume later when the operation is done, just like with callbacks.

```kotlin
suspend fun sendData() {
    val data = prepareRequest() // suspending function
    val result = submitRequest(data) // also suspending function
    processResult(result)
}
```

> [!CAUTION]
> Only suspending functions can call other suspending functions.

Moreover, this solution doesn't depend on any 3rd party library or even the platform anymore (it will work even with JS backend, which doesn't have threads),
and the paradigm is very similar to the well-known **goroutines** (Go) or **async/await** (C# and others).

## Conclusion

Coroutines provide a way to perform async operations without changing the familiar imperative paradigm.
The code stays readable, while the lightweight nature of coroutines allows us to start thousands of them when we need to without worrying about memory consumption.




























