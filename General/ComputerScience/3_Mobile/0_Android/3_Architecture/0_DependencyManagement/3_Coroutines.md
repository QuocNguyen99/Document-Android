# Coroutines in Android

By default, all Android app components use the Main thread of execution.
We should off-load expensive calculations to background threads to avoid blocking UI

Apart from asynchronous computations, Kotlin **coroutines** also provide scoping and cancellation propagation, 
making it easier to stop all the tasks needed by an `Activity`, `Fragment`, or `ViewModel` which is being destroyed.

## Dispatchers


with the help of **dispatchers** we can define the kind of threads on which the calculations will be performed.


Let's revisit the built-in coroutine dispatchers:

- Default
- IO
- Unconfined

> [!CAUTION]
> File and network IO should never contend for the same thread pool. In your application code, it's better to separate different types of IO. For example: val FileIO = Dispatchers.IO.limitedParallelism(3)


With the integration of coroutines in Android came another dispatcher: `Dispatchers.Main`

It is designed to run coroutines on the main (UI) thread of an Android application. Coroutines launched using `Dispatchers.Main` can update the user interface, process user input, or perform other UI-related tasks

> [!NOTE]
> Under the hood, Dispatchers.Main is implemented using Android Looper and Handler machinery.

## Lifecycle scope

`Activity.lifecycleScope` and `Fragment.lifecycleScope` are coroutine scopes that bound to the lifecycle of an Activity or Fragment.

This means that any coroutine launched in this scope will automatically be canceled when the Activity or Fragment is destroyed.

Similarly, `ViewModel.viewModelScope` is a scope which will be automatically destroyed when `ViewModel.onCleared` is called.

## State change hooks

The `repeatOnLifecycle` method is used to perform an action repeatedly while the lifecycle reaches a certain `State`, and cancel once the lifecycle leaves that `State`.

This is useful, for instance, for subscribing to some data source when the UI is visible to the user and dropping the subscription when the user leaves.

```kotlin
lifecycleScope.launch {
    viewLifecycleOwner.repeatOnLifecycle(Lifecycle.State.STARTED) {
        viewModel.someData.collect { value ->
            updateUi(value)
        }
    }
}
```

Before `repeatOnLifecycle` arrived, there were separate `launchWhenCreated`, `launchWhenStarted`, `launchWhenResumed` methods.
Now they are deprecated, so if you come across them in some old code, just replace them with `repeatOnLifecycle(appropriate state)`.












