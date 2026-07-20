# Navigation Back Stack

**The NavController holds a "back stack" that contains the destinations the user has visited.**
As the user navigates to screens throughout your app, the `NavController` adds and removes destinations to and from the back stack.

## Basic behavior

These are the core facts you should consider regarding the behavior of the back stack:

- First destination: When the user opens the app, the `NavController` pushes the first destination to the top of the back stack.
- Pushing to the stack: Each call `NavController.navigate()` pushes the given destination to the top of the stack.
- Popping top destination: Tapping Up or Back calls the `NavController.navigateUp()` and `NavController.popBackStack()` methods, respectively. 


### Pop back to a particular destination

You can also use `popBackStack()` to navigate to a particular destination. To do so, use one of its overloads.
These overloads take the user to the destination associated with the given identifier. **Critically, they pop everything on the stack above that destination.**

These overloads also take an `inclusive` boolean. 
- `inclusive = true` the specified destination in the popUpTo call, along with all destinations added after it, will be removed from the back stack.
- `inclusive = false`: Only the destinations that come after the specified destination will be removed, leaving the specified destination itself on the stack.

Example: 
Imagine a multi-step registration process: `Step1 -> Step2 -> Step3 -> Summary`. 
After the user completes registration and reaches the Summary screen, we want to remove all the previous steps from the back stack. 
This ensures users cannot go back to modify any step after submission.

```kotlin
navController.navigate("summary") {
    popUpTo("step1") { inclusive = true }
}
```

### Handle a failed pop back

When the `popBackStack()` returns `false`, a subsequent call to `NavController.getCurrentDestination()` returns `null`. 
This means the app has popped the last destination off the back stack. In this case, the user sees only a blank screen.

This can occur in the following cases:

- `popBackStack()` did not pop anything from the stack.
- `popBackStack()` did pop a destination off the back stack and the stack is now empty.

To resolve this, you must then navigate to a new destination or call `finish()` on your activity to end it. The following snippet demonstrates this:

```kotlin
if (!navController.popBackStack()) {
    // Call finish() on your Activity
    finish()
}
```

### Pop up to a destination

To remove destinations from the back stack when navigating from one destination to another, add a `popUpTo()` argument to the associated `navigate()` function call. 
You can include an argument for the `inclusive` parameter with a value of `true` to indicate that the destination you have specified in `popUpTo()` should also pop off back stack.

To implement this programmatically, pass `popUpTo()` to `navigate()` as part of `NavOptions` with `inclusive` set to `true`. This works in both Compose and Views.

### Save state when popping up

When you use `popUpTo` to navigate to a destination, you can optionally save the back stack and the states of all destinations popped off the back stack.

To do this programmatically, specify `saveState = true` when adding `popUpTo` to your navigation options.

You can also specify `restoreState = true` in your navigation options to automatically restore the back stack and the state associated with the destination.

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

## Dialog and the Backstack

One or more dialog destinations can only exist on the top of the back stack. 
This is because when the user navigates to a destination that is not a dialog destination, the `NavController` automatically pops all dialog destinations off the top of the stack. 
This ensures that the current destination is always fully visible over other destinations on the back stack.

## Circular navigation

Imagine your app has three destinations: A, B, and C. It also has actions that lead from A to B, B to C, and C back to A.

As such, repeatedly navigating through the flow in the diagram would cause your back stack would to contain multiple sets of each destination: A, B, C, A, B, C, A, B, C.


To avoid repetition in your back stack, specify `popUpTo()` and inclusive in your call to `NavController`.`navigate()` or in your navigation action.

In this case, when the user navigates from destination C back to destination A, the NavController also pops up to A. This means that it removes B and C from the stack. With `inclusive = true`, it also pops the first A, effectively clearing the stack.

## Multiple back stacks

If your app includes **Bottom Navigation** or a **Navigation Drawer**, multiple back stack support allows your users to switch freely between flows in your app **without losing their place in any of them.**

The `NavigationUI` class includes methods that handle this automatically, but you can also use the underlying APIs manually for a more customized implementation.

### Implement support manually with underlying APIs

If the elements provided by `NavigationUI` don't satisfy your requirements, you can use the underlying APIs for saving and restoring back stacks through one of the other API surfaces provided by the Navigation component.

### Navigation XML

In Navigation XML, `<action>` elements in your navigation graph can use the `app:popUpToSaveState` attribute to save the state of any destinations that the action popped using `app:popUpTo`. They can also use the `app:restoreState` attribute to restore any previously saved state for the destination defined in the `app:destination` attribute.

```xml
<action
  android:id=”@+id/swap_stack”
  app:destination=”@id/second_stack”
  app:restoreState=”true”
  app:popUpTo=”@id/first_stack_start_destination”
  app:popUpToSaveState=”true” />
```

That way, the action saves the state of the current back stack while also restoring the previously saved state of the destination back stack, if it exists.

### NavOptions

The `NavOptions` class allows you to pass special navigation options to save and restore back stacks when you navigate using a `NavController`.

```kotlin
// Use the navigate() method that takes a navOptions DSL Builder
navController.navigate(selectedBottomNavRoute) {
  launchSingleTop = true
  restoreState = true
  popUpTo(navController.graph.findStartDestination().id) {
    saveState = true
  }
}
```