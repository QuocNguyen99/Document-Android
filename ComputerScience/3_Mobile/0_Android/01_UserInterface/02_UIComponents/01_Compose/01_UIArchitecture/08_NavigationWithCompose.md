# Navigation with Compose

The Navigation component provides support for Jetpack Compose applications. You can navigate between composables while taking advantage of the Navigation component's infrastructure and features.

**When implementing navigation in an app, implement a navigation host, graph, and controller.**

## Create a NavHost and Graph

In Compose, use the NavHost composable to create your navigation graph. Consider the following example:

```kotlin
val navController = rememberNavController()

NavHost(navController = navController, startDestination = "profile") {
    composable("profile") { Profile( /* ... */ ) }
    composable("friendslist") { FriendsList( /* ... */ ) }
    // Add more destinations similarly.
}
```

- The call to the NavHost composable passes a NavController and a route string that corresponds to the start destination.
- The lambda passed to the `NavHost` ultimately calls `NavController.creatGraph()` and returns a `NavGraph`.
- The calls to `NavGraphBuilder.composable()` add destinations to the resulting `NavGraph`.
- In this case, the destinations are the Profile and FriendsList composables. The route strings "profile" and "friendslist" become the keys that identify the two destinations.
> [!NOTE]
> A route is a string that defines the path to your composable. You can think of it as a key that corresponds to a specific destination. Each destination has a unique route.



## Create a NavController

To create a NavController when using Jetpack Compose, call `rememberNavController()`:

```kotlin
val navController = rememberNavController()
```


You should create the `NavController` high in your composable hierarchy. It needs to be high enough that all the composables that need to reference it can do so.

Doing so lets you to use the `NavController` as the single source of truth for updating composables outside of your screens. This follows the principles of [state hoisting.](../UIArchitecture/ManagingState.md)

## Navigate to a composable

To navigate to a composable in the navigation graph, use `NavController.navigate(route)`. With this overload, `navigate()` takes a single `String` argument. This is the route. It serves as the key to a destination.

```kotlin
navController.navigate("friendslist")
```
To navigate using a `route` string, **you first need to create your `NavGraph` such that each destination is associated with a `route`**. For composables, you do so with the composable() function.

## Navigate with arguments

Navigation Compose also supports passing arguments between composable destinations. In order to do this, you need to add argument placeholders to your route, similar to how you add arguments to a deep link when using the base navigation library:

```kotlin
NavHost(startDestination = "profile/{userId}") {
    ...
    composable("profile/{userId}") {...}
}
```
By default, all arguments are parsed as strings. The `arguments` parameter of `composable()` accepts a list of `NamedNavArgument` objects. You can quickly create a `NamedNavArgument` using the `navArgument()` method and then specify its exact `type`:


```kotlin
NavHost(startDestination = "profile/{userId}") {
    ...
    composable(
        "profile/{userId}",
        arguments = listOf(navArgument("userId") { type = NavType.StringType })
    ) {...}
}
```

**You should extract the arguments from the NavBackStackEntry that is available in the lambda of the composable() function.**

```kotlin
composable("profile/{userId}") { backStackEntry ->
    Profile(navController, backStackEntry.arguments?.getString("userId"))
}
```

To pass the argument to the destination, you need to add append it to the route when you make the `navigate` call:

```kotlin
navController.navigate("profile/user1234")
```

## Retrieve complex data when navigating

It is strongly advised not to pass around complex data objects when navigating, but instead pass the minimum necessary information, such as a unique identifier or other form of ID, as arguments when performing navigation actions:

```kotlin
// Pass only the user ID when navigating to a new destination as argument
navController.navigate("profile/user1234")
```

**Complex objects should be stored as data in a single source of truth, such as the data layer.** Once you land on your destination after navigating, you can then load the required information from the single source of truth by using the passed ID. To retrieve the arguments in your `ViewModel` that's responsible for accessing the data layer, use the `SavedStateHandle` of the `ViewModel`:


```kotlin
class UserViewModel(
    savedStateHandle: SavedStateHandle,
    private val userInfoRepository: UserInfoRepository
) : ViewModel() {

    private val userId: String = checkNotNull(savedStateHandle["userId"])

    // Fetch the relevant user information from the data layer,
    // ie. userInfoRepository, based on the passed userId argument
    private val userInfo: Flow<UserInfo> = userInfoRepository.getUserInfo(userId)

// …

}
```


**This approach helps prevent data loss during configuration changes and any inconsistencies when the object in question is being updated or mutated.**

### Add optional arguments

Navigation Compose also supports optional navigation arguments. Optional arguments differ from required arguments in two ways:

- They must be included using query parameter syntax ("?argName={argName}")
- They must have a defaultValue set, or have nullable = true (which implicitly sets the default value to null)

This means that **all optional arguments must be explicitly added** to the composable() function as a list:

Now, even if there is no argument passed to the destination, the defaultValue, "user1234", is used instead.

## Deep links

Navigation Compose supports implicit deep links that can be defined as part of the composable() function as well. Its deepLinks parameter accepts a list of NavDeepLink objects which can be quickly created using the navDeepLink() method:

```kotlin
val uri = "https://www.example.com"

composable(
    "profile?id={id}",
    deepLinks = listOf(navDeepLink { uriPattern = "$uri/{id}" })
) { backStackEntry ->
    Profile(navController, backStackEntry.arguments?.getString("id"))
}
```

**These deep links let you associate a specific URL**, action or mime type with a composable. By default, these deep links are not exposed to external apps. To make these deep links externally available you must add the appropriate `<intent-filter>` elements to your app's manifest.xml file. To enable the deep link in the preceding example, you should add the following inside of the `<activity>` element of the manifest:

```kotlin
<activity …>
  <intent-filter>
    ...
    <data android:scheme="https" android:host="www.example.com" />
  </intent-filter>
</activity>
```

Navigation automatically deep links into that composable when the deep link is triggered by another app.

<details>
  <summary style="color: orange;">
  <b>
These same deep links can also be used to build a PendingIntent with the appropriate deep link from a composable
  </b>
  </summary>
  
  <p>
  
```kotlin
val id = "exampleId"
val context = LocalContext.current
val deepLinkIntent = Intent(
    Intent.ACTION_VIEW,
    "https://www.example.com/$id".toUri(),
    context,
    MyActivity::class.java
)

val deepLinkPendingIntent: PendingIntent? = TaskStackBuilder.create(context).run {
    addNextIntentWithParentStack(deepLinkIntent)
    getPendingIntent(0, PendingIntent.FLAG_UPDATE_CURRENT)
}
```

  </p>
</details>

## Nested Navigation

To create a nested navigation graph using Compose, use the `NavGraphBuilder.navigation()` function. You use `navigation()` just like `NavGraphBuilder.composable()` and `NavGraphBuilder.dialog()` functions when adding destinations to a graph.

The primary difference is that navigation creates a nested graph rather than a new destination. You then call composable and dialog within navigation's lambda to add destinations to the nested graph.

<details>
  <summary style="color: orange;">
  <b>
  For example   
  </b>
  </summary>
  
  <p>
  
```kotlin
NavHost(navController, startDestination = "title_screen") {
    composable("title_screen") {
        TitleScreen(
            onPlayClicked = { navController.navigate("register") },
            onLeaderboardsClicked = { /* Navigate to leaderboards */ }
        )
    }
    composable("register") {
        RegisterScreen(
            onSignUpComplete = { navController.navigate("gameInProgress") }
        )
    }
    navigation(startDestination = "match", route = "gameInProgress") {
        composable("match") {
            MatchScreen(
                onStartGame = { navController.navigate("in_game") }
            )
        }
        composable("in_game") {
            InGameScreen(
                onGameWin = { navController.navigate("results_winner") },
                onGameLose = { navController.navigate("game_over") }
            )
        }
        composable("results_winner") {
            ResultsWinnerScreen(
                onNextMatchClicked = {
                    navController.navigate("match") {
                        popUpTo("match") { inclusive = true }
                    }
                },
                onLeaderboardsClicked = { /* Navigate to leaderboards */ }
            )
        }
        composable("game_over") {
            GameOverScreen(
                onTryAgainClicked = {
                    navController.navigate("match") {
                        popUpTo("match") { inclusive = true }
                    }
                }
            )
        }
    }
}
```

  </p>
</details>

To navigate directly to a nested destination, use the `route` as you would to any other destination. This is because routes are a global concept that any screen can navigate to:

```kotlin
navController.navigate("match")
```

> [!NOTE]
> You can scope which routes are available by controlling the method visibility of the type-safe APIs. For more information, see [Type safety in Kotlin DSL and Navigation Compose.](https://developer.android.com/guide/navigation/design/type-safety#type-safety)

### Integration with the bottom nav bar

By defining the `NavController` at a higher level in your composable hierarchy, you can connect Navigation with other components such as the bottom navigation component. Doing this lets you navigate by selecting the icons in the bottom bar.

To link the items in a bottom navigation bar to routes in your navigation graph, it is recommended to define a sealed class, such as `Screen` seen here, that contains the route and String resource ID for the destinations.

```kotlin
sealed class Screen(val route: String, @StringRes val resourceId: Int) {
    object Profile : Screen("profile", R.string.profile)
    object FriendsList : Screen("friendslist", R.string.friends_list)
}
```

Then place those items in a list that can be used by the `BottomNavigationItem`:

```kotlin
val items = listOf(
   Screen.Profile,
   Screen.FriendsList,
)
```
In your `BottomNavigation` composable, get the current `NavBackStackEntry` using the `currentBackStackEntryAsState()` function. This entry gives you access to the current `NavDestination`. The selected state of each `BottomNavigationItem` can then be determined by comparing the item's route with the route of the current destination and its parent destinations to handle cases when you are using nested navigation using the `NavDestination` hierarchy.

The item's route is also used to connect the `onClick` lambda to a call to `navigate` so that tapping on the item navigates to that item. By using the `saveState` and `restoreState` flags, the state and back stack of that item is correctly saved and restored as you swap between bottom navigation items.

```kotlin
val navController = rememberNavController()
Scaffold(
  bottomBar = {
    BottomNavigation {
      val navBackStackEntry by navController.currentBackStackEntryAsState()
      val currentDestination = navBackStackEntry?.destination
      items.forEach { screen ->
        BottomNavigationItem(
          icon = { Icon(Icons.Filled.Favorite, contentDescription = null) },
          label = { Text(stringResource(screen.resourceId)) },
          selected = currentDestination?.hierarchy?.any { it.route == screen.route } == true,
          onClick = {
            navController.navigate(screen.route) {
              // Pop up to the start destination of the graph to
              // avoid building up a large stack of destinations
              // on the back stack as users select items
              popUpTo(navController.graph.findStartDestination().id) {
                saveState = true
              }
              // Avoid multiple copies of the same destination when
              // reselecting the same item
              launchSingleTop = true
              // Restore state when reselecting a previously selected item
              restoreState = true
            }
          }
        )
      }
    }
  }
) { innerPadding ->
  NavHost(navController, startDestination = Screen.Profile.route, Modifier.padding(innerPadding)) {
    composable(Screen.Profile.route) { Profile(navController) }
    composable(Screen.FriendsList.route) { FriendsList(navController) }
  }
}
```




