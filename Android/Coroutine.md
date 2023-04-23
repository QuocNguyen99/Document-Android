# Coroutine

        A _coroutine_ is a concurrency design pattern that you can use on Android to simplify code that executes asynchronously.

Trên Android, coroutine giúp quản lý các tác vụ chạy dài có thể chặn main thread và khiến ứng dụng của bạn không phản hồi

## Features

Coroutines is our recommended solution for asynchronous programming on Android. Noteworthy features include the following:

* **Lightweight**: You can run many coroutines on a single thread due to support for suspension , which doesn't block the thread where the coroutine is running. Suspending saves memory over blocking while supporting many concurrent operations.
* **Fewer memory leaks**: Use [_structured concurrency_](https://kotlinlang.org/docs/reference/coroutines/basics.html#structured-concurrency) to run operations within a scope.
* **Built-in cancellation support**: [Cancellation](https://kotlinlang.org/docs/reference/coroutines/cancellation-and-timeouts.html) is propagated automatically through the running coroutine hierarchy.
* **Jetpack integration**: Many Jetpack libraries include [extensions](https://developer.android.com/kotlin/ktx) that provide full coroutines support. Some libraries also provide their own [coroutine scope](https://developer.android.com/topic/libraries/architecture/coroutines) that you can use for structured concurrency.

## Executing in a background thread

    Making a network request on the main thread causes it to wait, or _block_, until it receives a response. Since the thread is blocked, the OS isn't able to call `onDraw()`, which causes your app to freeze and potentially leads to an Application Not Responding (ANR) dialog. For a better user experience, let's run this operation on a background thread.

First, let's take a look at our `Repository` class and see how it's making the network request:

```kotlin
sealed class Result<out R> {
    data class Success<out T>(val data: T) : Result<T>()
    data class Error(val exception: Exception) : Result<Nothing>()
}

class LoginRepository(private val responseParser: LoginResponseParser) {
    private const val loginUrl = "https://example.com/login"

    // Function that makes the network request, blocking the current thread
    fun makeLoginRequest(
        jsonBody: String
    ): Result<LoginResponse> {
        val url = URL(loginUrl)
        (url.openConnection() as? HttpURLConnection)?.run {
            requestMethod = "POST"
            setRequestProperty("Content-Type", "application/json; utf-8")
            setRequestProperty("Accept", "application/json")
            doOutput = true
            outputStream.write(jsonBody.toByteArray())
            return Result.Success(responseParser.parse(inputStream))
        }
        return Result.Error(Exception("Cannot open HttpURLConnection"))
    }
}
```

`makeLoginRequest` is synchronous and blocks the calling thread. To model the response of the network request, we have our own `Result` class.

The `ViewModel` triggers the network request when the user clicks, for example, on a button:

```kotlin
class LoginViewModel(
    private val loginRepository: LoginRepository
): ViewModel() {

    fun login(username: String, token: String) {
        val jsonBody = "{ username: \"$username\", token: \"$token\"}"
        loginRepository.makeLoginRequest(jsonBody)
    }
}
```

**With the previous code, `LoginViewModel` is blocking the UI thread when making the network request.** The simplest solution to move the execution off the main thread is to create a new coroutine and execute the network request on an I/O thread:

```kotlin
class LoginViewModel(
    private val loginRepository: LoginRepository
): ViewModel() {

    fun login(username: String, token: String) {
        // Create a new coroutine to move the execution off the UI thread
        viewModelScope.launch(Dispatchers.IO) {
            val jsonBody = "{ username: \"$username\", token: \"$token\"}"
            loginRepository.makeLoginRequest(jsonBody)
        }
    }
}
```

Let's dissect the coroutines code in the `login` function:

* `viewModelScope` is a predefined `CoroutineScope` that is included with the `ViewModel` KTX extensions. Note that all coroutines must run in a scope. A `CoroutineScope` manages one or more related coroutines.
* `launch` is a function that creates a coroutine and dispatches the execution of its function body to the corresponding dispatcher.
* `Dispatchers.IO` indicates that this coroutine should be executed on a thread reserved for I/O operations.

The `login` function is executed as follows:

* The app calls the `login` function from the `View` layer on the main thread.
* `launch` creates a new coroutine, and the network request is made independently on a thread reserved for I/O operations.
* While the coroutine is running, the `login` function continues execution and returns, possibly before the network request is finished. Note that for simplicity, the network response is ignored for now.

Since this coroutine is started with `viewModelScope`, it is executed in the scope of the `ViewModel`. If the `ViewModel` is destroyed because the user is navigating away from the screen, `viewModelScope` is automatically cancelled, and all running coroutines are canceled as well.

## Use coroutines for main-safety

### Problem and solution

        We consider a function _main-safe_ when it doesn't block UI updates on the main thread. The `makeLoginRequest` function is not main-safe, as calling `makeLoginRequest` from the main thread does block the UI. Use the `withContext()` function from the coroutines library to move the execution of a coroutine to a different thread:

```kotlin
class LoginRepository(...) {
    ...
    suspend fun makeLoginRequest(
        jsonBody: String
    ): Result<LoginResponse> {

        // Move the execution of the coroutine to the I/O dispatcher
        return withContext(Dispatchers.IO) {
            // Blocking network request code
        }
    }
}
```

`withContext(Dispatchers.IO)` moves the execution of the coroutine to an I/O thread, making our calling function main-safe and enabling the UI to update as needed.

`makeLoginRequest` is also marked with the `suspend` keyword. This keyword is Kotlin's way to enforce a function to be called from within a coroutine.



In the following example, the coroutine is created in the `LoginViewModel`. As `makeLoginRequest` moves the execution off the main thread, the coroutine in the `login` function can be now executed in the main thread:

```kotlin
class LoginViewModel(
    private val loginRepository: LoginRepository
): ViewModel() {

    fun login(username: String, token: String) {

        // Create a new coroutine on the UI thread
        viewModelScope.launch {
            val jsonBody = "{ username: \"$username\", token: \"$token\"}"

            // Make the network call and suspend execution until it finishes
            val result = loginRepository.makeLoginRequest(jsonBody)

            // Display result of the network request to the user
            when (result) {
                is Result.Success<LoginResponse> -> // Happy path
                else -> // Show error in UI
            }
        }
    }
}
```

Note that the coroutine is still needed here, since `makeLoginRequest` is a `suspend` function, and all `suspend` functions must be executed in a coroutine.

This code differs from the previous `login` example in a couple of ways:

* **`launch` doesn't take a `Dispatchers.IO` parameter. When you don't pass a `Dispatcher` to `launch`, any coroutines launched from `viewModelScope` run in the main thread.**
* The result of the network request is now handled to display the success or failure UI.

The login function now executes as follows:

* The app calls the `login()` function from the `View` layer on the main thread.
* `launch` creates a new coroutine on the main thread, and the coroutine begins execution.
* Within the coroutine, the call to `loginRepository.makeLoginRequest()` now _suspends_ further execution of the coroutine until the `withContext` block in `makeLoginRequest()` finishes running.
* Once the `withContext` block finishes, the coroutine in `login()` resumes execution _on the main thread_ with the result of the network request.

# Definition section main-safety

        Kotlin coroutines use _dispatchers_ to determine which threads are used for coroutine execution. To run code outside of the main thread, you can tell Kotlin coroutines to perform work on either the _Default_ or _IO_ dispatcher. In Kotlin, all coroutines must run in a dispatcher, even when they're running on the main thread. Coroutines can suspend themselves, and the dispatcher is responsible for resuming them.

To specify where the coroutines should run, Kotlin provides three dispatchers that you can use:

* **Dispatchers.Main** - Use this dispatcher to run a coroutine on the main Android thread. This should be used only for interacting with the UI and performing quick work. Examples include calling `suspend` functions, running Android UI framework operations, and updating [`LiveData`](https://developer.android.com/topic/libraries/architecture/livedata) objects.
* **Dispatchers.IO** - This dispatcher is optimized to perform disk or network I/O outside of the main thread. Examples include using the [Room component](https://developer.android.com/topic/libraries/architecture/room), reading from or writing to files, and running any network operations.
* **Dispatchers.Default** - This dispatcher is optimized to perform CPU-intensive work outside of the main thread. Example use cases include sorting a list and parsing JSON.



## Improve app performance with Kotlin coroutines

## Manage long-running tasks

Coroutines build upon regular functions by adding two operations to handle long-running tasks. In addition to `invoke` (or `call`) and `return`, coroutines add `suspend` and `resume`:

* `suspend` pauses the execution of the current coroutine, saving all local variables.
* `resume` continues execution of a suspended coroutine from the place where it was suspended.

You can call `suspend` functions only from other `suspend` functions or by using a coroutine builder such as `launch` to start a new coroutine.

The following example shows a simple coroutine implementation for a hypothetical long-running task:

```kotlin
suspend fun fetchDocs() {                             // Dispatchers.Main
    val result = get("https://developer.android.com") // Dispatchers.IO for `get`
    show(result)                                      // Dispatchers.Main
}

suspend fun get(url: String) = withContext(Dispatchers.IO) { /* ... */ }
```

In this example, `get()` still runs on the main thread, but it suspends the coroutine before it starts the network request. When the network request completes, `get` resumes the suspended coroutine instead of using a callback to notify the main thread.

       **Kotlin uses a _stack frame_ to manage which function is running along with any local variables. When suspending a coroutine, the current stack frame is copied and saved for later. When resuming, the stack frame is copied back from where it was saved, and the function starts running again.**

## Start a coroutine

You can start coroutines in one of two ways:

* [`launch`](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/launch.html) starts a new coroutine and doesn't return the result to the caller. Any work that is considered "fire and forget" can be started using `launch`.
* [`async`](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/async.html) starts a new coroutine and allows you to return a result with a suspend function called `await`.



!! **Warning:** `launch` and `async` handle exceptions differently. Since `async` expects an eventual call to `await`, it holds exceptions and rethrows them as part of the `await` call. This means if you use `async` to start a new coroutine from a regular function, you might silently drop an exception. These dropped exceptions won't appear in your crash metrics or be noted in logcat.



## Coroutines concepts

### CoroutineScope

    A [`CoroutineScope`](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-coroutine-scope/) keeps track of any coroutine it creates using `launch` or `async`. The ongoing work (i.e. the running coroutines) can be cancelled by calling `scope.cancel()` at any point in time. In Android, some KTX libraries provide their own `CoroutineScope` for certain lifecycle classes. For example, `ViewModel` has a [`viewModelScope`](https://developer.android.com/reference/kotlin/androidx/lifecycle/package-summary#(androidx.lifecycle.ViewModel).viewModelScope:kotlinx.coroutines.CoroutineScope), and `Lifecycle` has [`lifecycleScope`](https://developer.android.com/reference/kotlin/androidx/lifecycle/package-summary#lifecyclescope).however, a `CoroutineScope` doesn't run the coroutines. 

    If you need to create your own `CoroutineScope` to control the lifecycle of coroutines in a particular layer of your app, you can create one as follows :

```kotlin
class ExampleClass {

    // Job and Dispatcher are combined into a CoroutineContext which
    // will be discussed shortly
    val scope = CoroutineScope(Job() + Dispatchers.Main)

    fun exampleMethod() {
        // Starts a new coroutine within the scope
        scope.launch {
            // New coroutine that can call suspend functions
            fetchDocs()
        }
    }

    fun cleanUp() {
        // Cancel the scope to cancel ongoing coroutines work
        scope.cancel()
    }
}
```

A cancelled scope cannot create more coroutines. Therefore, you should manually call `scope.cancel()` only when the class that controls its lifecycle is being destroyed.

When using `viewModelScope`, the [`ViewModel`](https://developer.android.com/topic/libraries/architecture/viewmodel) class cancels the scope automatically for you in the ViewModel's `onCleared()` method.

## Job

    A [`Job`](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-job/index.html) is a handle to a coroutine. Each coroutine that you create with `launch` or `async` returns a `Job` instance that uniquely identifies the coroutine and manages its lifecycle. You can also pass a `Job` to a `CoroutineScope` to further manage its lifecycle, as shown in the following example:

```kotlin
class ExampleClass {
    ...
    fun exampleMethod() {
        // Handle to the coroutine, you can control its lifecycle
        val job = scope.launch {
            // New coroutine
        }

        if (...) {
            // Cancel the coroutine started above, this doesn't affect the scope
            // this coroutine was launched in
            job.cancel()
        }
    }
}
```

## Coroutine context

A [`CoroutineContext`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.coroutines/-coroutine-context/index.html) defines the behavior of a coroutine using the following set of elements:

* [`Job`](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-job/index.html): Controls the lifecycle of the coroutine.
* [`CoroutineDispatcher`](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-coroutine-dispatcher/index.html): Dispatches work to the appropriate thread.
* [`CoroutineName`](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-coroutine-name/index.html): The name of the coroutine, useful for debugging.
* [`CoroutineExceptionHandler`](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-coroutine-exception-handler/index.html): Handles uncaught exceptions.

## Difference between coroutine and workmanager

    The scope of both is different. WorkManager is to schedule deferrable (for any later time) or immediately. tasks asynchronously.

    As documentation says:

    The WorkManager API makes it easy to specify deferrable, asynchronous tasks and when they should run. These APIs let you create a task and hand it off to WorkManager to run immediately or at an appropriate time.

On the other hand, coroutines are designed to compute a given task only immediately and asynchronously.

Also Internally, coroutines and WorkManager work differently.  Work manager heavily depends on Android system components like Services, Alarm manager, etc to schedule the work whereas coroutines schedule the work on Worker Threads and also is a language feature unlike WorkManager (API). So it is safe to say that coroutines do not go beyond your application.



 WorkManager can even execute the given tasks when your application is not active. for example, background services.

- Use Kotlin `Coroutine` when a task needs to execute immediately and if the task will end when the user leaves a certain scope or finishes an interaction.

- Use `WorkManager` when a task needs to execute immediately and need continued processing, even if the user puts the application in the background or the device restarts.

- Use `AlarmManager` when a task that needs to be executed at an exact point in time.
  
  


