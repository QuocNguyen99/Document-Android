# Navigation Back Stack

## Reference a destination using NavBackStackEntry

Starting with Navigation 2.2.0, you can get a reference to the `NavBackStackEntry` for any destination on the navigation stack by calling `NavController.getBackStackEntry()`, passing it a destination ID. If the back stack contains more than one instance of the specified destination, `getBackStackEntry()` returns the topmost instance from the stack.

The returned `NavBackStackEntry` provides a `Lifecycle`, a `ViewModelStore`, and a `SavedStateRegistry` at the destination level. These objects are valid for the lifetime of the destination on the back stack.

You can observe the `Lifecycle` of a `NavBackStackEntry` just as you would observe the `Lifecycle` of a fragment or activity. In addition, `NavBackStackEntry` is a `LifecycleOwner`, which means that you can use it when observing `LiveData` or with other lifecycle-aware components, as shown in the following example:

```kotlin
myViewModel.liveData.observe(backStackEntry, Observer { myData ->
    // react to live data update
})
```

## Returning a result to the previous Destination

In `Navigation` 2.3 and higher, `NavBackStackEntry` gives access to a `SavedStateHandle`. A `SavedStateHandle` is a key-value map that can be used to store and retrieve data. These values persist through process death, including configuration changes, and remain available through the same object. **This is especially useful as a mechanism to get data back from a destination after it is popped off the stack.**

Ex:


To pass data back to Destination A from Destination B, first set up Destination A to listen for a result on its `SavedStateHandle`. To do so, retrieve the `NavBackStackEntry` by using the `getCurrentBackStackEntry()` API and then observe the LiveData provided by `SavedStateHandle`.

```kotlin
override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
    val navController = findNavController();
    // We use a String here, but any type that can be put in a Bundle is supported
    navController.currentBackStackEntry?.savedStateHandle?.getLiveData<String>("key")?.observe(
        viewLifecycleOwner) { result ->
        // Do something with the result.
    }
}
```

In Destination B, you must `set` the result on the `SavedStateHandle` of Destination A by using the `getPreviousBackStackEntry()` API.

```kotlin
navController.previousBackStackEntry?.savedStateHandle?.set("key", result)
```

>[!NOTE]
> Since NavBackStackEntry uses SavedStateHandle, all results must be of a type that you can place in a Bundle. To save results of custom types that are not Parcelable or Serializable

## Share UI-related data between destinations with ViewModel

The Navigation back stack stores a `NavBackStackEntry` not only for each individual destination, but also for each parent navigation graph that contains the individual destination. This allows you to retrieve a `NavBackStackEntry` that is scoped to a navigation graph. A navigation graph-scoped `NavBackStackEntry` provides a way to create a `ViewModel` that's scoped to a navigation graph, enabling you to share UI-related data between the graph's destinations. Any `ViewModel` objects created in this way live until the associated `NavHost` and its `ViewModelStore` are cleared or until the navigation graph is popped from the back stack.



The following example shows how to retrieve a `ViewModel` that's scoped to a navigation graph:

```kotlin
val viewModel: MyViewModel
        by navGraphViewModels(R.id.my_graph)
```

If you're using Navigation 2.2.0 or earlier, you need to provide your own factory to use Saved State with ViewModels, as shown in the following example:

```kotlin

val viewModel: MyViewModel by navGraphViewModels(R.id.my_graph) {
    SavedStateViewModelFactory(requireActivity().application, requireParentFragment())
}
```