# State in Jetpack Compose

Có ba cách chính để lắng nghe sự thay đổi của giá trị bên trong một Composable trong Jetpack Compose:

1. Sử dụng mutableStateOf: Đây là cách phổ biến nhất để lắng nghe sự thay đổi của giá trị. Khi giá trị thay đổi, tất cả các Composable đang lắng nghe giá trị đó sẽ được recompose.

```kotlin
var count by remember { mutableStateOf(0) }
```
2. Sử dụng rememberSaveable: rememberSaveable giống như remember, nhưng nó còn lưu trữ trạng thái qua các recomposition. Điều này hữu ích khi bạn muốn lưu trữ trạng thái của một Composable qua các thay đổi cấu hình, chẳng hạn như khi xoay màn hình.

```kotlin
var count by rememberSaveable { mutableStateOf(0) }
```
3. Sử dụng derivedStateOf: derivedStateOf cho phép bạn tạo ra một trạng thái phụ thuộc vào một hoặc nhiều trạng thái khác. Khi bất kỳ trạng thái nào mà nó phụ thuộc vào thay đổi, trạng thái được tạo ra bởi derivedStateOf cũng sẽ thay đổi, và tất cả các Composable đang lắng nghe trạng thái đó sẽ được recompose.

```kotlin
val count1 by remember { mutableStateOf(0) }
val count2 by remember { mutableStateOf(0) }
val sum by derivedStateOf { count1 + count2 }
```


Lưu ý rằng, để lắng nghe sự thay đổi của giá trị, bạn cần đảm bảo rằng Composable đang lắng nghe giá trị đó được recompose khi giá trị thay đổi. Điều này thường được thực hiện bằng cách đặt Composable đó trong một LaunchedEffect, DisposableEffect, hoặc một Composable khác mà lắng nghe sự thay đổi của giá trị.