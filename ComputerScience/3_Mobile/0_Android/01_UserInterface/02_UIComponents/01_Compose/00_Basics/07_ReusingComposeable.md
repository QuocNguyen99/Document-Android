# Reusing Composables

## Enhancing reusability with modifiers

### 1. Passing Modifiers for Reusability

A composable should accept a `Modifier` as a parameter so it can be customized externally:

```kotlin
@Composable
fun UserNameField(
    modifier: Modifier = Modifier, // Accepts a modifier
    username: String,
    onUserNameChanged: (String) -> Unit
) {
    TextField(
        modifier = modifier, // Applies the modifier
        value = username,
        onValueChange = { onUserNameChanged(it) }
    )
}
```

Now, different layouts can modify `UserNameField` as needed:

```kotlin
UserNameField(
    modifier = Modifier.width(400.dp).border(BorderStroke(2.dp, Color.Black)),
    username = identifier
) { identifier = it }
```

### 2. Creating Reusable Modifier Chains

Instead of repeating the same modifiers, you can create reusable `Modifier` instances:

```kotlin
val borderedModifier = Modifier
    .width(300.dp)
    .border(BorderStroke(2.dp, Color.Black))

UserNameField(
    modifier = borderedModifier,
    username = username
) { username = it }
```

## Achieving flexible layouts: using slot-based layout

Instead of hardcoding composable, we allow the caller to pass in any composable from the outside.

Example:

```kotlin
@Composable
fun IdentifierField(
    modifier: Modifier = Modifier,
    identifier: String,
    label: String,
    placeholder: String,
    onIdentifierChange: (String) -> Unit,
    leadingIcon: @Composable () -> Unit // Accepts a custom composable
) {
    TextField(
        modifier = modifier.padding(10.dp),
        value = identifier,
        onValueChange = { onIdentifierChange(it) },
        label = { Text(text = label) },
        placeholder = { Text(text = placeholder) },
        leadingIcon = { leadingIcon() } // Calls the provided composable
    )
}
```

## Making Reusable Composables with Generics

In Jetpack Compose, generics help create flexible UI components.
A great example is a spinner (dropdown) for selecting saved accounts (email or phone).
Instead of making separate spinners for each type, we use one generic spinner that works for both.

Example of Data Model:
- Email Account
```kotlin
data class EmailAccount(
    val email: String,
    val name: String,
    val profileImageUrl: String? = null,
    val lastLoginDate: String? = null
) {
    override fun toString() = "$name \n $email"
}
```
- Phone Account

```kotlin
data class PhoneAccount(
    val phoneNumber: String,
    val name: String,
    val countryCode: String? = null,
    val isTwoFactorEnabled: Boolean = false
) {
    override fun toString() = "$name \n $phoneNumber"
}
```

## Generic Spinner Composable

Instead of limiting the spinner to `EmailAccount`, we make it generic using `<T>`:

```kotlin
@Composable
fun <T> AccountSpinner(
    items: List<T>,
    selectedItem: T?,
    onItemSelected: (T) -> Unit
) {
    var expanded by remember { mutableStateOf(false) }

    Row {
        DropdownMenu(expanded = expanded, onDismissRequest = { expanded = false }) {
            items.forEach { item ->
                DropdownMenuItem(
                    onClick = { 
                        onItemSelected(item)
                        expanded = false 
                    },
                    modifier = Modifier.padding(4.dp),
                    text = { Text(item.toString()) } // Displays name + email/phone
                )
            }
        }

        OutlinedTextField(
            value = selectedItem?.toString() ?: "",
            onValueChange = {},
            readOnly = true,
            label = { Text("Select Account") },
            trailingIcon = {
                IconButton(onClick = { expanded = !expanded }) {
                    Icon(Icons.Default.ArrowDropDown, contentDescription = null)
                }
            }
        )
    }
}
```

## reference

- https://hyperskill.org/learn/step/41504


































