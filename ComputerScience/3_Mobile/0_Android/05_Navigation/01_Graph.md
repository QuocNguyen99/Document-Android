# Design your navigation graph

**The navigation graph is a data structure that contains each destination within your app and the connections between them.**

## Destination types

There are three general types of destinations: hosted, dialog, and activity. The following table outlines these three destination types and their purposes.

| Type      | Description                                                                                                                                 | Use cases                                                                                                 |
|-----------|---------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------|
| Hosted  | Fills the entire navigation host. That is, the size of a hosted destination is the same as the size of the navigation host and previous destinations are not visible. | Main and detail screens.                                                                                   |
| Dialog  | Presents overlay UI components. This UI is not tied to the location of the navigation host or its size. Previous destinations are visible underneath the destination. | Alerts, selections, forms.                                                                                 |
| Activity| Represents unique screens or features within the app. |  Serve as an exit point to the navigation graph that starts a new Android activity that is managed separately from the Navigation component. |     

## Frameworks

Although the same general workflow applies in every case, **how exactly you create a navigation host and graph depends on the UI framework you use.**

### Compose

Use the `NavHost` composable. Add a `NavGraph` to it using the Kotlin DSL. You can create the graph in two ways:
- **As part of the `NavHost`**: Construct the navigation graph directly as part of adding the NavHost.
- **Programmatically**: Use the `NavController.createGraph()` method to create a `NavGraph` and pass it to the `NavHost` directly.

In Compose, use a serializable object or class to define a route. **A route describes how to get to a destination, and contains all the information that the destination requires**. Once you have defined your routes, use the NavHost composable to create your navigation graph. Consider the following example:

```kotlin
@Serializable
object Profile
@Serializable
object FriendsList

val navController = rememberNavController()

NavHost(navController = navController, startDestination = Profile) {
    composable<Profile> { ProfileScreen( /* ... */ ) }
    composable<FriendsList> { FriendsListScreen( /* ... */ ) }
    // Add more destinations similarly.
}
```

> [!CAUTION]
> Instead of passing a type to `composable()`, you can pass a route string or an integer id. 
> However, this makes it much more difficult to manage passing additional arguments to the destination.


### Fragments:

When using fragments with the views UI framework, use a `NavHostFragment` as the host. There are several ways to create a navigation graph:

- **Programmatically**: Use the Kotlin DSL to create a `NavGraph` and directly apply it on the `NavHostFragment`.
The `createGraph()` function used with the Kotlin DSL for both fragments and Compose is the same.
- **XML**: Write your navigation host and graph directly in XML.


## Nested graphs

Login flows, wizards, or other subflows within your app are usually best represented as nested navigation graphs. By nesting self-contained subnavigation flows in this way, the main flow of your app's UI is easier to comprehend and manage.
