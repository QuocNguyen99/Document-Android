# Side-effects in Compose 
>[!NOTE]
>Trong Jetpack Compose, một trong những tình huống phổ biến nhất mà các hiện tượng Side-Effects có thể xảy ra là bên trong một hàm Composable. Khác với các hàm bình thường, các hàm Composable có thể được gọi lại để cập nhật giao diện người dùng do các kích hoạt khác nhau, chẳng hạn như việc recomposition. Do đó, thực hiện logic miền trực tiếp bên trong các hàm Composable có thể rủi ro, vì nó có thể dẫn đến hành vi không mong muốn hoặc không nhất quán trong giao diện người dùng do các lần gọi lại này.
>Ví dụ, giả sử bạn muốn tạo một kết hợp của  text và text field, và bạn muốn hiển thị một >thông báo toast với một thông báo mặc định lần đầu tiên nó xuất hiện. Bạn có thể tạo một >cài đặt đơn giản như ví dụ sau:
>
>```kotlin
>@Composable
>fun HomeScreen(defaultValue: String = "Hello, Compose!") {
>  Column {
>    val (value, onValueChanged) = remember { mutableStateOf(defaultValue) }
>
>    val context = LocalContext.current
>    Toast.makeText(context, defaultValue, Toast.LENGTH_SHORT).show()
>
>    Text(text = value)
>
>    TextField(value = value, onValueChange = onValueChanged)
>  }
>}
>```
>Tuy nhiên, khi chạy mã này, bạn có thể nhận thấy một vấn đề. Mỗi khi bạn sửa đổi đầu vào của ô văn bản, thông báo mặc định ("Xin chào, Compose!") lại xuất hiện dưới dạng một thông báo toast. Điều này xảy ra vì các thay đổi trạng thái cho ô văn bản kích hoạt recomposition, từ đó cập nhật giao diện Compose và vô tình gây ra việc hiển thị thông báo toast một cách lặp đi lặp lại.
>
>Hiện tượng này được gọi là "Side-Effects", nó tham chiếu đến việc xuất hiện các hành vi không mong muốn được kích hoạt bên trong chương trình. Tuy nhiên, thường cần thiết cho giao diện người dùng tương tác với logic domain, như lấy dữ liệu mạng, truy vấn cơ sở dữ liệu và thực hiện các hoạt động quan trọng khác. Tương tác này là rất quan trọng trong hầu hết các ứng dụng để đảm bảo giao diện người dùng phản ánh trạng thái và dữ liệu hiện tại được xử lý bởi hệ thống nền.
>
>Composables trong Jetpack Compose được thiết kế để là "pure" hoặc không có hiệu ứng phụ. Điều này có nghĩa là chúng không nên thay đổi trạng thái toàn cục hoặc tác động đến thế giới bên ngoài. Thay vào đó, chúng chỉ nên tạo ra giao diện người dùng dựa trên các đầu vào mà chúng nhận được và không nên có bất kỳ hành vi không thể đoán trước nào.
>
>Để giải quyết thách thức của các hiện tượng Side-Effects, Jetpack Compose giới thiệu một khái niệm được biết đến là "effect handler.".

However, sometimes side-effects are necessary, for example, **to trigger a one-off event** such as showing a snackbar or navigate to another screen given a certain state condition. These actions should be called from a controlled environment that is aware of the lifecycle of the composable. In this page, you'll learn about the different side-effect APIs Jetpack Compose offers.

When you need to make changes to the state of the app. **you should use the Effect APIs so that those side effects are executed in a predictable manner.**


## LaunchedEffect
run suspend functions in the scope of a composable

To call suspend functions safely from inside a composable, use the LaunchedEffect composable. When LaunchedEffect enters the Composition, it launches a coroutine with the block of code passed as a parameter. The coroutine will be cancelled if LaunchedEffect leaves the composition. If LaunchedEffect is recomposed with different keys (see the Restarting Effects section below), the existing coroutine will be cancelled and the new suspend function will be launched in a new coroutine.

For example

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
In the code above, a coroutine is triggered if the state contains an error and it'll be cancelled when it doesn't. As the LaunchedEffect call site is inside an if statement, when the statement is false, if LaunchedEffect was in the Composition, it'll be removed, and therefore, the coroutine will be cancelled.

## rememberCoroutineScope

Obtain a composition-aware scope to launch a coroutine outside a composable

`LaunchedEffect` là một hàm composable, nghĩa là nó chỉ có thể được sử dụng bên trong các hàm composable khác. Tuy nhiên, trong một số trường hợp, bạn có thể muốn khởi chạy một coroutine bên ngoài một hàm composable, nhưng vẫn muốn nó được tự động hủy khi rời khỏi composition. Trong trường hợp này, bạn có thể sử dụng `rememberCoroutineScope`.

`rememberCoroutineScope` cũng được sử dụng khi bạn cần kiểm soát vòng đời của một hoặc nhiều coroutines theo cách thủ công, ví dụ như hủy một hoạt ảnh khi xảy ra sự kiện của người dùng.

Example:

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

## rememberUpdatedState

reference a value in an effect that shouldn't restart if the value changes
(tham chiếu đến một giá trị trong một effect mà không nên khởi động lại nếu giá trị đó thay đổi.)

LaunchedEffect sẽ khởi động lại khi một trong các tham số khóa thay đổi. Tuy nhiên, trong một số tình huống, bạn có thể muốn nắm bắt một giá trị trong hiệu ứng của mình mà nếu nó thay đổi, bạn không muốn hiệu ứng khởi động lại. Để làm điều này, bạn cần sử dụng `rememberUpdatedState` để tạo một tham chiếu đến giá trị này có thể được nắm bắt và cập nhật. Phương pháp này hữu ích cho các hiệu ứng chứa các hoạt động kéo dài có thể tốn kém hoặc cấm tạo và khởi động lại.

Ví dụ, giả sử ứng dụng của bạn có một `LandingScreen` biến mất sau một thời gian. Ngay cả khi `LandingScreen` được tái tạo, hiệu ứng chờ đợi một thời gian và thông báo rằng thời gian đã trôi qua không nên được khởi động lại.

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

## DisposableEffect

Effects that require **cleanup**

> [!NOTE]
> Effect này dùng để thực hiện một hành động gì đó trước khi bắt đầu setup lại khi trigger thay đổi, như trong ví dụ khi lifecycleOwner thay đổi nó sẽ chạy đoạn Dispose trước khi add lại observer mới

For side effects that need to be cleaned up after the keys change or if the composable leaves the Composition, use DisposableEffect. If the `DisposableEffect` keys change, the composable needs to dispose (do the cleanup for) its current effect, and reset by calling the effect again.

As an example, you might want to send analytics events based on Lifecycle events by using a LifecycleObserver. To listen for those events in Compose, use a `DisposableEffect` to register and unregister the observer when needed.

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

## SideEffect

To share Compose state with objects not managed by compose


 Using a `SideEffect` **guarantees that the effect executes after every successful recomposition**. On the other hand, **it is incorrect to perform an effect before a successful recomposition is guaranteed, which is the case when writing the effect directly in a composable.**

For example, your analytics library might allow you to segment your user population by attaching custom metadata ("user properties" in this example) to all subsequent analytics events. To communicate the user type of the current user to your analytics library, use SideEffect to update its value.

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
## produceState

convert non-Compose state into Compose state

`produceState` launches a coroutine scoped to the Composition that can push values into a returned `State`. Use it to convert non-Compose state into Compose state, for example bringing external subscription-driven state such as `Flow`, `LiveData`, or `RxJava` into the Composition.

The producer is launched when produceState enters the Composition, and will be cancelled when it leaves the Composition. The returned State conflates; setting the same value won't trigger a recomposition.

Even though produceState creates a coroutine, it can also be used to observe non-suspending sources of data. To remove the subscription to that source, use the awaitDispose function.

Example

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

## derivedStateOf

convert one or multiple state objects into another state

Trong Compose, quá trình recompose xảy ra mỗi khi một đối tượng trạng thái được quan sát hoặc dữ liệu đầu vào của thành phần kết hợp thay đổi. Đối tượng trạng thái hoặc đầu vào có thể thay đổi thường xuyên hơn mức giao diện người dùng thực sự cần cập nhật, dẫn đến việc kết hợp lại không cần thiết.

Bạn nên sử dụng hàm `derStateOf` **khi thông tin đầu vào của một thành phần kết hợp thay đổi thường xuyên hơn mức bạn cần phải soạn lại**. Điều này thường xảy ra khi một nội dung nào đó thường xuyên thay đổi, chẳng hạn như vị trí cuộn, nhưng composable chỉ cần phản ứng với nội dung đó khi vượt qua một ngưỡng nhất định. có nguồn gốcStateOf tạo một đối tượng trạng thái Compose mới mà bạn có thể quan sát thấy đối tượng đó chỉ cập nhật số lượng bạn cần. Theo cách này, nó hoạt động tương tự như toán tử Kotlin Flows DifferentUntilChanged().

>[!CAUTION]
> chỉ nên sử dụng `derivedStateOf` **khi cần thiết để tránh việc recomposition không cần thiết**, và nhớ rằng việc tính toán `derivedStateOf` có thể tốn kém về hiệu suất.

**Correct usage**

The following snippet shows an appropriate use case for derivedStateOf:

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

Trong đoạn mã này, firstVisibleItemIndex thay đổi bất cứ khi nào mục hiển thị đầu tiên thay đổi. Khi bạn cuộn, giá trị trở thành 0, 1, 2, 3, 4, 5, v.v. Tuy nhiên, việc kết hợp lại chỉ cần xảy ra nếu giá trị lớn hơn 0. Tần suất cập nhật không khớp này có nghĩa là đây là trường hợp sử dụng tốt cho `derivedStateOf` 

**Incorrect usage**


A common mistake is to assume that, when you combine two Compose state objects, you should use `derivedStateOf` because you are "deriving state". However, this is purely overhead and not required, as shown in the following snippet:

```kotlin
// DO NOT USE. Incorrect usage of derivedStateOf.
var firstName by remember { mutableStateOf("") }
var lastName by remember { mutableStateOf("") }

val fullNameBad by remember { derivedStateOf { "$firstName $lastName" } } // This is bad!!!
val fullNameCorrect = "$firstName $lastName" // This is correct
```
Trong đoạn mã này, fullName cần cập nhật thường xuyên như FirstName và LastName. Do đó, không có sự kết hợp lại quá mức nào xảy ra và việc sử dụng `deredStateOf` là không cần thiết.

## snapshotFlow

convert Compose's State into Flows

Use snapshotFlow to convert State<T> objects into a cold Flow.
`snapshotFlow` runs its block when collected and emits the result of the `State` objects read in it., the Flow will emit the new value to its collector if the new value is not equal to the previous emitted value (this behavior is similar to that of Flow.distinctUntilChanged).

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

