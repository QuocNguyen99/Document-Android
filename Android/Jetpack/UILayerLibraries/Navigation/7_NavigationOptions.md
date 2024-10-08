# Navigation options

Navigation options, represented as `NavOptions`. This class contains all of the special configuration for transitioning to and back from the target destination, including animation resource configuration, pop behavior, and whether the destination should be launched in single top mode.

## Compose

By default, `navigate()` adds your new destination to the back stack. You can modify the behavior of `navigate()` by passing additional navigation options to your `navigate()` call.

You can create an instance of `NavOptions` using a simple lambda. Pass `navigate()` the arguments you might otherwise explicitly pass to the `NavOptions.Builder`.

## XML

Config the NavOptions on action tag in xml navigation graph:

```xml
<fragment android:id="@+id/b"
            android:name="com.example.myapplication.FragmentB"
            android:label="b"
            tools:layout="@layout/b">
    <action android:id="@+id/action_b_to_a"
            app:destination="@id/a"
            app:enterAnim="@anim/nav_default_enter_anim"
            app:exitAnim="@anim/nav_default_exit_anim"
            app:popEnterAnim="@anim/nav_default_pop_enter_anim"
            app:popExitAnim="@anim/nav_default_pop_exit_anim"
            app:popUpTo="@+id/a"
            app:popUpToInclusive="true"/>
</fragment>
```

When the navigation graph is inflated, these actions are parsed, and corresponding `NavAction` objects are generated with the configurations defined in the graph. The action includes animations along with `popUpTo` behavior that removes all destinations from the backstack. All of these settings are captured as `NavOptions` and are attached to the `NavAction`.

## Add Shared element transitions between destinations


#### XML
Shared elements are supplied programmatically rather than through your navigation XML file. `Activity` and `Fragment` destinations each have a subclass of the `Navigator.Extras` interface that accepts additional options for navigation, **including shared elements**. You can pass these `Extras` when calling `navigate()`.
For example. 
- Shared element transitions to a fragment destination:

The `FragmentNavigator.Extras` class allows you to map shared elements from one destination to the next by their transition name, similar to using `FragmentTransaction.addSharedElement()`. You can then pass the extras to `navigate()`, as shown in the following example:

```kotlin
val extras = FragmentNavigatorExtras(view1 to "hero_image")

view.findNavController().navigate(
    R.id.confirmationAction,
    null, // Bundle of args
    null, // NavOptions
    extras)
```
- Shared element transitions to an activity destination:

`Activities` rely on `ActivityOptionsCompat` to control Shared Element Transitions as detailed in the Start an activity with a shared element documentation and as shown in the example below:


```kotlin
// Rename the Pair class from the Android framework to avoid a name clash
import android.util.Pair as UtilPair
...
val options = ActivityOptionsCompat.makeSceneTransitionAnimation(activity,
        UtilPair.create(view1, "hero_image"))
val extras = ActivityNavigatorExtras(options)
view.findNavController().navigate(
    R.id.details,
    null, // Bundle of args
    null, // NavOptions
    extras)
```


#### Compose

In Compose, there are a few high level APIs that help you create shared elements:

- `SharedTransitionLayout`: The outermost layout required to implement shared element transitions. It provides a `SharedTransitionScope`. Composables need to be in a `SharedTransitionScope` to use the shared element modifiers.
- `Modifier.sharedElement()`: The modifier that flags to the `SharedTransitionScope` the composable that should be matched with another composable.
- `Modifier.sharedBounds()`: The modifier that flags to the `SharedTransitionScope` that this composable's bounds should be used as the container bounds for where the transition should take place. In contrast to `sharedElement()`, `sharedBounds()` is designed for visually different content.