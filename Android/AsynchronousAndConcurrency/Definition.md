# General fact

In Android, the system creates the main thread (so-called UI thread) that handles all of the UI-relevant work for your application. The main thread is responsible for rendering the UI elements, dispatching events to the appropriate user interface, and all interactions between components from the Android UI toolkit.

So if you want to perform I/O or expensive computational work, such as network requests and querying the database, you should instead handle them in another thread (so-called worker thread). This ensures that the main thread is dedicated to rendering screens and handling interactions from users.

That all said, writing a heavily multithreaded program is difficult to maintain and debug, there are also other considerations such as avoiding race conditions and managing resources. Luckily there are solutions to execute computationally heavy business work without blocking the main thread, and they make it possible not to need to handle each thread manually one by one.


## RxJava/RxKotlin

One of the advantages of using RxJava is that it allows you to easily control multi-threading problems, such as executing business logic in a background thread and getting results back in the UI thread.

RxJava provides a thread pool called Schedulers, and the thread pool contains the following different kind of threads: io, computation, single, or you can create a completely new thread.

You can manipulate threading behaviors by specifying Schedulers with SubscribeOn and ObserveOn operators that define which thread should work and which thread should consume the result.

## Coroutines

[Coroutines](./Coroutine.md) is a great concurrency solution that executes code asynchronously at the language level.

Unlike threads, coroutines is purely a user-level language abstraction, so it’s not directly tied to the OS resources and each coroutines object is allocated in the JVM heap. **That means coroutines are controllable by the user side, consume much lighter resources, and have lower cost switching contexts expenses than threads.**

According to the Android docs, coroutines are lightweight, so you can run many coroutines on a single thread and cause fewer memory leaks because they work based on scope. Google also supports many Jetpack libraries integrations and compatibilities, such as ViewModelScope and LifecycleScope, you gain many advantages if you choose coroutines as a concurrency solution.