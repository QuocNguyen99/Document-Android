# Navigation Best Practices

## Encapsulate your navigation code

When using the Kotlin DSL to construct your graph, keeping destinations and navigation events in a single file can be difficult to maintain. 

### Compose 
- You should move the navigation-specific code into a separate file
- Use `internal` to keep screens and route types private
```kotlin
// ContactScreens.kt

// Displays a list of contacts
@Composable
internal fun ContactsScreen(
  uiState: ContactsUiState,
  onNavigateToContactDetails: (contactId: String) -> Unit
) { ... }

// Displays the details for an individual contact
@Composable
internal fun ContactDetailsScreen(contact: ContactDetails) { ... }
```
- Expose destinations by creating extension functions on `NavGraphBuilder`

```kotlin
// ContactsNavigation.kt


@Serializable
object Contacts

// Adds contacts destination to `this` NavGraphBuilder
fun NavGraphBuilder.contactsDestination(
  // Navigation events are exposed to the caller to be handled at a higher level
  onNavigateToContactDetails: (contactId: String) -> Unit
) {
  composable<Contacts> {
    // The ViewModel as a screen level state holder produces the screen
    // UI state and handles business logic for the ConversationScreen
    val viewModel: ContactsViewModel = hiltViewModel()
    val uiState = viewModel.uiState.collectAsStateWithLifecycle()
    ContactsScreen(
      uiState,
      onNavigateToContactDetails
    )
  }
}



@Serializable
internal data class ContactDetails(val id: String)

fun NavGraphBuilder.contactDetailsScreen() {
  composable<ContactDetails> { navBackStackEntry ->
    ContactDetailsScreen(contact = navBackStackEntry.toRoute())
  }
}
```

- Expose navigation events by creating extension functions on `NavController`

```kotlin

// ContactsNavigation.kt
fun NavController.navigateToContactDetails(id: String) {
  navigate(route = ContactDetails(id = id))
}
```

```kotlin

// MyApp.kt

@Composable
fun MyApp() {
  ...
    NavHost(navController, startDestination = Contacts) {
     contactsDestination(onNavigateToContactDetails = { contactId ->
        navController.navigateToContactDetails(id = contactId)
     })
     contactDetailsDestination()
  }
```