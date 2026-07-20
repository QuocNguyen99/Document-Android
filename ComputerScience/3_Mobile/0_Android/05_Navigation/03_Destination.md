# Navigation Destination 

## Dialog destination

### Compose

To create a dialog destination in Compose, add a destination to your `NavHost` using the `dialog()` function. The function behaves essentially the same as composable, only it creates a dialog destination rather than a hosted destination.

Example: 

```kotlin
@Composable
fun MyApp() {
    val navController = rememberNavController()
    NavHost(navController, startDestination = Home) {
        composable<Home> { HomeScreen(onNavigateToSettings = { navController.navigate(route = Settings) }) }
        dialog<Settings> { SettingsScreen() }
    }
}
```
`Dialog` destinations appear over the previous destination in the `NavHost`. **Use them when the dialog represents a separate screen in your app that needs its own lifecycle and saved state, independent of any other destination in your navigation graph**. You might prefer to use an `AlertDialog` or related composable if you want a dialog for a less complex prompt, such as a confirmation.

> [!Note]
> Because bottom sheets in Compose are not built on `Dialog`, they need their own destination type. 

### Views UI framework

### 1. Kotlin DSL

If you are working with fragments and you are using the Kotlin DSL to create your graph, adding a dialog destination is very similar to when using Compose.

Example: 

```kotlin
// Define destinations with serializable classes or objects
@Serializable
object Home
@Serializable
object Settings

// Add the graph to the NavController with `createGraph()`.
navController.graph = navController.createGraph(
    startDestination = Home
) {
    // Associate the home route with the HomeFragment.
    fragment<HomeFragment, Home> {
        label = "Home"
    }

    // Define the settings destination as a dialog using DialogFragment.
    dialog<SettingsFragment, Settings> {
        label = "Settings"
    }
}
```

### 2. XML
If you have an existing DialogFragment, use the `<dialog>`element to add the dialog to your navigation graph, as shown in the following example:

```xml
<?xml version="1.0" encoding="utf-8"?>
<navigation xmlns:android="http://schemas.android.com/apk/res/android"
            xmlns:app="http://schemas.android.com/apk/res-auto"
            android:id="@+id/nav_graph">

...

<dialog
    android:id="@+id/my_dialog_fragment"
    android:name="androidx.navigation.myapp.MyDialogFragment">
    <argument android:name="myarg" android:defaultValue="@null" />
        <action
            android:id="@+id/myaction"
            app:destination="@+id/another_destination"/>
</dialog>

...

</navigation>
```

### Activity & Fragment Destination

In your navigation graph, a destination can be an activity. 
While it is best practice to have a single activity in your app, apps often use separate activities for distinct components or screen within an app.
Activity destinations can be useful in such cases.

#### Compose and Kotlin DSL

The `activity()` DSL function takes a type parameter for the route but is not parameterized to any implementing activity class.
Instead, you set an optional `activityClass` in a trailing lambda. 
This flexibility lets you define an activity destination for an activity that should be launched using an implicit intent, where an explicit activity class wouldn't make sense. 

Example:

```kotlin
activity<MyRoute> {
   label = getString(R.string.activity_title)
   // custom argument types, deepLinks...

   activityClass = MyActivity::class
}
```

The `fragment()` DSL function can be parameterized with the fragment class for the UI and the route type used to uniquely identify this destination, 
followed by a lambda where you can provide additional configuration as described in the Navigating with your Kotlin DSL graph section.


```kotlin
fragment<MyFragment, MyRoute> {
   label = getString(R.string.fragment_title)
   // custom argument types, deepLinks
}
```

#### XML

Creating an activity destination is similar to creating a fragment destination. **However, the nature of an activity destination is quite different.**

By default, the Navigation library attaches the `NavController` to an `Activity` layout, and the active navigation graph is scoped to the active `Activity`. If a user navigates to a different `Activity`, the current navigation graph is no longer in scope. This means that an `Activity` destination should be considered an endpoint within a navigation graph.


```xml
<?xml version="1.0" encoding="utf-8"?>
<navigation xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:id="@+id/navigation_graph"
    app:startDestination="@id/simpleFragment">

    <activity
        android:id="@+id/sampleActivityDestination"
        android:name="com.example.android.navigation.activity.DestinationActivity"
        android:label="@string/sampleActivityTitle" />
</navigation>
```

This XML is equivalent to the following call to startActivity():

```kotlin
startActivity(Intent(context, DestinationActivity::class.java))
```

**You might have cases where this approach is not appropriate**. For example, you might not have a compile-time dependency on the activity class, or you might prefer the level of indirection of going through an implicit intent. The intent-filter in the manifest entry for the destination Activity dictates how you need to structure the Activity destination.
