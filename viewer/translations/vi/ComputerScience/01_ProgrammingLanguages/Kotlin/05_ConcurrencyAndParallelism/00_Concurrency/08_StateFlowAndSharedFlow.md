# StateFlow và SharedFlow
`StateFlow` và `SharedFlow` là các API Flow phát ra giá trị một cách hiệu quả cho nhiều người tiêu dùng. Chúng phục vụ các mục đích khác nhau trong quản lý trạng thái và xử lý sự kiện.

##StateFlow

StateFlow là bộ chứa dữ liệu immutable đại diện cho một giá trị (trạng thái) duy nhất có thể được quan sát

- Luồng nóng có **giá trị trạng thái hiện tại**
- Yêu cầu **giá trị ban đầu**
- Người sưu tầm nhận ngay **giá trị mới nhất**

Khi một người tiêu dùng mới bắt đầu thu thập từ luồng, nó sẽ nhận được trạng thái cuối cùng trong luồng và mọi trạng thái tiếp theo


> [!WARNING]
> - `StateFlow` luôn hoạt động và nằm trong bộ nhớ, đồng thời nó chỉ đủ điều kiện để trở thành rác collection khi không có tham chiếu nào khác tới nó từ gốc collection rác.
> - Không bao giờ thu thập luồng từ UI trực tiếp từ khi khởi chạy hoặc chức năng mở rộng launchIn nếu UI cần được cập nhật. 
> Các chức năng này của sự kiện process ngay cả khi chế độ xem không hiển thị. 
> Hành vi này có thể dẫn đến sự cố ứng dụng. Để tránh điều đó, hãy sử dụng `repeatOnLifecycle` API như minh họa ở trên.


### Chuyển đổi `MutableStateFlow` thành `StateFlow` chỉ đọc

- Không chuyển dòng lạnh thành dòng nóng
- Mục đích là giấu setter cho state từ bên ngoài

```kotlin
private val _state = MutableStateFlow(...)
val state = _state.asStateFlow() // read-only for view
```

##SharedFlow
- Luồng nóng để phát ra sự kiện
- Không có bộ nhớ trạng thái trừ khi `replay > 0`
- Bộ đệm `replay` có thể định cấu hình để gửi lại một số giá trị đã phát trước đó cho người đăng ký mới.
- Lý tưởng cho **sự kiện một lần**, nhấp chuột vào nút hoặc điều hướng

Ví dụ về phát lại:

```kotlin
val sharedFlow = MutableSharedFlow<Int>(replay = 2)

// Emit 1, 2, 3
sharedFlow.emit(1)
sharedFlow.emit(2)
sharedFlow.emit(3)

//at the other coroutine
sharedFlow.collect { println(it) }

```

### Làm nóng dòng lạnh bằng `shareIn`
- chuyển đổi luồng lạnh thành luồng nóng (Nhiều bộ thu chỉ nghe một nguồn dữ liệu và không tạo luồng dữ liệu mới cho mỗi bộ thu)

```kotlin
class NewsRemoteDataSource(...,
    private val externalScope: CoroutineScope,
) {
    val latestNews: SharedFlow<List<ArticleHeadline>> = flow {
        ...
    }.shareIn(
        externalScope,
        replay = 1,
        started = SharingStarted.WhileSubscribed()
    )
}
```


## Cách sử dụng trong Android
`StateFlow` có thể hiển thị trạng thái UI từ `ViewModel`, đảm bảo trạng thái tồn tại khi thay đổi cấu hình:

```kotlin
class LatestNewsViewModel(
    private val newsRepository: NewsRepository
) : ViewModel() {

    // Backing property to prevent external state updates
    private val _uiState = MutableStateFlow(LatestNewsUiState.Success(emptyList()))
    // Public immutable StateFlow for UI consumption
    val uiState: StateFlow<LatestNewsUiState> = _uiState

    init {
        viewModelScope.launch {
            newsRepository.favoriteLatestNews
                .collect { favoriteNews ->
                    _uiState.value = LatestNewsUiState.Success(favoriteNews)
                }
        }
    }
}

sealed class LatestNewsUiState {
    data class Success(val news: List<ArticleHeadline>): LatestNewsUiState()
    data class Error(val exception: Throwable): LatestNewsUiState()
}
```

Nhà sản xuất cập nhật `MutableStateFlow`, trong khi người tiêu dùng thu thập từ `StateFlow`. Không giống như dòng lạnh, `StateFlow` nóng và không kích hoạt mã nhà sản xuất khi được thu thập.

> [!WARNING] 
> `StateFlow` vẫn còn trong bộ nhớ cho đến khi không có tham chiếu nào đến nó từ gốc collection rác.

Người tiêu dùng mới nhận được trạng thái hiện tại cùng với các bản cập nhật tiếp theo, tương tự như `LiveData`.
Lượt xem được thu thập từ `StateFlow` bằng cách sử dụng coroutine nhận biết lifecycle:


```kotlin
class LatestNewsActivity : AppCompatActivity() {
    private val latestNewsViewModel = // getViewModel()

    override fun onCreate(savedInstanceState: Bundle?) {
        lifecycleScope.launch {
            // Automatically starts collecting when STARTED, cancels when STOPPED
            repeatOnLifecycle(Lifecycle.State.STARTED) {
                latestNewsViewModel.uiState.collect { uiState ->
                    when (uiState) {
                        is LatestNewsUiState.Success -> showFavoriteNews(uiState.news)
                        is LatestNewsUiState.Error -> showError(uiState.exception)
                    }
                }
            }
        }
    }
}
```

> [!CAUTION] 
> Không bao giờ thu thập UI-Các luồng cập nhật trực tiếp với `launch` hoặc `launchIn` vì chúng là các sự kiện process ngay cả khi chế độ xem không hiển thị, có khả năng gây ra sự cố.

> [!TIP] 
> Chuyển đổi bất kỳ `Flow` nào thành `StateFlow` bằng cách sử dụng toán tử stateIn.

## Khi nào nên sử dụng
- Sử dụng `StateFlow` để **quản lý và chia sẻ trạng thái UI**
- Sử dụng `SharedFlow` để **phát sóng sự kiện** tới nhiều người nghe















