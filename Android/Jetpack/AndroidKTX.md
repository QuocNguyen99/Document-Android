# Android KTX

    Android KTX is a set of Kotlin extensions that are included with Android [Jetpack](https://developer.android.com/jetpack) and other Android libraries. KTX extensions provide concise, idiomatic Kotlin to Jetpack, Android platform, and other APIs. To do so, these extensions leverage several Kotlin language features, including the following:

* Extension functions
* Extension properties
* Lambdas
* Named parameters
* Parameter default values
* Coroutines 

## Core KTX

    The Core KTX module provides extensions for common libraries that are part of the Android framework. These libraries do not have Java-based dependencies that you need to add to `build.gradle`.

## Collection KTX

    The Collection extensions contain utility functions for working with Android's memory-efficient collection libraries, including `ArrayMap`, `LongSparseArray`, `LruCache`, and others.

    Collection extensions take advantage of Kotlin’s operator overloading to simplify things like collection concatenation, as shown in the following example:

```kotlin
// Combine 2 ArraySets into 1.
val combinedArraySet = arraySetOf(1, 2, 3) + arraySetOf(4, 5, 6)

// Combine with numbers to create a new sets.
val newArraySet = combinedArraySet + 7 + 8
```

## Fragment KTX

The [Fragment KTX module](https://developer.android.com/reference/kotlin/androidx/fragment/app/package-summary#extension-functions-summary) provides a number of extensions to simplify the fragment API.

With the Fragment KTX module, you can simplify fragment transactions with lambdas, for example:

```kotlin
fragmentManager().commit {
   addToBackStack("...")
   setCustomAnimations(
           R.anim.enter_anim,
           R.anim.exit_anim)
   add(fragment, "...")
}
```

You can also bind to a `ViewModel` in one line by using the `viewModels` and `activityViewModels` property delegates:

```kotlin
// Get a reference to the ViewModel scoped to this Fragment
val viewModel by viewModels<MyViewModel>()

// Get a reference to the ViewModel scoped to its Activity
val viewModel by activityViewModels<MyViewModel>()
```

## Lifecycle KTX

    Lifecycle KTX defines a `LifecycleScope` for each [`Lifecycle`](https://developer.android.com/topic/libraries/architecture/lifecycle) object. **Any coroutine launched in this scope is canceled when the `Lifecycle` is destroyed.** You can access the `CoroutineScope` of the `Lifecycle` by using the `lifecycle.coroutineScope` or `lifecycleOwner.lifecycleScope` properties.

### Lifecycle-aware coroutine scopes

    Lifecycle-aware components define the following built-in scopes that you can use in your app.

#### ViewModelScope

    A `ViewModelScope` is defined for each [`ViewModel`](https://developer.android.com/topic/libraries/architecture/viewmodel) in your app. Any coroutine launched in this scope is automatically canceled if the `ViewModel` is cleared. Coroutines are useful here for when you have work that needs to be done only if the `ViewModel` is active.

You can access the `CoroutineScope` of a `ViewModel` through the `viewModelScope` property of the ViewModel, as shown in the following example:

```kotlin
class MyViewModel: ViewModel() {
    init {
        viewModelScope.launch {
            // Coroutine that will be canceled when the ViewModel is cleared.
        }
    }
}
```

#### LifecycleScope

        A `LifecycleScope` is defined for each [`Lifecycle`](https://developer.android.com/topic/libraries/architecture/lifecycle) object. Any coroutine launched in this scope is canceled when the `Lifecycle` is destroyed. You can access the `CoroutineScope` of the `Lifecycle` either via `lifecycle.coroutineScope` or `lifecycleOwner.lifecycleScope` properties.

#### Restartable Lifecycle-aware coroutines

        Mặc dù việc sử dụng `lifecycleScope` trong Android để tự động hủy các hoạt động chạy dài khi `Lifecycle` của một `Activity` hoặc một `Fragment` được chuyển sang trạng thái `DESTROYED`. Tuy nhiên, nếu bạn muốn bắt đầu thực thi một khối mã khi `Lifecycle` ở trạng thái cụ thể và hủy bỏ khi nó ở trạng thái khác, thì bạn có thể sử dụng cách tiếp cận này. Ví dụ, bạn có thể muốn thu thập một `Flow` khi `Lifecycle` ở trạng thái `STARTED` và hủy bỏ việc thu thập khi nó ở trạng thái `STOPPED`. Việc tiếp cận này chỉ xử lý các phát ra giá trị của `Flow` khi giao diện người dùng hiển thị trên màn hình, tiết kiệm tài nguyên và có thể tránh các lỗi ứng dụng.

    For these cases, `Lifecycle` and `LifecycleOwner` provide the suspend `repeatOnLifecycle` API that does exactly that. The following example contains a code block that runs every time the associated `Lifecycle` is at least in the `STARTED` state and cancels when the `Lifecycle` is `STOPPED`:

```kotlin
class MyFragment : Fragment() {

    val viewModel: MyViewModel by viewModel()

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        // Create a new coroutine in the lifecycleScope
        viewLifecycleOwner.lifecycleScope.launch {
            // repeatOnLifecycle launches the block in a new coroutine every time the
            // lifecycle is in the STARTED state (or above) and cancels it when it's STOPPED.
            viewLifecycleOwner.repeatOnLifecycle(Lifecycle.State.STARTED) {
                // Trigger the flow and start listening for values.
                // This happens when lifecycle is STARTED and stops
                // collecting when the lifecycle is STOPPED
                viewModel.someDataFlow.collect {
                    // Process item
                }
            }
        }
    }
}
```

### Lifecycle-aware flow collection

    If you only need to perform lifecycle-aware collection on a single flow, you can use the [`Flow.flowWithLifecycle()`](https://developer.android.com/reference/kotlin/androidx/lifecycle/package-summary#flowwithlifecycle) method to simplify your code:

```kotlin
viewLifecycleOwner.lifecycleScope.launch {
    exampleProvider.exampleFlow()
        .flowWithLifecycle(viewLifecycleOwner.lifecycle, Lifecycle.State.STARTED)
        .collect {
            // Process the value.
        }
}
```

    However, if you need to perform lifecycle-aware collection on multiple flows in parallel, then you must collect each flow in different coroutines. In that case, it's more efficient to use `repeatOnLifecycle()` directly:

```kotlin
viewLifecycleOwner.lifecycleScope.launch {
    viewLifecycleOwner.repeatOnLifecycle(Lifecycle.State.STARTED) {
        // Because collect is a suspend function, if you want to
        // collect multiple flows in parallel, you need to do so in
        // different coroutines.
        launch {
            flow1.collect { /* Process the value. */ }
        }

        launch {
            flow2.collect { /* Process the value. */ }
        }
    }
}
```

### Suspend Lifecycle-aware coroutines

        Mặc dù CoroutineScope cung cấp một cách thích hợp để hủy các hoạt động chạy lâu tự động, bạn có thể có những trường hợp khác khi bạn muốn tạm dừng việc thực thi một khối mã trừ khi Lifecycle đang ở trạng thái nhất định. Ví dụ, để chạy một FragmentTransaction, bạn phải đợi đến khi Lifecycle ít nhất là STARTED. Đối với những trường hợp này, Lifecycle cung cấp các phương thức bổ sung: lifecycle.whenCreated, lifecycle.whenStarted và lifecycle.whenResumed. Bất kỳ coroutine nào chạy bên trong các khối này sẽ bị tạm dừng nếu Lifecycle không đạt đến trạng thái mong muốn tối thiểu.

```kotlin
class MyFragment: Fragment {
    init { // Notice that we can safely launch in the constructor of the Fragment.
        lifecycleScope.launch {
            whenStarted {
                // The block inside will run only when Lifecycle is at least STARTED.
                // It will start executing when fragment is started and
                // can call other suspend methods.
                loadingView.visibility = View.VISIBLE
                val canAccess = withContext(Dispatchers.IO) {
                    checkUserAccess()
                }

                // When checkUserAccess returns, the next line is automatically
                // suspended if the Lifecycle is not *at least* STARTED.
                // We could safely run fragment transactions because we know the
                // code won't run unless the lifecycle is at least STARTED.
                loadingView.visibility = View.GONE
                if (canAccess == false) {
                    findNavController().popBackStack()
                } else {
                    showContent()
                }
            }

            // This line runs only after the whenStarted block above has completed.

        }
    }
}
```



If the `Lifecycle` is destroyed while a coroutine is active via one of the `when` methods, the coroutine is automatically canceled. In the example below, the `finally` block runs once the `Lifecycle` state is `DESTROYED`:

```kotlin
class MyFragment: Fragment {
    init {
        lifecycleScope.launchWhenStarted {
            try {
                // Call some suspend functions.
            } finally {
                // This line might execute after Lifecycle is DESTROYED.
                if (lifecycle.state >= STARTED) {
                    // Here, since we've checked, it is safe to run any
                    // Fragment transactions.
                }
            }
        }
    }
}
```



**Note:**  Mặc dù các phương pháp này mang lại sự thuận tiện khi làm việc với Lifecycle, nhưng bạn chỉ nên sử dụng chúng khi thông tin hợp lệ trong phạm vi của Lifecycle (ví dụ: văn bản được tính toán trước). Hãy nhớ rằng nếu hoạt động khởi động lại,  **Coroutine sẽ không được khởi động lại.**

!! **Warning:** Ưu tiên sử dụng API repeatOnLifecycle để thu thập các flow thay vì sử dụng API launchWhenX. Vì các API cuối tạm dừng coroutine thay vì hủy nó khi Lifecycle bị STOPPED, các flow upstream vẫn hoạt động ở nền, tiềm ẩn rủi ro lãng phí tài nguyên và tạo ra các phần tử mới. Do đó, sử dụng API repeatOnLifecycle giúp tắt hoàn toàn luồng upstream khi Lifecycle ở trạng thái STOPPED, tránh lãng phí tài nguyên.

### Use coroutines with LiveData

In the example below, `loadUser()` is a suspend function declared elsewhere. Use the `liveData` builder function to call `loadUser()` asynchronously, and then use `emit()` to emit the result:

```kotlin
val user: LiveData<User> = liveData {
    val data = database.loadUser() // loadUser is a suspend function.
    emit(data)
}
```

You can also emit multiple values from the block. Each `emit()` call suspends the execution of the block until the `LiveData` value is set on the main thread.

```kotlin
val user: LiveData<Result> = liveData {
    emit(Result.loading())
    try {
        emit(Result.success(fetchUser()))
    } catch(ioException: Exception) {
        emit(Result.error(ioException))
    }
}
```

You can also combine `liveData` with [`Transformations`](https://developer.android.com/reference/androidx/lifecycle/Transformations), as shown in the following example:

```kotlin
class MyViewModel: ViewModel() {
    private val userId: LiveData<String> = MutableLiveData()
    val user = userId.switchMap { id ->
        liveData(context = viewModelScope.coroutineContext + Dispatchers.IO) {
            emit(database.loadUserById(id))
        }
    }
}
```

You can emit multiple values from a `LiveData` by calling the `emitSource()` function whenever you want to emit a new value. Note that each call to `emit()` or `emitSource()` removes the previously-added source.

## LiveData KTX

    When using LiveData, you might need to calculate values asynchronously. For example, you might want to retrieve a user's preferences and serve them to your UI. For these cases, LiveData KTX provides a `liveData` builder function that calls a `suspend` function and serves the result as a `LiveData` object.

    In the following example, `loadUser()` is a suspend function declared elsewhere. You can use the `liveData` builder function to call `loadUser()` asynchronously, and then use `emit()` to emit the result:

```kotlin
val user: LiveData<User> = liveData {
    val data = database.loadUser() // loadUser is a suspend function.
    emit(data)
}
```

## Navigation KTX

Each component of the Navigation library has its own KTX version that adapts the API to be more succinct and Kotlin-idiomatic.

Use the extension functions and property delegation to access destination arguments and navigate to destinations, as shown in the following example:

```kotlin
class MyDestination : Fragment() {

    // Type-safe arguments are accessed from the bundle.
    val args by navArgs<MyDestinationArgs>()

    ...
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        view.findViewById<Button>(R.id.next)
            .setOnClickListener {
                // Fragment extension added to retrieve a NavController from
                // any destination.
                findNavController().navigate(R.id.action_to_next_destination)
            }
     }
     ...

}
```

## Room KTX

Room extensions add coroutines support for database transactions.

```kotlin
@Query("SELECT * FROM Users")
suspend fun getUsers(): List<User>

@Query("SELECT * FROM Users")
fun getUsers(): Flow<List<User>>
```



## SQLite KTX

SQLite extensions wrap SQL-related code in transactions, eliminating a lot of boilerplate code.

Here's an example of using the `transaction` extension to perform a database transaction:

```kotlin
db.transaction {
    // insert data
}
```

## ViewModel KTX

The ViewModel KTX library provides a `viewModelScope()` function that makes it easier to launch [coroutines](https://developer.android.com/kotlin/coroutines) from your `ViewModel`. The [`CoroutineScope`](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-coroutine-scope/) is bound to `Dispatchers.Main` and is automatically cancelled when the `ViewModel` is cleared. You can use `viewModelScope()` instead of creating a new scope for each `ViewModel`.

## WorkManager KTX

WorkManager KTX provides first-class support for coroutines.


