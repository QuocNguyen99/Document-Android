

#ViewModel

Lớp `ViewModel` là một [logic nghiệp vụ hoặc cấp độ màn hình state holder](https://developer.android.com/topic/architecture/ui-layer/stateholders). Nó hiển thị trạng thái cho UI và đóng gói logic nghiệp vụ liên quan. Ưu điểm chính của nó là lưu trữ trạng thái và duy trì trạng thái đó thông qua các thay đổi cấu hình. Điều này có nghĩa là UI của bạn không phải tìm nạp lại dữ liệu khi điều hướng giữa các hoạt động hoặc thực hiện các thay đổi về cấu hình, chẳng hạn như khi xoay màn hình.

## Lợi ích của ViewModel

ViewModel cung cấp API tiện lợi để duy trì dữ liệu nhằm giải quyết vấn đề này.

Những lợi ích chính của lớp ViewModel về cơ bản là hai:

* Nó cho phép bạn duy trì trạng thái UI.
* Nó cung cấp quyền truy cập vào logic kinh doanh.

### Kiên trì

ViewModel cho phép tồn tại thông qua cả trạng thái mà ViewModel nắm giữ và các hoạt động mà ViewModel kích hoạt. Bộ nhớ đệm này có nghĩa là bạn không phải tìm nạp lại dữ liệu thông qua các thay đổi cấu hình phổ biến, chẳng hạn như xoay màn hình.

####Phạm vi

Khi khởi tạo ViewModel, bạn chuyển cho nó một đối tượng triển khai giao diện [`ViewModelStoreOwner`](https://developer.android.com/reference/kotlin/androidx/lifecycle/ViewModelStoreOwner).

Một loạt lớp là lớp con trực tiếp hoặc gián tiếp của giao diện `ViewModelStoreOwner`. Các lớp con trực tiếp là [`ComponentActivity`](https://developer.android.com/reference/androidx/activity/ComponentActivity), [`Fragment`](https://developer.android.com/reference/androidx/fragment/app/Fragment) và [`NavBackStackEntry`](https://developer.android.com/reference/androidx/navigation/NavBackStackEntry). Để biết danh sách đầy đủ các lớp con gián tiếp, hãy xem phần [`ViewModelStoreOwner` tài liệu tham khảo](https://developer.android.com/reference/kotlin/androidx/lifecycle/ViewModelStoreOwner).

Đây có thể là đích Navigation, Navigation graph, hoạt động, đoạn hoặc bất kỳ loại nào khác triển khai giao diện. Khi đó, ViewModel của bạn sẽ nằm trong phạm vi [Lifecycle](https://developer.android.com/reference/androidx/lifecycle/Lifecycle) của `ViewModelStoreOwner`. **Nó vẫn còn trong bộ nhớ cho đến khi `ViewModelStoreOwner` biến mất vĩnh viễn.**

    Khi một Activity hoặc Fragment bị hủy bỏ, ViewModel của chúng sẽ vẫn chạy và các coroutine đang chạy trong ViewModel cũng vẫn tiếp tục chạy. Tuy nhiên, nếu coroutine này thực thi một hoạt động liên quan đến View như cập nhật UI, thì công việc đó sẽ gây ra lỗi sau khi View đã được kích hoạt.

Để tránh điều này, bạn có thể sử dụng phương thức `viewModelScope` khi khởi tạo coroutine để đảm bảo rằng coroutine sẽ tự động bị hủy khi ViewModel bị hủy bỏ. Ví dụ:

```kotlin
class MyViewModel : ViewModel() {
    fun doSomething() {
        viewModelScope.launch {
            // do something here
        }
    }
}

```

Trong ví dụ này, coroutine được khởi chạy bằng `viewModelScope` sẽ tự động bị hủy khi ViewModel bị hủy, tránh gây ra lỗi khi View bị hủy.

## Truy cập vào logic nghiệp vụ

    ViewModel là nơi thích hợp để xử lý logic nghiệp vụ trong lớp UI. ViewModel cũng chịu trách nhiệm xử lý các sự kiện và ủy quyền chúng cho các lớp khác trong hệ thống phân cấp khi cần áp dụng logic nghiệp vụ để sửa đổi dữ liệu ứng dụng.

## lifecycle của ViewModel

lifecycle của [`ViewModel`](https://developer.android.com/reference/androidx/lifecycle/ViewModel) được liên kết trực tiếp với phạm vi của nó. A `ViewModel` vẫn còn trong bộ nhớ cho đến khi [`ViewModelStoreOwner`](https://developer.android.com/reference/kotlin/androidx/lifecycle/ViewModelStoreOwner) mà nó nằm trong phạm vi biến mất. Điều này có thể xảy ra trong các bối cảnh sau:

* Trong trường hợp một hoạt động, khi nó kết thúc.
* Trong trường hợp mảnh vỡ, khi nó tách ra.
* Trong trường hợp mục nhập Navigation, khi mục nhập đó bị xóa khỏi back stack.

Điều này làm cho ViewModels trở thành giải pháp tuyệt vời để lưu trữ dữ liệu sau những thay đổi về cấu hình.

## Xóa phần phụ thuộc ViewModel

ViewModel gọi phương thức [`onCleared`](https://developer.android.com/reference/androidx/lifecycle/ViewModel#onCleared()) khi `ViewModelStoreOwner` hủy phương thức này trong quá trình lifecycle của nó. Điều này cho phép bạn dọn sạch mọi công việc hoặc phần phụ thuộc tuân theo lifecycle của ViewModel.



Ví dụ sau đây cho thấy một giải pháp thay thế cho `viewModelScope`.`viewModelScope` là một giải pháp thay thế [`CoroutineScope`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-coroutine-scope/) tự động tuân theo lifecycle của ViewModel. ViewModel sử dụng nó để kích hoạt các hoạt động liên quan đến kinh doanh. Nếu bạn muốn sử dụng phạm vi tùy chỉnh thay vì `viewModelScope` để kiểm tra dễ dàng hơn, ViewModel có thể nhận `CoroutineScope` làm phần phụ thuộc trong hàm khởi tạo của nó. Khi `ViewModelStoreOwner` xóa ViewModel ở cuối lifecycle, ViewModel cũng hủy `CoroutineScope`.



```kotlin
class MyViewModel(
    private val coroutineScope: CoroutineScope =
        CoroutineScope(SupervisorJob() + Dispatchers.Main.immediate)
) : ViewModel() {

    // Other ViewModel logic ...

    override fun onCleared() {
        coroutineScope.cancel()
    }
}
```



Từ lifecycle [phiên bản 2.5](https://developer.android.com/jetpack/androidx/releases/lifecycle#version_25_2) trở lên, bạn có thể chuyển một hoặc nhiều đối tượng `Closeable` đến hàm khởi tạo của ViewModel. Hàm khởi tạo này tự động đóng khi phiên bản ViewModel bị xóa.



```kotlin
class CloseableCoroutineScope(
    context: CoroutineContext = SupervisorJob() + Dispatchers.Main.immediate
) : Closeable, CoroutineScope {
    override val coroutineContext: CoroutineContext = context
    override fun close() {
        coroutineContext.cancel()
   }
}

class MyViewModel(
    private val coroutineScope: CoroutineScope = CloseableCoroutineScope()
) : ViewModel(coroutineScope) {
    // Other ViewModel logic ...
}
```


