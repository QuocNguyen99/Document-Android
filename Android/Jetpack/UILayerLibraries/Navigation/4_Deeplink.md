# Deeplink

In Android, a deep link is a link that takes you directly to a specific destination within an app.

The Navigation component lets you create two different types of deep links: **explicit and implicit.**

## Create an explicit deep link

An explicit deep link is a single instance of a deep link that uses a `PendingIntent` to take users to a specific location within your app. 

When a user opens your app via an explicit deep link, the navigation stack is cleared and replaced with the destination of the deep link. If you are using nested graphs, the start destination from each level of the nested graphs is also added to the stack. This means that when a user presses the Back button from the deep link destination, they will navigate back through the start destinations of the nested graphs, just as if they had entered your app from the main entry point.

You can use the `NavDeepLinkBuilder` class to construct a `PendingIntent`, as shown in the example below. Note that if the provided context is not an `Activity`, the constructor uses `PackageManager.getLaunchIntentForPackage()` as the default activity to launch, if available.


```kotlin
val pendingIntent = NavDeepLinkBuilder(context)
    .setGraph(R.navigation.nav_graph)
    .setDestination(R.id.android)
    .setArguments(args)
    .createPendingIntent()
```

By default, `NavDeepLinkBuilder` **launches your explicit deep link into the default launch Activity that is declared in your app's manifest**. If your NavHost is in another activity, you must specify its component name when creating the deep link builder:

```kotlin
val pendingIntent = NavDeepLinkBuilder(context)
    .setGraph(R.navigation.nav_graph)
    .setDestination(R.id.android)
    .setArguments(args)
    .setComponentName(DestinationActivity::class.java)
    .createPendingIntent()
```

If you have an existing `NavController`, you can also create a deep link by using `NavController.createDeepLink()`.

> [!CAUTION]
> These APIs allow deep linking to any screen in your app. If a screen requires that the user perform some action, such as logging in, before they can access that screen, follow the guidance on Conditional Navigation to conditionally redirect the user when they reach that screen using a deep link.

## Create an implicit deep link

An implicit deep link refers to a specific destination in an app. When the deep link is invoked—for example, when a user clicks a link—Android can then open your app to the corresponding destination.

Deep links can be matched by URI, intent actions, and MIME types. You can specify multiple match types for a single deep link, **but note that URI argument matching is prioritized first, followed by action, and then MIME type.**

Example:

```xml
<fragment android:id="@+id/a"
          android:name="com.example.myapplication.FragmentA"
          tools:layout="@layout/a">
        <deepLink app:uri="www.example.com"
                app:action="android.intent.action.MY_ACTION"
                app:mimeType="type/subtype"/>
</fragment>
```


When apply the info for implicit deep link Note the following:

- URIs without a scheme are assumed as either http or https. For example, `www.google.com` matches both `http://www.google.com` and `https://www.google.com`.
- Path parameters, represented as `{placeholder_name}`, match one or more characters (e.g., `http://www.example.com/users/{id}` matches `http://www.example.com/users/4`), and the Navigation component attempts to parse them into defined argument types, defaulting to String if no matching argument is found.
- Query parameter placeholders can be used alongside path parameters (e.g., `http://www.example.com/users/{id}?myarg={myarg}` matches `http://www.example.com/users/4?myarg=28`).
- Query parameters with default or nullable values are optional (e.g., `http://www.example.com/users/{id}?arg1={arg1}&arg2={arg2}` matches `http://www.example.com/users/4?arg2=28`).
- Extraneous query parameters do not affect URI matching (e.g., `http://www.example.com/users/{id}` matches `http://www.example.com/users/4?extraneousParam=7`).

To enable implicit deep linking, you must also make additions to your app's `Manifest.xml` file. Add a single `<nav-graph>` element to an activity that points to an existing navigation graph, as shown in the following example:


```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.example.myapplication">

    <application ... >

        <activity name=".MainActivity" ...>
            ...

            <nav-graph android:value="@navigation/nav_graph" />

            ...

        </activity>
    </application>
</manifest>
```
When building your project, the Navigation component replaces the `<nav-graph>` element with generated `<intent-filter>` elements to match all of the deep links in the navigation graph.

When triggering an implicit deep link, **the state of the back stack depends on whether the implicit Intent was launched** with the `Intent.FLAG_ACTIVITY_NEW_TASK` flag:

- **When the flag is set**: The task back stack is cleared and replaced with the deep link destination. The start destination from each level of nested graphs is added to the stack, allowing users to navigate back through the stack as if they entered the app from the main entry point.

- **When the flag is not set**: The task stack remains on the previous app where the implicit deep link was triggered. Pressing the Back button returns the user to the previous app, while the Up button starts the app's task at the parent destination within the navigation graph.


## Handling deep links

It is strongly recommended to always use the default `launchMode` of `standard` when using Navigation. **When using standard launch mode, Navigation automatically handles deep links** by calling `handleDeepLink()` to process any explicit or implicit deep links within the Intent. However, this does not happen automatically if the `Activity` is re-used when using an alternate `launchMode` such as `singleTop`. In this case, it is necessary to manually call `handleDeepLink()` in `onNewIntent()`, as shown in the following example:

```kotlin
override fun onNewIntent(intent: Intent?) {
    super.onNewIntent(intent)
    navController.handleDeepLink(intent)
}
```
