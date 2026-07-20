# Tác dụng phụ trong Compose 

Đôi khi, các tác dụng phụ là cần thiết, chẳng hạn như **để kích hoạt sự kiện chỉ diễn ra một lần** chẳng hạn như hiển thị thanh thông tin nhanh hoặc điều hướng đến một màn hình khác với một điều kiện trạng thái nhất định. Những hành động này phải được gọi từ một môi trường được kiểm soát có nhận biết về lifecycle của thành phần kết hợp. Trong trang này, bạn sẽ tìm hiểu về các API tác dụng phụ khác nhau mà Jetpack Compose cung cấp.

Khi bạn cần thay đổi trạng thái của ứng dụng. **bạn nên sử dụng API hiệu ứng để các tác dụng phụ đó được thực thi theo cách có thể dự đoán được.**


##LaunchedEffect
chạy các hàm tạm ngưng trong phạm vi của một thành phần kết hợp

Để gọi các hàm tạm ngưng một cách an toàn từ bên trong một thành phần kết hợp, hãy sử dụng thành phần kết hợp LaunchedEffect. Khi LaunchedEffect nhập Composition, nó sẽ khởi chạy một coroutine với khối mã được truyền dưới dạng tham số. Coroutine sẽ bị hủy nếu LaunchedEffect rời khỏi composition. Nếu LaunchedEffect được kết hợp lại bằng các khóa khác nhau (xem phần Hiệu ứng khởi động lại bên dưới), coroutine hiện tại sẽ bị hủy và chức năng tạm dừng mới sẽ được khởi chạy trong một coroutine mới.

Ví dụ

```kotlin
@Composable
fun MyScreen(
    state: UiState<List<Movie>>,
    snackbarHostState: SnackbarHostState
) {

    // If the UI state contains an error, show snackbar
    if (state.hasError) {

        // `LaunchedEffect` will cancel and re-launch if
        // `scaffoldState.snackbarHostState` changes
        LaunchedEffect(snackbarHostState) {
            // Show snackbar using a coroutine, when the coroutine is cancelled the
            // snackbar will automatically dismiss. This coroutine will cancel whenever
            // `state.hasError` is false, and only start when `state.hasError` is true
            // (due to the above if-check), or if `scaffoldState.snackbarHostState` changes.
            snackbarHostState.showSnackbar(
                message = "Error message",
                actionLabel = "Retry message"
            )
        }
    }

    Scaffold(
        snackbarHost = {
            SnackbarHost(hostState = snackbarHostState)
        }
    ) { contentPadding ->
        // ...
    }
}
```
Trong đoạn mã trên, một coroutine được kích hoạt nếu trạng thái có lỗi và nó sẽ bị hủy khi không có lỗi. Vì trang gọi LaunchedEffect nằm trong câu lệnh if nên khi câu lệnh sai, nếu LaunchedEffect nằm trong Composition thì nó sẽ bị xóa và do đó, coroutine sẽ bị hủy.

##rememberCoroutineScope

Nhận phạm vi nhận biết composition để khởi chạy coroutine bên ngoài một thành phần kết hợp

`LaunchedEffect` là một hàm tổng hợp, có nghĩa là nó chỉ có thể được sử dụng bên trong các hàm tổng hợp khác. Tuy nhiên, trong một số trường hợp, bạn có thể muốn chạy một coroutine bên ngoài một hàm có thể kết hợp, nhưng vẫn muốn nó được tự động hủy khi rời khỏi composition. Trong trường hợp này, bạn có thể sử dụng `rememberCoroutineScope`.

`rememberCoroutineScope` cũng được sử dụng khi bạn cần kiểm soát vòng đời của một hoặc nhiều coroutine theo cách thủ công, ví dụ như hủy bỏ một hoạt ảnh khi xảy ra sự kiện của người dùng.

Ví dụ:

```kotlin
@Composable
fun MoviesScreen(snackbarHostState: SnackbarHostState) {

    // Creates a CoroutineScope bound to the MoviesScreen's lifecycle
    val scope = rememberCoroutineScope()

    Scaffold(
        snackbarHost = {
            SnackbarHost(hostState = snackbarHostState)
        }
    ) { contentPadding ->
        Column(Modifier.padding(contentPadding)) {
            Button(
                onClick = {
                    // Create a new coroutine in the event handler to show a snackbar
                    scope.launch {
                        snackbarHostState.showSnackbar("Something happened!")
                    }
                }
            ) {
                Text("Press me")
            }
        }
    }
}
```

##rememberUpdatedState

tham chiếu một giá trị trong hiệu ứng không nên khởi động lại nếu giá trị thay đổi
(tham chiếu đến một giá trị trong một hiệu ứng mà không nên khởi động lại nếu giá trị đó thay đổi.)

LaunchedEffect sẽ khởi động lại sau một lần thay đổi khóa tham số. Tuy nhiên, trong một số vấn đề, bạn có thể muốn nhận được một giá trị trong ứng dụng hiệu quả của mình nhưng nếu nó thay đổi, bạn không muốn hiệu ứng khởi động lại. Để thực hiện điều này, bạn cần sử dụng `rememberUpdatedState` để tạo một tham chiếu đến giá trị này có thể được chụp và cập nhật. Phương pháp này hữu ích cho các ứng dụng chứa các hoạt động kéo dài có thể tốn kém hoặc không thể tạo và khởi động lại.

Ví dụ: giả sử ứng dụng của bạn có một biến `LandingScreen` bị mất sau một thời gian. Ngay khi `LandingScreen` được tái tạo, hiệu ứng chờ một thời gian và thông báo rằng thời gian đã trôi qua nên không thể khởi động lại.

```kotlin
@Composable
fun LandingScreen(onTimeout: () -> Unit) {

    // This will always refer to the latest onTimeout function that
    // LandingScreen was recomposed with
    val currentOnTimeout by rememberUpdatedState(onTimeout)

    // Create an effect that matches the lifecycle of LandingScreen.
    // If LandingScreen recomposes, the delay shouldn't start again.
    LaunchedEffect(true) {
        delay(SplashWaitTimeMillis)
        currentOnTimeout()
    }

    /* Landing screen content */
}
```

##DisposableEffect

Các hiệu ứng yêu cầu **dọn dẹp**

> [!NOTE]
> Hiệu ứng này dùng để thực hiện một hành động trước khi bắt đầu thiết lập lại khi kích hoạt thay đổi, chẳng hạn như trong ví dụ khi lifecycleOwner thay đổi nó sẽ chạy đoạn Dispose trước khi thêm lại người quan sát mới

Đối với các tác dụng phụ cần được giải quyết sau khi thay đổi khóa hoặc nếu thành phần kết hợp rời khỏi Composition, hãy sử dụng DisposableEffect. Nếu các khóa `DisposableEffect` thay đổi, thành phần kết hợp cần loại bỏ (làm sạch) hiệu ứng hiện tại và đặt lại bằng cách gọi lại hiệu ứng.

Ví dụ: bạn có thể muốn gửi các sự kiện phân tích dựa trên các sự kiện Lifecycle bằng cách sử dụng LifecycleObserver. Để lắng nghe những sự kiện đó trong Compose, hãy sử dụng `DisposableEffect` để đăng ký và hủy đăng ký người quan sát khi cần.

```kotlin
@Composable
fun HomeScreen(
    lifecycleOwner: LifecycleOwner = LocalLifecycleOwner.current,
    onStart: () -> Unit, // Send the 'started' analytics event
    onStop: () -> Unit // Send the 'stopped' analytics event
) {
    // Safely update the current lambdas when a new one is provided
    val currentOnStart by rememberUpdatedState(onStart)
    val currentOnStop by rememberUpdatedState(onStop)

    // If `lifecycleOwner` changes, dispose and reset the effect
    DisposableEffect(lifecycleOwner) {
        // Create an observer that triggers our remembered callbacks
        // for sending analytics events
        val observer = LifecycleEventObserver { _, event ->
            if (event == Lifecycle.Event.ON_START) {
                currentOnStart()
            } else if (event == Lifecycle.Event.ON_STOP) {
                currentOnStop()
            }
        }

        // Add the observer to the lifecycle
        lifecycleOwner.lifecycle.addObserver(observer)

        // When the effect leaves the Composition, remove the observer
        onDispose {
            lifecycleOwner.lifecycle.removeObserver(observer)
        }
    }

    /* Home screen content */
}
```

##SideEffect

Để chia sẻ trạng thái Compose với các đối tượng không được quản lý bởi soạn thư


 Sử dụng `SideEffect` **đảm bảo rằng hiệu ứng sẽ được thực thi sau mỗi recomposition** thành công. Mặt khác, **việc thực hiện hiệu ứng trước khi đảm bảo recomposition thành công là không chính xác, đó là trường hợp khi ghi hiệu ứng trực tiếp vào một thành phần kết hợp.**

Ví dụ: thư viện phân tích của bạn có thể cho phép bạn phân đoạn nhóm người dùng bằng cách đính kèm siêu dữ liệu tùy chỉnh ("thuộc tính người dùng" trong ví dụ này) vào tất cả các sự kiện phân tích tiếp theo. Để truyền đạt loại người dùng của người dùng hiện tại tới thư viện phân tích của bạn, hãy sử dụng SideEffect để cập nhật giá trị của nó.

```kotlin
@Composable
fun rememberFirebaseAnalytics(user: User): FirebaseAnalytics {
    val analytics: FirebaseAnalytics = remember {
        FirebaseAnalytics()
    }

    // On every successful composition, update FirebaseAnalytics with
    // the userType from the current User, ensuring that future analytics
    // events have this metadata attached
    SideEffect {
        analytics.setUserProperty("userType", user.userType)
    }
    return analytics
}
```
##produceState

chuyển đổi trạng thái không phải Compose thành trạng thái Compose

`produceState` khởi chạy một coroutine trong phạm vi Composition có thể đẩy các giá trị vào `State` được trả về. Sử dụng nó để chuyển đổi trạng thái không phải Compose thành trạng thái Compose, ví dụ như đưa trạng thái theo hướng đăng ký bên ngoài như `Flow`, `LiveData` hoặc `RxJava` vào Composition.

Nhà sản xuất được khởi chạy khi produceState vào Composition và sẽ bị hủy khi rời khỏi Composition. Trạng thái trở về kết hợp; đặt cùng một giá trị sẽ không kích hoạt recomposition.

Mặc dù produceState tạo một coroutine nhưng nó cũng có thể được sử dụng để quan sát các nguồn dữ liệu không bị treo. Để xóa đăng ký nguồn đó, hãy sử dụng chức năng awaitDispose.

Ví dụ

```kotlin
@Composable
fun loadNetworkImage(
    url: String,
    imageRepository: ImageRepository = ImageRepository()
): State<Result<Image>> {

    // Creates a State<T> with Result.Loading as initial value
    // If either `url` or `imageRepository` changes, the running producer
    // will cancel and will be re-launched with the new inputs.
    return produceState<Result<Image>>(initialValue = Result.Loading, url, imageRepository) {

        // In a coroutine, can make suspend calls
        val image = imageRepository.load(url)

        // Update State with either an Error or Success result.
        // This will trigger a recomposition where this State is read
        value = if (image == null) {
            Result.Error
        } else {
            Result.Success(image)
        }
    }
}
```

##derivedStateOf

chuyển đổi một hoặc nhiều đối tượng trạng thái sang trạng thái khác

Trong Compose, quá trình biên soạn lại xảy ra mỗi khi một trạng thái đối tượng được quan sát hoặc đầu vào dữ liệu của việc thay đổi kết hợp thành phần. Trạng thái hoặc đầu vào đối tượng có thể thay đổi thường xuyên hơn giao diện người dùng thực sự cần được cập nhật, dẫn đến việc kết nối lại là không cần thiết.

Bạn nên sử dụng hàm `derStateOf` **khi thông tin đầu vào của một kết hợp thành phần thay đổi thường xuyên hơn mức bạn cần phải chỉnh sửa lại**. Điều này thường xảy ra khi một nội dung nào đó thường xuyên thay đổi, nghĩ ra giới hạn như vị trí cuộn, nhưng có thể kết hợp chỉ cần phản ứng với nội dung đó khi vượt qua một ngưỡng nhất định. có nguồn gốcStateOf tạo một trạng thái đối tượng Compose mới mà bạn có thể theo dõi đối tượng được tìm thấy chỉ với số lượng cập nhật mà bạn cần. Theo cách này, nó hoạt động tương tự như toán tử Kotlin Flows DifferentUntilChanged().

>[!CAUTION]
> chỉ nên sử dụng `derivedStateOf` **khi cần thiết để tránh việc recomposition không cần thiết**, và hãy nhớ rằng việc tính toán `derivedStateOf` có thể đủ hiệu quả.

**Sử dụng đúng**

Đoạn mã sau đây hiển thị trường hợp sử dụng thích hợp cho derivedStateOf:

```kotlin
@Composable
// When the messages parameter changes, the MessageList
// composable recomposes. derivedStateOf does not
// affect this recomposition.
fun MessageList(messages: List<Message>) {
    Box {
        val listState = rememberLazyListState()

        LazyColumn(state = listState) {
            // ...
        }

        // Show the button if the first visible item is past
        // the first item. We use a remembered derived state to
        // minimize unnecessary compositions
        val showButton by remember {
            derivedStateOf {
                listState.firstVisibleItemIndex > 0
            }
        }

        AnimatedVisibility(visible = showButton) {
            ScrollToTopButton()
        }
    }
}
```

Trong đoạn mã này, firstVisibleItemIndex thay đổi bất cứ khi nào mục hiển thị đầu tiên thay đổi. Khi bạn cuộn, giá trị trở thành 0, 1, 2, 3, 4, 5, v.v. Tuy nhiên, việc kết hợp lại chỉ cần xảy ra nếu giá trị lớn hơn 0. Tần suất cập nhật không phù hợp có nghĩa đây là trường hợp sử dụng tốt cho `derivedStateOf` 

**Sử dụng không đúng**


Một lỗi phổ biến là cho rằng, khi bạn kết hợp hai đối tượng trạng thái Compose, bạn nên sử dụng `derivedStateOf` vì bạn đang "trạng thái dẫn xuất". Tuy nhiên, đây hoàn toàn là chi phí chung và không bắt buộc, như được hiển thị trong đoạn mã sau:

```kotlin
// DO NOT USE. Incorrect usage of derivedStateOf.
var firstName by remember { mutableStateOf("") }
var lastName by remember { mutableStateOf("") }

val fullNameBad by remember { derivedStateOf { "$firstName $lastName" } } // This is bad!!!
val fullNameCorrect = "$firstName $lastName" // This is correct
```
Trong đoạn mã này, fullName cần cập nhật thường xuyên như FirstName và LastName. Do đó, không cần thiết phải có sự kết hợp lại quá trình xảy ra và việc sử dụng `deredStateOf`.

##snapshotFlow

chuyển đổi Trạng thái của Compose thành Luồng

Sử dụng snapshotFlow để chuyển đổi các đối tượng State<T> thành Flow lạnh.
`snapshotFlow` chạy khối của nó khi được thu thập và phát ra kết quả của các đối tượng `State` được đọc trong đó., Flow sẽ phát ra giá trị mới cho bộ thu thập của nó nếu giá trị mới không bằng giá trị được phát ra trước đó (hành vi này tương tự như của Flow.distinctUntilChanged).

```kotlin
val listState = rememberLazyListState()

LazyColumn(state = listState) {
    // ...
}

LaunchedEffect(listState) {
    snapshotFlow { listState.firstVisibleItemIndex }
        .map { index -> index > 0 }
        .distinctUntilChanged()
        .filter { it == true }
        .collect {
            MyAnalyticsService.sendScrolledPastFirstItemEvent()
        }
}
```

