# Architecting your Compose UI 

In Compose the UI is immutable—there's no way to update it after it's been drawn. What you can control is the state of your UI. Every time the state of the UI changes, Compose recreates the parts of the UI tree that have changed.

<details>
  <summary style="color: orange;">
  <b>
  Composables can accept state and expose events
  </b>
  </summary>
  
  <p>
 a TextField accepts a value and exposes a callback onValueChange that requests the callback handler to change the value.

 ```kotlin
 var name by remember { mutableStateOf("") }
OutlinedTextField(
    value = name,
    onValueChange = { name = it },
    label = { Text("Name") }
)
```
Because composables accept state and expose events, the unidirectional data flow pattern fits well with Jetpack Compose. This guide focuses on how to implement the unidirectional data flow pattern in Compose, how to implement events and state holders, and how to work with ViewModels in Compose.

  </p>
</details>


> [!NOTE]
> The other layers of your app—the data layer and the business layer—are not affected by adopting Jetpack Compose. 

## Unidirectional data flow in Jetpack Compose

[See more about Definition of UDF](/General/DesignPattern/UnidirectionalDataFlow.md)

**Composables work based on state and events.**

<details>
  <summary style="color: orange;">
  <b>
  For example
  </b>
  </summary>
  
  <p>
 a TextField is only updated when its value parameter is updated and it exposes an onValueChange callback—an event that requests the value to be changed to a new one.
  </p>
</details>

Compose defines the `State` object as a value holder, and changes to the state value trigger a recomposition. You can hold the state in a `remember { mutableStateOf(value) }` or a `rememberSaveable { mutableStateOf(value)` **depending on how long you need to remember the value for.**

### Define composable parameters

When defining the state parameters of a composable you should keep the following questions in mind:

How reusable or flexible is the composable?
How do the state parameters affect this composable's performance?
To encourage decoupling and reuse, each composable should hold the least amount of information possible. 


<details>
  <summary style="color: orange;">
  <b>
  For example, when building a composable to hold the header of a news article, prefer passing in only the information that needs to be displayed, rather than the entire news article:
  </b>
  </summary>
  
  <p>

```kotlin
@Composable
fun Header(title: String, subtitle: String) {
    // Recomposes when title or subtitle have changed.
}

@Composable
fun Header(news: News) {
    // Recomposes when a new instance of News is passed in.
}
```

Sometimes, using individual parameters also improves performance—for example, if `News` contains more information than just `title` and `subtitle`, whenever a new instance of `News` is passed into `Header(news)`, the composable will recompose, even if `title` and `subtitle` haven't changed.

  </p>
</details>


## Events in Compose

Every input to your app should be represented as an event: taps, text changes, and even timers or other updates. As these events change the state of your UI, **the `ViewModel` should be the one to handle them and update the UI state.**

The UI layer should never change state outside of an event handler because this can introduce inconsistencies and bugs in your application.


Prefer passing immutable values for state and event handler lambdas. This approach has the following benefits:

- You improve reusability.
- You ensure that your UI doesn't change the value of the state directly.
- You avoid concurrency issues because you make sure that the state isn't mutated from another thread.
- Often, you reduce code complexity.


<details>
  <summary style="color: orange;">
  <b>
  For example
  </b>
  </summary>
  
  <p>
  
```kotlin
@Composable
fun MyAppTopAppBar(topAppBarText: String, onBackPressed: () -> Unit) {
    TopAppBar(
        title = {
            Text(
                text = topAppBarText,
                textAlign = TextAlign.Center,
                modifier = Modifier
                    .fillMaxSize()
                    .wrapContentSize(Alignment.Center)
            )
        },
        navigationIcon = {
            IconButton(onClick = onBackPressed) {
                Icon(
                    Icons.Filled.ArrowBack,
                    contentDescription = localizedString
                )
            }
        },
        // ...
    )
}
```

  </p>
</details>


## ViewModels, states, and events: an example

By using `ViewModel` and `mutableStateOf`, **you can also introduce unidirectional data flow in your app if one of the following is true:**

- The state of your UI is exposed via observable state holders, like `StateFlow` or `LiveData`.
- The `ViewModel` handles events coming from the UI or other layers of your app and updates the state holder based on the events.

<details>
  <summary style="color: orange;">
  <b>
  For example
  </b>
  </summary>
  
  <p>

when implementing a sign-in screen, tapping on a Sign in button should cause your app to display a progress spinner and a network call. If the login was successful, then your app navigates to a different screen; in case of an error the app shows a Snackbar. Here's how you would model the screen state and the event:

The screen has four states:

- **Signed out**: when the user hasn't signed in yet.
- **In progress**: when your app is currently trying to sign the user in by performing a network call.
- **Error**: when an error occurred while signing in.
- **Signed** in: when the user is signed in.

You can model these states as a sealed class. The `ViewModel` exposes the state as a `State`, sets the initial state, and updates the state as needed. The `ViewModel` also handles the sign-in event by exposing an `onSignIn()` method.

```kotlin
class MyViewModel : ViewModel() {
    private val _uiState = mutableStateOf<UiState>(UiState.SignedOut)
    val uiState: State<UiState>
        get() = _uiState

    // ...
}
```

  </p>
</details>


In addition to the mutableStateOf API, Compose provides extensions for LiveData, Flow, and Observable to register as a listener and represent the value as a state.

```kotlin
class MyViewModel : ViewModel() {
    private val _uiState = MutableLiveData<UiState>(UiState.SignedOut)
    val uiState: LiveData<UiState>
        get() = _uiState

    // ...
}

@Composable
fun MyComposable(viewModel: MyViewModel) {
    val uiState = viewModel.uiState.observeAsState()
    // ...
}

```






















