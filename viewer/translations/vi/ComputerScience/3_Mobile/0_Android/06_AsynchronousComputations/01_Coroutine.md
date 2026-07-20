# Coroutine trong Android

_coroutine_ là concurrency design pattern mà bạn có thể sử dụng trên Android để đơn giản hóa mã thực thi không đồng bộ.


## Đặc trưng


Coroutines là giải pháp chúng tôi đề xuất cho asynchronous programming trên Android. Các tính năng đáng chú ý bao gồm:

* **Nhẹ nhàng**: Bạn có thể chạy nhiều coroutine trên một thread nhờ hỗ trợ tạm ngưng, điều này không chặn thread nơi coroutine đang chạy. Việc tạm dừng giúp tiết kiệm bộ nhớ khi chặn đồng thời hỗ trợ nhiều thao tác đồng thời.
* **Ít rò rỉ bộ nhớ hơn**: Sử dụng [_structured concurrency_](https://kotlinlang.org/docs/reference/coroutines/basics.html#structured-concurrency) để chạy các thao tác trong một phạm vi.
* **Hỗ trợ cancellation tích hợp**: [Cancellation](https://kotlinlang.org/docs/reference/coroutines/cancellation-and-timeouts.html) được truyền bá tự động thông qua hệ thống phân cấp coroutine đang chạy.
* **Tích hợp Jetpack**: Nhiều thư viện Jetpack bao gồm [tiện ích mở rộng](https://developer.android.com/kotlin/ktx) cung cấp hỗ trợ coroutine đầy đủ. Một số thư viện cũng cung cấp [coroutine scope](https://developer.android.com/topic/libraries/architecture/coroutines) của riêng họ mà bạn có thể sử dụng cho structured concurrency.



## Thực thi ở chế độ nền thread

Việc thực hiện yêu cầu mạng trên thread chính khiến nó phải chờ hoặc _block_ cho đến khi nhận được phản hồi. Vì thread bị chặn nên OS không thể gọi `onDraw()`, điều này khiến ứng dụng của bạn bị treo và có khả năng dẫn đến hộp thoại Ứng dụng không phản hồi (ANR). Để có trải nghiệm người dùng tốt hơn, hãy chạy thao tác này trên nền thread.

### Vấn đề

Trước tiên, chúng ta hãy xem lớp `Repository` của chúng tôi và xem cách nó thực hiện yêu cầu mạng:

```kotlin
sealed class Result<out R> {
    data class Success<out T>(val data: T) : Result<T>()
    data class Error(val exception: Exception) : Result<Nothing>()
}

class LoginRepository(private val responseParser: LoginResponseParser) {
    private const val loginUrl = "https://example.com/login"

    // Function that makes the network request, blocking the current thread
    fun makeLoginRequest(
        jsonBody: String
    ): Result<LoginResponse> {
        val url = URL(loginUrl)
        (url.openConnection() as? HttpURLConnection)?.run {
            requestMethod = "POST"
            setRequestProperty("Content-Type", "application/json; utf-8")
            setRequestProperty("Accept", "application/json")
            doOutput = true
            outputStream.write(jsonBody.toByteArray())
            return Result.Success(responseParser.parse(inputStream))
        }
        return Result.Error(Exception("Cannot open HttpURLConnection"))
    }
}
```

`makeLoginRequest` đồng bộ và chặn cuộc gọi thread. Để mô hình hóa phản hồi của yêu cầu mạng, chúng tôi có lớp `Result` của riêng mình.

`ViewModel` kích hoạt yêu cầu mạng khi người dùng nhấp vào, ví dụ: vào nút:

```kotlin
class LoginViewModel(
    private val loginRepository: LoginRepository
): ViewModel() {

    fun login(username: String, token: String) {
        val jsonBody = "{ username: \"$username\", token: \"$token\"}"
        loginRepository.makeLoginRequest(jsonBody)
    }
}
```

**Với mã trước đó, `LoginViewModel` đang chặn UI thread khi thực hiện yêu cầu mạng.**

### Giải pháp

Giải pháp đơn giản nhất để loại bỏ việc thực thi khỏi thread chính là tạo một coroutine mới và thực thi yêu cầu mạng trên I/O thread:

```kotlin
class LoginViewModel(
    private val loginRepository: LoginRepository
): ViewModel() {

    fun login(username: String, token: String) {
        // Create a new coroutine to move the execution off the UI thread
        viewModelScope.launch(Dispatchers.IO) {
            val jsonBody = "{ username: \"$username\", token: \"$token\"}"
            loginRepository.makeLoginRequest(jsonBody)
        }
    }
}
```

Hãy cùng mổ xẻ mã coroutines trong hàm `login`:

* `viewModelScope` là `CoroutineScope` được xác định trước đi kèm với phần mở rộng `ViewModel` KTX. Lưu ý rằng tất cả các coroutine phải chạy trong một phạm vi. `CoroutineScope` quản lý một hoặc nhiều coroutine liên quan.
* `launch` là một hàm tạo ra một coroutine và gửi việc thực thi nội dung hàm của nó đến bộ điều phối tương ứng.
* `Dispatchers.IO` chỉ ra rằng coroutine này phải được thực thi trên thread dành riêng cho các hoạt động I/O.

Hàm `login` được thực thi như sau:

* Ứng dụng gọi hàm `login` từ lớp `View` trên thread chính.
* `launch` tạo một coroutine mới và yêu cầu mạng được thực hiện độc lập trên thread dành riêng cho các hoạt động I/O.
* Trong khi coroutine đang chạy, hàm `login` tiếp tục thực thi và trả về, có thể trước khi yêu cầu mạng kết thúc. Lưu ý rằng để đơn giản, hiện tại phản hồi của mạng bị bỏ qua.

Vì coroutine này được bắt đầu bằng `viewModelScope` nên nó được thực thi trong phạm vi `ViewModel`. Nếu `ViewModel` bị hủy do người dùng đang điều hướng khỏi màn hình thì `viewModelScope` sẽ tự động bị hủy và tất cả các coroutine đang chạy cũng bị hủy.



## Sử dụng coroutine để đảm bảo an toàn chính

### Vấn đề và giải pháp

Chúng tôi xem xét chức năng _main-safe_ khi nó không chặn các bản cập nhật UI trên thread chính. Chức năng `makeLoginRequest` không an toàn cho mạng chính vì việc gọi `makeLoginRequest` từ thread chính sẽ chặn UI. Sử dụng hàm `withContext()` từ thư viện coroutine để di chuyển quá trình thực thi coroutine sang một thread khác:

```kotlin
class LoginRepository(...) {
    ...
    suspend fun makeLoginRequest(
        jsonBody: String
    ): Result<LoginResponse> {

        // Move the execution of the coroutine to the I/O dispatcher
        return withContext(Dispatchers.IO) {
            // Blocking network request code
        }
    }
}
```

`withContext(Dispatchers.IO)` chuyển việc thực thi coroutine sang I/O thread, giúp hàm gọi của chúng ta trở nên an toàn chính và cho phép UI cập nhật khi cần.

`makeLoginRequest` cũng được đánh dấu bằng từ khóa `suspend`. Từ khóa này là cách Kotlin thực thi một hàm được gọi từ bên trong một coroutine.



Trong ví dụ sau, coroutine được tạo trong `LoginViewModel`. Khi `makeLoginRequest` chuyển việc thực thi khỏi thread chính, coroutine trong hàm `login` hiện có thể được thực thi trong thread chính:

```kotlin
class LoginViewModel(
    private val loginRepository: LoginRepository
): ViewModel() {

    fun login(username: String, token: String) {

        // Create a new coroutine on the UI thread
        viewModelScope.launch {
            val jsonBody = "{ username: \"$username\", token: \"$token\"}"

            // Make the network call and suspend execution until it finishes
            val result = loginRepository.makeLoginRequest(jsonBody)

            // Display result of the network request to the user
            when (result) {
                is Result.Success<LoginResponse> -> // Happy path
                else -> // Show error in UI
            }
        }
    }
}
```

Lưu ý rằng ở đây vẫn cần coroutine vì `makeLoginRequest` là một hàm `suspend` và tất cả các hàm `suspend` phải được thực thi trong một coroutine.

Mã này khác với ví dụ `login` trước đó ở một số điểm:

* **`launch` không lấy tham số `Dispatchers.IO`. Khi bạn không chuyển `Dispatcher` sang `launch`, mọi coroutine được khởi chạy từ `viewModelScope` sẽ chạy trong thread chính.**
* Kết quả của yêu cầu mạng hiện được xử lý để hiển thị thành công hay thất bại UI.

Chức năng đăng nhập bây giờ thực hiện như sau:

* Ứng dụng gọi hàm `login()` từ lớp `View` trên thread chính.
* `launch` tạo một coroutine mới trên thread chính và coroutine bắt đầu thực thi.
* Trong coroutine, lệnh gọi tới `loginRepository.makeLoginRequest()` hiện _tạm dừng_ việc thực thi coroutine tiếp theo cho đến khi khối `withContext` trong `makeLoginRequest()` chạy xong.
* Sau khi khối `withContext` kết thúc, coroutine trong `login()` sẽ tiếp tục thực thi _trên luồng chính_ với kết quả của yêu cầu mạng.

# Định nghĩa phần main-safe

Các coroutine Kotlin sử dụng _dispatchers_ để xác định luồng nào được dùng để thực thi coroutine. Để chạy mã bên ngoài thread chính, bạn có thể yêu cầu các coroutine Kotlin thực hiện công việc trên bộ điều phối _Default_ hoặc _IO_. Trong Kotlin, tất cả các coroutine phải chạy trong bộ điều phối, ngay cả khi chúng đang chạy trên thread chính. Các coroutine có thể tự tạm dừng và người điều phối có trách nhiệm tiếp tục lại chúng.

Để chỉ định nơi coroutine sẽ chạy, Kotlin cung cấp ba trình điều phối mà bạn có thể sử dụng:

* **Dispatchers.Main** - Sử dụng bộ điều phối này để chạy coroutine trên Android thread chính. Điều này chỉ nên được sử dụng để tương tác với UI và thực hiện công việc nhanh chóng. Các ví dụ bao gồm gọi các hàm `suspend`, chạy các hoạt động Android UI framework và cập nhật các đối tượng [`LiveData`](https://developer.android.com/topic/libraries/architecture/livedata).
* **Dispatchers.IO** - Bộ điều phối này được tối ưu hóa để thực hiện I/O đĩa hoặc mạng bên ngoài thread chính. Các ví dụ bao gồm việc sử dụng [thành phần Room](https://developer.android.com/topic/libraries/architecture/room), đọc từ hoặc ghi vào tệp và chạy bất kỳ hoạt động mạng nào.
* **Dispatchers.Default** - Trình điều phối này được tối ưu hóa để thực hiện công việc chuyên sâu CPU- bên ngoài thread chính. Các trường hợp sử dụng ví dụ bao gồm sắp xếp danh sách và phân tích cú pháp JSON.
* **Dispatchers.Unconfined** - nó thực thi coroutine ngay lập tức trên thread hiện tại và sau đó tiếp tục nó trong bất kỳ thread nào được gọi là sơ yếu lý lịch. Nó thường phù hợp cho những việc như chặn API không tạm ngưng thông thường hoặc gọi mã liên quan đến coroutine để chặn các lệnh gọi lại thế giới.



## Cải thiện hiệu suất ứng dụng với coroutine Kotlin

## Quản lý các tác vụ chạy dài

Coroutine xây dựng dựa trên các hàm thông thường bằng cách thêm hai thao tác để xử lý các tác vụ chạy trong thời gian dài. Ngoài `invoke` (hoặc `call`) và `return`, coroutine còn thêm `suspend` và `resume`:

* `suspend` tạm dừng quá trình thực thi coroutine hiện tại, lưu tất cả các biến cục bộ.
* `resume` tiếp tục thực thi coroutine bị tạm ngưng từ nơi nó bị tạm ngưng.

Bạn chỉ có thể gọi các hàm `suspend` từ các hàm `suspend` khác hoặc bằng cách sử dụng coroutine builder chẳng hạn như `launch` để bắt đầu một coroutine mới.

Ví dụ sau đây cho thấy cách triển khai coroutine đơn giản cho một tác vụ giả định chạy dài:

```kotlin
suspend fun fetchDocs() {                             // Dispatchers.Main
    val result = get("https://developer.android.com") // Dispatchers.IO for `get`
    show(result)                                      // Dispatchers.Main
}

suspend fun get(url: String) = withContext(Dispatchers.IO) { /* ... */ }
```

Trong ví dụ này, `get()` vẫn chạy trên thread chính nhưng nó tạm dừng coroutine trước khi bắt đầu yêu cầu mạng. Khi yêu cầu mạng hoàn tất, `get` sẽ tiếp tục coroutine bị treo thay vì sử dụng callback để thông báo cho thread chính.

> [!NOTE]
> Kotlin sử dụng _stack frame_ để quản lý hàm nào đang chạy cùng với bất kỳ biến cục bộ nào. Khi tạm dừng một coroutine, khung ngăn xếp hiện tại sẽ được sao chép và lưu lại để sử dụng sau. Khi tiếp tục, khung ngăn xếp sẽ được sao chép trở lại từ nơi đã lưu và hàm sẽ bắt đầu chạy lại.

## Bắt đầu một coroutine

Bạn có thể bắt đầu coroutine theo một trong hai cách:

* [`launch`](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/launch.html) khởi động một coroutine mới và không trả về kết quả cho người gọi. Bất kỳ công việc nào được coi là "cháy và quên" đều có thể được bắt đầu bằng `launch`.
* [`async`](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/async.html) khởi động một coroutine mới và cho phép bạn trả về kết quả bằng hàm tạm ngưng có tên `await`.



> [!WARNING]
> `launch` và `async` xử lý các trường hợp ngoại lệ khác nhau.
> Vì `async` mong đợi lệnh gọi cuối cùng tới `await` nên nó giữ các ngoại lệ và gửi lại chúng như một phần của lệnh gọi `await`. Điều này có nghĩa là nếu sử dụng `async` để khởi động một coroutine mới từ một hàm thông thường, thì bạn có thể âm thầm loại bỏ một ngoại lệ. Những trường hợp ngoại lệ bị loại bỏ này sẽ không xuất hiện trong số liệu sự cố của bạn hoặc được ghi chú trong logcat.



## Khái niệm về coroutine

### CoroutineScope

[`CoroutineScope`](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-coroutine-scope/) theo dõi mọi coroutine mà nó tạo bằng cách sử dụng `launch` hoặc `async`.
Bạn có thể hủy công việc đang diễn ra (tức là các coroutine đang chạy) bằng cách gọi `scope.cancel()` bất kỳ lúc nào. Trong Android, một số thư viện KTX cung cấp `CoroutineScope` của riêng chúng cho một số lớp lifecycle nhất định.
Ví dụ: `ViewModel` có [`viewModelScope`](https://developer.android.com/reference/kotlin/androidx/lifecycle/package-summary#(androidx.lifecycle.ViewModel).viewModelScope:kotlinx.coroutines.CoroutineScope) và `Lifecycle` có [`lifecycleScope`](https://developer.android.com/reference/kotlin/androidx/lifecycle/package-summary#lifecyclescope).tuy nhiên, `CoroutineScope` không chạy coroutine. 

Nếu cần tạo `CoroutineScope` của riêng mình để kiểm soát lifecycle của coroutine trong một lớp cụ thể của ứng dụng, bạn có thể tạo một lớp như sau:

```kotlin
class ExampleClass {

    // Job and Dispatcher are combined into a CoroutineContext which
    // will be discussed shortly
    val scope = CoroutineScope(Job() + Dispatchers.Main)

    fun exampleMethod() {
        // Starts a new coroutine within the scope
        scope.launch {
            // New coroutine that can call suspend functions
            fetchDocs()
        }
    }

    fun cleanUp() {
        // Cancel the scope to cancel ongoing coroutines work
        scope.cancel()
    }
}
```

Phạm vi bị hủy không thể tạo thêm coroutine. Do đó, bạn chỉ nên gọi thủ công `scope.cancel()` khi lớp kiểm soát lifecycle của nó bị hủy.

Khi sử dụng `viewModelScope`, lớp [`ViewModel`](https://developer.android.com/topic/libraries/architecture/viewmodel) sẽ tự động hủy phạm vi cho bạn trong phương thức `onCleared()` của ViewModel.

## Công việc

[`Job`](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-job/index.html) là một phần điều khiển của một coroutine. Mỗi coroutine mà bạn tạo bằng `launch` hoặc `async` trả về một phiên bản `Job` xác định duy nhất coroutine và quản lý lifecycle của nó. Bạn cũng có thể chuyển `Job` sang `CoroutineScope` để quản lý thêm lifecycle của nó, như trong ví dụ sau:

```kotlin
class ExampleClass {
    ...
    fun exampleMethod() {
        // Handle to the coroutine, you can control its lifecycle
        val job = scope.launch {
            // New coroutine
        }

        if (...) {
            // Cancel the coroutine started above, this doesn't affect the scope
            // this coroutine was launched in
            job.cancel()
        }
    }
}
```

##Coroutine context

[`CoroutineContext`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.coroutines/-coroutine-context/index.html) xác định hành vi của một coroutine bằng cách sử dụng tập hợp các phần tử sau:

* [`Job`](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-job/index.html): Kiểm soát lifecycle của coroutine.
* [`CoroutineDispatcher`](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-coroutine-dispatcher/index.html): Việc điều phối hoạt động tới thread thích hợp.
* [`CoroutineName`](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-coroutine-name/index.html): Tên của coroutine, hữu ích cho việc gỡ lỗi.
* [`CoroutineExceptionHandler`](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-coroutine-exception-handler/index.html): Xử lý các ngoại lệ chưa được phát hiện.

##Sự khác biệt giữa coroutine và Workmanager

Phạm vi của cả hai là khác nhau. `WorkManager` được lập lịch trình có thể trì hoãn (cho thời gian sau) hoặc ngay lập tức. nhiệm vụ không đồng bộ.

Như tài liệu nói:

> [!NOTE]
> `WorkManager` API giúp dễ dàng chỉ định các tác vụ có thể trì hoãn, không đồng bộ và thời điểm chúng nên chạy. Các API này cho phép bạn tạo một tác vụ và giao nó cho `WorkManager` để chạy ngay lập tức hoặc vào thời điểm thích hợp.

Mặt khác, coroutine được thiết kế để chỉ tính toán một nhiệm vụ nhất định ngay lập tức và không đồng bộ.

Ngoài ra, trong nội bộ, coroutine và WorkManager hoạt động khác nhau.  

`WorkManager` phụ thuộc rất nhiều vào các thành phần hệ thống Android như Dịch vụ, Trình quản lý cảnh báo, v.v. để lên lịch công việc trong khi coroutine lên lịch công việc trên Luồng công nhân và cũng là một tính năng ngôn ngữ không giống như `WorkManager` (API).
Vì vậy, có thể nói rằng coroutine không vượt quá ứng dụng của bạn.



`WorkManager` thậm chí có thể thực thi các tác vụ nhất định khi ứng dụng của bạn không hoạt động. ví dụ, các dịch vụ nền.

- Sử dụng Kotlin `Coroutine` khi một tác vụ cần thực thi ngay lập tức và nếu tác vụ sẽ kết thúc khi người dùng rời khỏi một phạm vi nhất định hoặc kết thúc một tương tác.

- Sử dụng `WorkManager` khi một tác vụ cần thực thi ngay lập tức và cần xử lý tiếp, ngay cả khi người dùng đặt ứng dụng ở chế độ nền hoặc thiết bị khởi động lại.

- Sử dụng `AlarmManager` khi một tác vụ cần được thực thi tại một thời điểm chính xác.

