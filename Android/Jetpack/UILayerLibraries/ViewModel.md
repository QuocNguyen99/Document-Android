

# ViewModel

The `ViewModel` class is a [business logic or screen level state holder](https://developer.android.com/topic/architecture/ui-layer/stateholders). It exposes state to the UI and encapsulates related business logic. Its principal advantage is that it caches state and persists it through configuration changes. This means that your UI doesn’t have to fetch data again when navigating between activities, or following configuration changes, such as when rotating the screen.

## ViewModel benefits

ViewModel provides a convenient API for data persistence that resolves this issue.

The key benefits of the ViewModel class are essentially two:

* It allows you to persist UI state.
* It provides access to business logic.

### Persistence

ViewModel allows the survival through both the state that a ViewModel holds, and operations that a ViewModel trigger. This caching means that you don’t have to fetch data again through common configuration changes, such as a screen rotation.

#### Scope

When you instantiate a ViewModel, you pass it an object that implements the [`ViewModelStoreOwner`](https://developer.android.com/reference/kotlin/androidx/lifecycle/ViewModelStoreOwner) interface.

A range of classes are either direct or indirect subclasses of the `ViewModelStoreOwner` interface. The direct subclasses are [`ComponentActivity`](https://developer.android.com/reference/androidx/activity/ComponentActivity), [`Fragment`](https://developer.android.com/reference/androidx/fragment/app/Fragment), and [`NavBackStackEntry`](https://developer.android.com/reference/androidx/navigation/NavBackStackEntry). For a full list of indirect subclasses, see the [`ViewModelStoreOwner` reference](https://developer.android.com/reference/kotlin/androidx/lifecycle/ViewModelStoreOwner).

This may be a Navigation destination, Navigation graph, activity, fragment, or any other type that implements the interface. Your ViewModel is then scoped to the [Lifecycle](https://developer.android.com/reference/androidx/lifecycle/Lifecycle) of the `ViewModelStoreOwner`. **It remains in memory until its `ViewModelStoreOwner` goes away permanently.**

    Khi một Activity hoặc Fragment bị hủy, ViewModel của chúng sẽ vẫn còn chạy và các coroutine đang chạy trong ViewModel cũng vẫn tiếp tục chạy. Tuy nhiên, nếu coroutine này thực hiện một hoạt động liên quan đến View như update UI, thì việc đó sẽ gây ra lỗi sau khi View đã bị hủy.

Để tránh điều này, bạn có thể sử dụng phương thức `viewModelScope` khi khởi tạo coroutine để đảm bảo rằng coroutine sẽ tự động bị hủy khi ViewModel bị hủy. Ví dụ:

```kotlin
class MyViewModel : ViewModel() {
    fun doSomething() {
        viewModelScope.launch {
            // do something here
        }
    }
}

```

Trong ví dụ này, coroutine được khởi chạy bằng `viewModelScope` sẽ tự động bị hủy khi ViewModel bị hủy, tránh việc gây ra lỗi khi View đã bị hủy.

## Access to business logic

    ViewModel is the right place to handle business logic in the UI layer. The ViewModel is also in charge of handling events and delegating them to other layers of the hierarchy when business logic needs to be applied to modify application data.

## The lifecycle of a ViewModel

The lifecycle of a [`ViewModel`](https://developer.android.com/reference/androidx/lifecycle/ViewModel) is tied directly to its scope. A `ViewModel` remains in memory until the [`ViewModelStoreOwner`](https://developer.android.com/reference/kotlin/androidx/lifecycle/ViewModelStoreOwner) to which it is scoped disappears. This may occur in the following contexts:

* In the case of an activity, when it finishes.
* In the case of a fragment, when it detaches.
* In the case of a Navigation entry, when it's removed from the back stack.

This makes ViewModels a great solution for storing data that survives configuration changes.

## Clearing ViewModel dependencies

The ViewModel calls the [`onCleared`](https://developer.android.com/reference/androidx/lifecycle/ViewModel#onCleared()) method when the `ViewModelStoreOwner` destroys it in the course of its lifecycle. This allows you to clean up any work or dependencies that follows the ViewModel's lifecycle.



The following example shows an alternative to `viewModelScope` .`viewModelScope` is a built-in [`CoroutineScope`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-coroutine-scope/) that automatically follows the ViewModel's lifecycle. The ViewModel uses it to trigger business-related operations. If you want to use a custom scope instead of `viewModelScope` for easier testing, the ViewModel can receive a `CoroutineScope` as a dependency in its constructor. When the `ViewModelStoreOwner` clears the ViewModel at the end of its lifecycle, the ViewModel also cancels the `CoroutineScope`.



```kotlin
class MyViewModel(
    private val coroutineScope: CoroutineScope =
        CoroutineScope(SupervisorJob() + Dispatchers.Main.immediate)
) : ViewModel() {

    // Other ViewModel logic ...

    override fun onCleared() {
        coroutineScope.cancel()
    }
}
```



From lifecycle [version 2.5](https://developer.android.com/jetpack/androidx/releases/lifecycle#version_25_2) and above, you can pass one or more `Closeable` objects to the ViewModel's constructor that automatically closes when the ViewModel instance is cleared.



```kotlin
class CloseableCoroutineScope(
    context: CoroutineContext = SupervisorJob() + Dispatchers.Main.immediate
) : Closeable, CoroutineScope {
    override val coroutineContext: CoroutineContext = context
    override fun close() {
        coroutineContext.cancel()
   }
}

class MyViewModel(
    private val coroutineScope: CoroutineScope = CloseableCoroutineScope()
) : ViewModel(coroutineScope) {
    // Other ViewModel logic ...
}
```


