# Hiệu suất trong Jetpack Compose

## 1. Các đối tượng không ổn định trên lớp UI.

Điều gì được compiler coi là ổn định?
- Tất cả các loại giá trị nguyên thủy: Boolean, Int, Long, Float, Char, v.v.
- Dây
- Lambdas (không phải luôn luôn, chúng ta sẽ đề cập đến nó sau)

Thực tiễn tốt nhất:
1. Đừng sử dụng var khi tìm kiếm sự ổn định. Các trường được khai báo là var được coi là không ổn định

```kotlin
data class User(val id: Long, val name: String, var isSelected: Boolean)
```

2. Không phải tất cả lambda đều được coi là ổn định. Hãy xem các ví dụ sau

```kotlin
@Composable
fun UnstableLambdaScreen(viewModel: TypicalViewModel = hiltViewModel()) {
    Column {
        // button is not skippable due to usage of viewModel.onContinueClick()
        Button(onClick = { viewModel.onContinueClick() }) {
            Text(text = "button with unstable lambda")
        }
    }
}
```


```kotlin
@Composable
fun UnstableLambdaScreen() {
    val focusRequester = LocalFocusManager.current

    Column {
        // unstable lambda results in unskippable Button
        Button(onClick = { focusRequester.clearFocus() }) {
            Text(text = "button with unstable lambda")
        }
    }
}
```

Vì lambda nắm bắt các phạm vi bên ngoài nên chúng sẽ không tự động được suy ra là ổn định và được sử dụng lại như mong đợi. 

Nếu lambda yêu cầu quyền truy cập vào các biến bên ngoài, compiler sẽ thêm các biến đó dưới dạng trường, được chuyển vào hàm tạo của lambda. Chúng ta có 2 cách để giải quyết tình huống này.

3. Sử dụng tham chiếu, nó sẽ ngăn việc tạo lớp mới tham chiếu biến bên ngoài:

```kotlin
@Composable
fun UnstableLambdaScreen(viewModel: TypicalViewModel = hiltViewModel()) {

    Column {
        // stable
        Button(onClick = viewModel::onContinueClick) {
            Text(text = "button with stable lambda")
        }
    }
} 
```

Cách tiếp cận ở trên rất hiệu quả đối với các tình huống đơn giản, nhưng đôi khi bạn phải thực hiện một vài lệnh gọi hàm bên trong. Trong những trường hợp như vậy, chúng ta có thể sử dụng lambdas đã ghi nhớ.

4. Việc ghi nhớ rõ ràng các lambda sẽ đảm bảo rằng chúng ta sử dụng lại cùng một phiên bản lambda trong các lần kết hợp lại.

```kotlin
@Composable
fun UnstableLambdaScreen(viewModel: TypicalViewModel = hiltViewModel()) {
    val focusRequester = LocalFocusManager.current
    val onNameEnteredClick: (value: String) -> Unit = remember {
        return@remember viewModel::onNameEntered
    }
    val clearFocus = remember { { focusRequester.clearFocus() } }
    
    Column {
        // stable lambdas, skippable button
        Button(onClick = {
            onNameEnteredClick("..")
            clearFocus()
            someTopLvlFunction()
        }) {
            Text(text = "button with stable lambdas")
        }
    }
}

// top lvl functions without unstable params are stable
fun someTopLvlFunction() {

}
```
Không cần niềng răng đôi trong clearFocus trừ khi bạn cần chuyển nó dưới dạng hàm.

5. Trong trường hợp bạn cần sử dụng một đối tượng từ thư viện hoặc dự án nhiều mô-đun trên lớp UI, bạn cần kiểm tra kỹ xem nó có được đánh dấu là ổn định hay không.

```kotlin
// Create your own classes and map from & to them;
// not skippable if User is unstable
@Composable
private fun UserDetails(user: User) {
    Text(text = "name: ${user.name} id:${user.id}")
}

/** 
Pass stable fields directly to the composable which needs them,
so instead of passing user class you pass it’s primitives: 
user.id, user.name

Use a wrapper class marked with @Immutable annotation
**/

@Immutable
data class ImmutableUserWrapper(val user: User)

@Composable
private fun UserDetails(wrapper: ImmutableUserWrapper) {
    Text(text = "name: ${wrapper.user.name} id:${wrapper.user.id}")
}
```

6. Collection không ổn định. Danh sách Kotlin ở dạng chỉ đọc chứ không phải immutable, vì vậy chúng ta có thể sử dụng:

Tạo trình bao bọc cho danh sách, giống như chúng tôi đã làm khi xử lý các thực thể từ các mô-đun khác và sử dụng nó trên lớp UI:


```kotlin
@Immutable
class ImmutableListWrapper(val items: List<Int>)

// optimized using @Immutable marked ImmutableWrapper
@Composable
private fun WrappedLazyColumnApproach1(wrapper: ImmutableListWrapper) {
    LazyColumn {
        items(items = wrapper.items, key = { item -> item }) { item ->
            Text(text = "item $item")
        }
    }
}
```

Sử dụng collection immutable `from kotlinx.collections.immutable`.
Nó có sẵn dưới dạng phụ thuộc.

```kotlin

@Composable
private fun WrappedLazyColumnApproach2(items: ImmutableList<Int>) {
   LazyColumn {
        items(items = items, key = { item -> item }) { item ->
            Text(text = "item $item")
        }
    }
}
```

## 2. Thành phần kết hợp nội tuyến

Điều quan trọng cần lưu ý là Cột, Hàng & Hộp được nội tuyến, nghĩa là chúng không tạo phạm vi đọc trạng thái riêng mà chỉ sử dụng phạm vi gốc. 
Khi trạng thái được đọc, nó sẽ kích hoạt recomposition trong phạm vi gần nhất.

Điều này có thể được khắc phục bằng cách sau:

```kotlin

@Composable
fun StateReadsInlinedComposablesScreen() {
    var count by remember { mutableStateOf(0) }

    WrappedColumn {
        Text(text = "count: $count")
        Button(onClick = { count++ }) {
            Text(text = "increase count")
        }
    }
}
@Composable
fun WrappedColumn(content: @Composable ColumnScope.() -> Unit) {
    Column(content = content)
}
```
Có một cách tiếp cận khác để khắc phục điều này ở điểm tiếp theo.

## 3. Trạng thái đọc từ phạm vi quá cao

Ví dụ trên minh họa điều gì sẽ xảy ra nếu việc đọc trạng thái được thực hiện sai phạm vi. 
Chúng tôi có thể cung cấp phạm vi đọc nhỏ hơn khi sử dụng lambda trả về giá trị thay vì chuyển giá trị trực tiếp vào các thành phần kết hợp. 
Hãy thử điều này trên ví dụ trước:

```kotlin

@Composable
fun StateReadsInlinedComposablesSolution2Screen() {
    var count by remember { mutableStateOf(0) }
    Column {
        TextWrapper(provideCount = { count })
        Button(onClick = { count++ }) {
            Text(text = "count++")
        }
    }
}
@Composable
fun TextWrapper(provideCount: () -> Int) {
    Text(text = "Count: ${provideCount()}")
}
```
Truyền lambda vào `TextWrapper` để lấy giá trị khi cần,
tạo phạm vi đọc trạng thái cho phép chúng tôi nhận được kết quả tương tự trong trường hợp chính xác này, nghĩa là chúng tôi thậm chí không cần sử dụng `ColumnWrapper` như chúng tôi đã làm trước đây.

## 4. Sử dụng công cụ sửa đổi lambda bất cứ khi nào có thể

Bằng cách chuyển sang phiên bản lambda của công cụ sửa đổi, bạn có thể đảm bảo hàm này đọc trạng thái cuộn trong giai đoạn bố cục.

Do đó, khi trạng thái cuộn thay đổi, Compose có thể bỏ qua hoàn toàn giai đoạn composition và chuyển thẳng sang giai đoạn bố cục.

## 5. Khi nào nên sử dụng `remember { }`?
- Đối với bất kỳ thao tác nào có thể được thực hiện nhiều lần, **nhưng không nên** cho đến khi khóa được chuyển trong phần ghi nhớ thay đổi.
- Khi sử dụng các đối tượng không được compiler coi là ổn định, bao gồm cả lambdas không ổn định.
- Đối với các lambda không ổn định như clickable, Navigation...










