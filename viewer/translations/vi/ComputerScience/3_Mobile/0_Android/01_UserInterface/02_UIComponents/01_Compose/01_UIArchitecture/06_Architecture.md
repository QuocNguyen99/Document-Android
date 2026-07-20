# Kiến trúc Compose UI của bạn 

Trong Compose, UI là immutable—không có cách nào để cập nhật nó sau khi được rút ra. Những gì bạn có thể kiểm soát là trạng thái của UI. Mỗi khi trạng thái của UI thay đổi, Compose sẽ tạo lại các phần của cây UI đã thay đổi.

<details>
  <summary style="color: orange;">
  <b>
  Thành phần kết hợp có thể chấp nhận trạng thái và hiển thị các sự kiện
  </b>
  </summary>
  
  <p>
 TextField chấp nhận một giá trị và hiển thị callback onValueChange yêu cầu trình xử lý callback thay đổi giá trị.

 ```kotlin
 var name by remember { mutableStateOf("") }
OutlinedTextField(
    value = name,
    onValueChange = { name = it },
    label = { Text("Name") }
)
```
Vì các thành phần kết hợp chấp nhận trạng thái và hiển thị các sự kiện nên mẫu unidirectional data flow rất phù hợp với Jetpack Compose. Hướng dẫn này tập trung vào cách triển khai mẫu unidirectional data flow trong Compose, cách triển khai các sự kiện và chủ sở hữu trạng thái cũng như cách làm việc với ViewModels trong Compose.

  </p>
</details>


> [!NOTE]
> Các lớp khác trong ứng dụng của bạn—data layer và lớp doanh nghiệp—không bị ảnh hưởng khi áp dụng Jetpack Compose. 

## Unidirectional data flow trong Jetpack Compose

[Xem thêm về Định nghĩa UDF](/General/DesignPattern/UnidirectionalDataFlow.md)

**Thành phần kết hợp hoạt động dựa trên trạng thái và sự kiện.**

<details>
  <summary style="color: orange;">
  <b>
  Ví dụ
  </b>
  </summary>
  
  <p>
 TextField chỉ được cập nhật khi tham số giá trị của nó được cập nhật và nó hiển thị onValueChange callback—một sự kiện yêu cầu thay đổi giá trị thành giá trị mới.
  </p>
</details>

Compose xác định đối tượng `State` là phần giữ giá trị và các thay đổi đối với giá trị trạng thái sẽ kích hoạt recomposition. Bạn có thể giữ trạng thái trong `remember { mutableStateOf(value) }` hoặc `rememberSaveable { mutableStateOf(value)` **tùy thuộc vào khoảng thời gian bạn cần nhớ giá trị.**

### Xác định các tham số có thể kết hợp

Khi xác định các tham số trạng thái của một thành phần kết hợp, bạn nên lưu ý các câu hỏi sau:

Thành phần kết hợp có thể tái sử dụng hoặc linh hoạt ở mức độ nào?
Các tham số trạng thái ảnh hưởng như thế nào đến hiệu suất của thành phần kết hợp này?
Để khuyến khích việc tách rời và tái sử dụng, mỗi thành phần kết hợp phải chứa ít thông tin nhất có thể. 


<details>
  <summary style="color: orange;">
  <b>
  Ví dụ: khi xây dựng một thành phần kết hợp để giữ tiêu đề của một bài báo, bạn nên chỉ chuyển thông tin cần hiển thị thay vì toàn bộ bài báo:
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

Đôi khi, việc sử dụng các tham số riêng lẻ cũng cải thiện hiệu suất—ví dụ: nếu `News` chứa nhiều thông tin hơn chỉ `title` và `subtitle`, bất cứ khi nào một phiên bản mới của `News` được chuyển vào `Header(news)`, thì thành phần kết hợp sẽ kết hợp lại, ngay cả khi `title` và `subtitle` không thay đổi.

  </p>
</details>


## Sự kiện trong Compose

Mọi thông tin đầu vào vào ứng dụng của bạn phải được thể hiện dưới dạng một sự kiện: lần nhấn, thay đổi văn bản và thậm chí cả bộ hẹn giờ hoặc các cập nhật khác. Vì những sự kiện này thay đổi trạng thái UI của bạn, **`ViewModel` sẽ là người xử lý chúng và cập nhật trạng thái UI.**

Lớp UI không bao giờ được thay đổi trạng thái bên ngoài trình xử lý sự kiện vì điều này có thể gây ra sự không nhất quán và lỗi trong ứng dụng của bạn.


Ưu tiên chuyển các giá trị immutable cho các lambda xử lý trạng thái và sự kiện. Cách tiếp cận này có những lợi ích sau:

- Bạn cải thiện khả năng sử dụng lại.
- Bạn đảm bảo rằng UI của bạn không thay đổi trực tiếp giá trị trạng thái.
- Bạn tránh được sự cố concurrency vì bạn đảm bảo rằng trạng thái không bị thay đổi từ một thread khác.
- Thông thường, bạn giảm độ phức tạp của mã.


<details>
  <summary style="color: orange;">
  <b>
  Ví dụ
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


## ViewModels, trạng thái và sự kiện: một ví dụ

Bằng cách sử dụng `ViewModel` và `mutableStateOf`, **bạn cũng có thể giới thiệu unidirectional data flow trong ứng dụng của mình nếu một trong những điều sau đây là đúng:**

- Trạng thái UI của bạn được hiển thị thông qua các chủ sở hữu trạng thái có thể quan sát được, như `StateFlow` hoặc `LiveData`.
- `ViewModel` xử lý các sự kiện đến từ UI hoặc các lớp khác trong ứng dụng của bạn và cập nhật state holder dựa trên các sự kiện.

<details>
  <summary style="color: orange;">
  <b>
  Ví dụ
  </b>
  </summary>
  
  <p>

khi triển khai màn hình đăng nhập, việc nhấn vào nút Đăng nhập sẽ khiến ứng dụng của bạn hiển thị vòng quay tiến trình và cuộc gọi mạng. Nếu đăng nhập thành công thì ứng dụng của bạn sẽ điều hướng đến một màn hình khác; trong trường hợp có lỗi, ứng dụng sẽ hiển thị Snackbar. Đây là cách bạn lập mô hình trạng thái màn hình và sự kiện:

Màn hình có 4 trạng thái:

- **Đã đăng xuất**: khi người dùng chưa đăng nhập.
- **Đang tiến hành**: khi ứng dụng của bạn hiện đang cố gắng đăng nhập người dùng bằng cách thực hiện cuộc gọi mạng.
- **Lỗi**: khi xảy ra lỗi khi đăng nhập.
- **Đã đăng nhập** in: khi người dùng đăng nhập.

Bạn có thể lập mô hình các trạng thái này dưới dạng sealed class. `ViewModel` hiển thị trạng thái dưới dạng `State`, đặt trạng thái ban đầu và cập nhật trạng thái nếu cần. `ViewModel` cũng xử lý sự kiện đăng nhập bằng cách hiển thị phương thức `onSignIn()`.

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


Ngoài mutableStateOf API, Compose còn cung cấp các tiện ích mở rộng cho LiveData, Flow và Có thể quan sát để đăng ký làm trình nghe và thể hiện giá trị dưới dạng trạng thái.

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






















