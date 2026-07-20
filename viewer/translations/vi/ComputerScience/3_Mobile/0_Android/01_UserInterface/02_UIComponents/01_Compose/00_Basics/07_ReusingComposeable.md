# Tái sử dụng các thành phần kết hợp

## Tăng cường khả năng sử dụng lại với các công cụ sửa đổi

### 1. Truyền các công cụ sửa đổi để có thể sử dụng lại

Thành phần kết hợp phải chấp nhận `Modifier` làm tham số để có thể tùy chỉnh nó từ bên ngoài:

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

Giờ đây, các bố cục khác nhau có thể sửa đổi `UserNameField` nếu cần:

```kotlin
UserNameField(
    modifier = Modifier.width(400.dp).border(BorderStroke(2.dp, Color.Black)),
    username = identifier
) { identifier = it }
```

### 2. Tạo chuỗi Modifier có thể tái sử dụng

Thay vì lặp lại các công cụ sửa đổi tương tự, bạn có thể tạo các phiên bản `Modifier` có thể tái sử dụng:

```kotlin
val borderedModifier = Modifier
    .width(300.dp)
    .border(BorderStroke(2.dp, Color.Black))

UserNameField(
    modifier = borderedModifier,
    username = username
) { username = it }
```

## Đạt được bố cục linh hoạt: sử dụng bố cục dựa trên vị trí

Thay vì mã hóa cứng thành phần kết hợp, chúng tôi cho phép phương thức gọi chuyển bất kỳ thành phần kết hợp nào từ bên ngoài vào.

Ví dụ:

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

## Tạo các thành phần kết hợp có thể tái sử dụng bằng Generics

Trong Jetpack Compose, generic giúp tạo ra các thành phần UI linh hoạt.
Một ví dụ điển hình là một công cụ quay vòng (thả xuống) để chọn các tài khoản đã lưu (email hoặc điện thoại).
Thay vì tạo các công cụ quay vòng riêng biệt cho từng loại, chúng tôi sử dụng một công cụ quay vòng chung phù hợp cho cả hai loại.

Ví dụ về Mô hình dữ liệu:
- Tài khoản email
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
- Tài khoản điện thoại

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

## Máy quay chung Composable

Thay vì giới hạn công cụ quay vòng ở `EmailAccount`, chúng tôi đặt nó chung chung bằng cách sử dụng `<T>`:

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

## thẩm quyền giải quyết

- https://hyperskill.org/learn/step/41504


































