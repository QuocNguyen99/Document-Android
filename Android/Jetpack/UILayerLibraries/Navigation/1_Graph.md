# Design your navigation graph

The Navigation component uses a navigation graph to manage your app's navigation. **The navigation graph is a data structure that contains each destination within your app and the connections between them.**

## Destination types

There are three general types of destinations: hosted, dialog, and activity. The following table outlines these three destination types and their purposes.

| Type      | Description                                                                                                                                 | Use cases                                                                                                 |
|-----------|---------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------|
| Hosted  | Fills the entire navigation host. That is, the size of a hosted destination is the same as the size of the navigation host and previous destinations are not visible. | Main and detail screens.                                                                                   |
| Dialog  | Presents overlay UI components. This UI is not tied to the location of the navigation host or its size. Previous destinations are visible underneath the destination. | Alerts, selections, forms.                                                                                 |
| Activity| Represents unique screens or features within the app.      

## Frameworks

Although the same general workflow applies in every case, **how exactly you create a navigation host and graph depends on the UI framework you use.**

### Compose

Use the NavHost composable. Add a `NavGraph` to it using the Kotlin DSL. You can create the graph in two ways:
    - **As part of the NavHost**: Construct the navigation graph directly as part of adding the NavHost.
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

> [!CAUTION]: Instead of passing a type to composable(), you can pass a route string or an integer id. However, this makes it much more difficult to manage passing additional arguments to the destination.


### Fragments:

When using fragments with the views UI framework, use a NavHostFragment as the host. There are several ways to create a navigation graph:
    - **Programmatically**: Use the Kotlin DSL to create a `NavGraph` and directly apply it on the NavHostFragment.
The `createGraph()` function used with the Kotlin DSL for both fragments and Compose is the same.
    - **XML**: Write your navigation host and graph directly in XML.


## Nested graphs

Login flows, wizards, or other subflows within your app are usually best represented as nested navigation graphs. By nesting self-contained subnavigation flows in this way, the main flow of your app's UI is easier to comprehend and manage.

### Compose

To create a nested navigation graph using Compose, use the `NavGraphBuilder.navigation()` function. You use `navigation()` just like `NavGraphBuilder.composable()` and `NavGraphBuilder.dialog()` functions when adding destinations to a graph.

The primary difference is that navigation creates a nested graph rather than a new destination. You then call `composable()` and `dialog()` within `navigation()`'s lambda to add destinations to the nested graph.

For example:

```kotlin
// Routes
@Serializable object Title
@Serializable object Register

// Route for nested graph
@Serializable object Game

// Routes inside nested graph
@Serializable object Match
@Serializable object InGame
@Serializable object ResultsWinner
@Serializable object GameOver

NavHost(navController, startDestination = Title) {
   composable<Title> {
       TitleScreen(
           onPlayClicked = { navController.navigate(route = Register) },
           onLeaderboardsClicked = { /* Navigate to leaderboards */ }
       )
   }
   composable<Register> {
       RegisterScreen(
           onSignUpComplete = { navController.navigate(route = Game) }
       )
   }
   navigation<Game>(startDestination = Match) {
       composable<Match> {
           MatchScreen(
               onStartGame = { navController.navigate(route = InGame) }
           )
       }
       composable<InGame> {
           InGameScreen(
               onGameWin = { navController.navigate(route = ResultsWinner) },
               onGameLose = { navController.navigate(route = GameOver) }
           )
       }
       composable<ResultsWinner> {
           ResultsWinnerScreen(
               onNextMatchClicked = {
                   navController.navigate(route = Match) {
                       popUpTo(route = Match) { inclusive = true }
                   }
               },
               onLeaderboardsClicked = { /* Navigate to leaderboards */ }
           )
       }
       composable<GameOver> {
           GameOverScreen(
               onTryAgainClicked = {
                   navController.navigate(route = Match) {
                       popUpTo(route = Match) { inclusive = true }
                   }
               }
           )
       }
   }
}
```

To navigate directly to a nested destination, use a route type as you would to any other destination. This is because routes are a global concept used to identify destinations that any screen can navigate to:

```kotlin
navController.navigate(route = Match)
```

>[!NOTE]
>You should encapsulate the creation of your destinations and navigation events in separate files.


### XML

This navigation graph has its own navigation elements along with its own ID and a startDestination attribute that points to the first destination in the nested graph:

```xml
<?xml version="1.0" encoding="utf-8"?>
<navigation xmlns:app="http://schemas.android.com/apk/res-auto"
   xmlns:tools="http://schemas.android.com/tools"
   xmlns:android="http://schemas.android.com/apk/res/android"
   app:startDestination="@id/mainFragment">
   <fragment
       android:id="@+id/mainFragment"
       android:name="com.example.cashdog.cashdog.MainFragment"
       android:label="fragment_main"
       tools:layout="@layout/fragment_main" >
       <action
           android:id="@+id/action_mainFragment_to_sendMoneyGraph"
           app:destination="@id/sendMoneyGraph" />
       <action
           android:id="@+id/action_mainFragment_to_viewBalanceFragment"
           app:destination="@id/viewBalanceFragment" />
   </fragment>
   <fragment
       android:id="@+id/viewBalanceFragment"
       android:name="com.example.cashdog.cashdog.ViewBalanceFragment"
       android:label="fragment_view_balance"
       tools:layout="@layout/fragment_view_balance" />
   <navigation android:id="@+id/sendMoneyGraph" app:startDestination="@id/chooseRecipient">
       <fragment
           android:id="@+id/chooseRecipient"
           android:name="com.example.cashdog.cashdog.ChooseRecipient"
           android:label="fragment_choose_recipient"
           tools:layout="@layout/fragment_choose_recipient">
           <action
               android:id="@+id/action_chooseRecipient_to_chooseAmountFragment"
               app:destination="@id/chooseAmountFragment" />
       </fragment>
       <fragment
           android:id="@+id/chooseAmountFragment"
           android:name="com.example.cashdog.cashdog.ChooseAmountFragment"
           android:label="fragment_choose_amount"
           tools:layout="@layout/fragment_choose_amount" />
   </navigation>
</navigation>
```

In your code, pass the resource ID of the action connecting the root graph to the nested graph:
```kotlin
view.findNavController().navigate(R.id.action_mainFragment_to_sendMoneyGraph)
```

Reference other navigation graphs with include:

Another way to modularize your graph structure is to include one graph within another using an `<include>` element in the parent navigation graph. This allows the included graph to be defined in a separate module or project altogether, which maximizes reusability.

```xml
<!-- (root) nav_graph.xml -->
<?xml version="1.0" encoding="utf-8"?>
<navigation xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:id="@+id/nav_graph"
    app:startDestination="@id/fragment">

    <strong><include app:graph="@navigation/included_graph" /></strong>

    <fragment
        android:id="@+id/fragment"
        android:name="com.example.myapplication.BlankFragment"
        android:label="Fragment in Root Graph"
        tools:layout="@layout/fragment_blank">
        <strong><action
            android:id="@+id/action_fragment_to_second_graph"
            app:destination="@id/second_graph" /></strong>
    </fragment>

    ...
</navigation>
```

```xml
<!-- included_graph.xml -->
<?xml version="1.0" encoding="utf-8"?>
<navigation xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    <strong>android:id="@+id/second_graph"</strong>
    app:startDestination="@id/includedStart">

    <fragment
        android:id="@+id/includedStart"
        android:name="com.example.myapplication.IncludedStart"
        android:label="fragment_included_start"
        tools:layout="@layout/fragment_included_start" />
</navigation>
```