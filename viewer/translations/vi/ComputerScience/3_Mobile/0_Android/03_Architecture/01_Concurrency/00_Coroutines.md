# Coroutine trong Android

Theo mặc định, tất cả các thành phần ứng dụng Android đều sử dụng main thread để thực thi.
Chúng ta nên tải các phép tính tốn kém xuống các background thread để tránh chặn UI

Ngoài tính toán không đồng bộ, Kotlin **coroutines** còn cung cấp khả năng xác định phạm vi và truyền bá cancellation, 
giúp việc dừng tất cả các tác vụ cần thiết của `Activity`, `Fragment` hoặc `ViewModel` đang bị phá hủy trở nên dễ dàng hơn.

## Người điều phối


với sự trợ giúp của **người điều phối**, chúng tôi có thể xác định loại thread mà phép tính sẽ được thực hiện trên đó.


Chúng ta hãy xem lại các bộ điều phối coroutine được tích hợp sẵn:

- Mặc định
- IO
- Không giới hạn

> [!CAUTION]
> Tệp và mạng IO không bao giờ được tranh giành cùng một thread pool. Trong mã ứng dụng của bạn, tốt hơn hết bạn nên tách các loại IO khác nhau. Ví dụ: val FileIO = Người điều phối.IO.limitedParallelism(3)


Với sự tích hợp của coroutines trong Android đã xuất hiện một bộ điều phối khác: `Dispatchers.Main`

Nó được thiết kế để chạy coroutine trên main (UI) thread của một ứng dụng Android. Các coroutine được khởi chạy bằng `Dispatchers.Main` có thể cập nhật thông tin đầu vào của người dùng user interface, process hoặc thực hiện các tác vụ khác liên quan đến UI-

> [!NOTE]
> Về cơ bản, Dispatchers.Main được triển khai bằng máy móc Android Looper và Handler.

## Phạm vi Lifecycle

`Activity.lifecycleScope` và `Fragment.lifecycleScope` là các phạm vi coroutine được liên kết với lifecycle của Activity hoặc Fragment.

Điều này có nghĩa là mọi coroutine được khởi chạy trong phạm vi này sẽ tự động bị hủy khi Activity hoặc Fragment bị hủy.

Tương tự, `ViewModel.viewModelScope` là một phạm vi sẽ tự động bị hủy khi `ViewModel.onCleared` được gọi.

## Móc thay đổi trạng thái

Phương thức `repeatOnLifecycle` được sử dụng để thực hiện một hành động lặp đi lặp lại trong khi lifecycle đạt đến `State` nhất định và hủy khi lifecycle rời khỏi `State` đó.

Ví dụ: điều này hữu ích khi đăng ký một số nguồn dữ liệu khi UI hiển thị với người dùng và hủy đăng ký khi người dùng rời đi.

```kotlin
lifecycleScope.launch {
    viewLifecycleOwner.repeatOnLifecycle(Lifecycle.State.STARTED) {
        viewModel.someData.collect { value ->
            updateUi(value)
        }
    }
}
```

Trước khi `repeatOnLifecycle` xuất hiện, đã có các phương thức `launchWhenCreated`, `launchWhenStarted`, `launchWhenResumed` riêng biệt.
Hiện tại, chúng không được dùng nữa, vì vậy nếu bạn gặp chúng trong một số mã cũ, chỉ cần thay thế chúng bằng `repeatOnLifecycle(appropriate state)`.












