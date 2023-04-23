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


