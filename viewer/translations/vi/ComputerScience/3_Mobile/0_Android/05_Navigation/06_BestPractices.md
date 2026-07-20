# Các phương pháp hay nhất về Navigation

## Đóng gói mã điều hướng của bạn

Khi sử dụng Kotlin DSL để xây dựng graph, việc lưu giữ các điểm đến và sự kiện điều hướng trong một tệp duy nhất có thể khó duy trì. 

### Compose 
- Bạn nên di chuyển mã dành riêng cho điều hướng vào một tệp riêng
- Sử dụng `internal` để giữ màn hình và loại tuyến đường ở chế độ riêng tư
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
- Hiển thị các điểm đến bằng cách tạo các chức năng mở rộng trên `NavGraphBuilder`

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

- Hiển thị các sự kiện điều hướng bằng cách tạo các chức năng mở rộng trên `NavController`

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
}
```


