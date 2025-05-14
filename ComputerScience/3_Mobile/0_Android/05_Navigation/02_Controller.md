# Jetpack Navigation Controller

The navigation controller is one of the key concepts in navigation.**It holds the navigation graph and exposes methods that allow your app to move between the destinations in the graph.**

When using the Navigation component, you create a navigation controller using the `NavController` class. `NavController` is the central navigation API. It tracks which destinations the user has visited, and allows the user to move between destinations.

> [!NOTE]
> Each `NavHost` you create has its own corresponding `NavController`. The `NavController` provides access to the NavHost's graph.

## Create Jetpack Navigation Controller

### Compose

To create a `NavController` when using Jetpack Compose, call `rememberNavController()`:

```kotlin
val navController = rememberNavController()
```

You should create the `NavController` high in your composable hierarchy. 
It needs to be high enough that all the composables that need to reference it can do so.

Doing so lets you to use the `NavController` as the single source of truth for updating composables outside of your screens. This follows the principles of **state hoisting**.

### Views UI framework
If you are using the Views UI framework, you can retrieve your `NavController` using one of the following methods depending on the context:

**Kotlin**:

- `Fragment.findNavController()`
- `View.findNavController()`
- `Activity.findNavController(viewId: Int)`

**Java**:

- `NavHostFragment.findNavController(Fragment)`
- `Navigation.findNavController(Activity, @IdRes int viewId)`
- `Navigation.findNavController(View)`


Typically, **you first get a NavHostFragment, and then retrieve the NavController from the fragment**. The following snippet demonstrates this:

```kotlin
val navHostFragment =
    supportFragmentManager.findFragmentById(R.id.nav_host_fragment) as NavHostFragment
val navController = navHostFragment.navController
```


> [!CAUTION]
> You might run into issues when creating a `NavHostFragment` using `FragmentContainerView` or by manually adding it to your activity with a `FragmentTransaction`. 
> If you try to get the `NavController` in `onCreate()` using `Navigation.findNavController(Activity, @IdRes int)`, it may fail. 
> Instead, you should get the `NavController` directly from the `NavHostFragment` itself, as shown in the previous example. 
> This happens because the fragment's lifecycle might not be fully initialized when `onCreate()` is called, causing the lookup for `NavController` to fail.