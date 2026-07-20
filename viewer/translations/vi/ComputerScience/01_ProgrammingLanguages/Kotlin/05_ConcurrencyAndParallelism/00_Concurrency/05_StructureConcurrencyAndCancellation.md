# Structured Concurrency & Cancellation

Nếu nhiều thao tác chạy không đồng bộ, làm sao chúng ta biết khi nào tất cả chúng kết thúc, hoặc quan trọng hơn, làm sao chúng ta biết liệu chúng có thất bại hay không?

Nếu chúng tôi bắt đầu tải xuống một loạt hình ảnh cho ứng dụng thư viện nhưng xác thực không thành công hoặc người dùng quyết định xem một màn hình khác, điều gì sẽ xảy ra với tất cả tải lớn trong nền?

Chà, **chúng ta thực sự có thể kiểm soát điều đó một cách hiệu quả với structured concurrency.**

## Phạm vi

Coroutine cung cấp phạm vi để xác định các hạn chế đối với các hoạt động đang chạy.

Ví dụ :

- Việc tải hình ảnh cho một màn hình phải được thực hiện trong một phạm vi
- Toàn bộ ứng dụng có thể xác định phạm vi riêng của nó

Như bạn có thể thấy, phạm vi có thể và thường nên được lồng vào nhau, bao gồm cả hai.


## Dừng các công việc có phạm vi

#### `GlobalScope`

- Vì chúng tôi sử dụng `GlobalScope` nên các coroutine đã khởi chạy sẽ tiếp tục chạy cho đến khi hoàn tất hoặc toàn bộ ứng dụng dừng lại.

- Lỗi ở hàm main không ảnh hưởng tới coroutine đang chạy.

#### `coroutineScope`

- Khi sử dụng `coroutineScope`, nếu xảy ra lỗi, tất cả các coroutine trong phạm vi sẽ bị hủy.


> [!NOTE]
> Hãy nhớ rằng cancellation của coroutine có tính hợp tác: chúng chỉ bị hủy nếu chủ động kiểm tra cancellation hoặc nếu chúng chạy các chức năng tạm ngưng, vì vậy compiler sẽ thực hiện kiểm tra cho chúng ta.


## Hướng dẫn sử dụng cancellation

Với quyền truy cập vào `context`, giờ đây chúng tôi có thể có nhiều quyền kiểm soát hơn nữa.
Nó cung cấp hai phương pháp để hủy công việc:
- `cancel()` → Hủy toàn bộ coroutine scope, dừng mọi thứ bên trong nó.
- `cancelChildren()` → Chỉ hủy các coroutine con, cho phép coroutine cha tiếp tục.

##Thất bại ở trẻ em


Thế còn tình huống khi một trong những đứa trẻ thất bại với một ngoại lệ nhưng chúng ta cần tất cả chúng hoàn thành để thực hiện công việc thì sao?

Ví dụ: nếu chúng ta đang tải xuống song song các phần khác nhau của một tệp lớn. Phạm vi sẽ hủy tất cả công việc, giống như cách nó đã làm trước đây. Tất cả các trường hợp ngoại lệ từ trẻ em đều được truyền tới cha mẹ. 

```kotlin
suspend fun loadImage(name: String) {
    if (name.endsWith("2")) {
        throw Exception("Error loading image")
    }
    delay(50) // imitate long-running operation
    println("Loaded $name")
}

// ... the rest is the same

suspend fun loadScreenInOwnScope(): Unit = coroutineScope {
    launch { loadImage("image_1") }
    launch { loadImage("image_2") }
    launch { preCache("image_3") }
}
```
Không có cancellation rõ ràng hơn nhưng thao tác tải thứ hai không thành công.

Mã này cũng sẽ không in gì vì lệnh mẹ sẽ hủy tải hình ảnh 1 và hình ảnh 3 vào bộ nhớ đệm ngay lập tức.

Đó là những gì chúng tôi muốn, ngoại trừ việc chúng tôi không muốn hủy mọi thứ khi bộ nhớ đệm trước không thành công, vì đây là một thao tác tùy chọn. Làm thế nào chúng ta có thể yêu cầu phạm vi xử lý nó theo cách khác?

## Công việc được giám sát

Để kiểm soát **chính sách cancellation**, chúng ta cần thay đổi loại công việc của hàm gốc và giám sát nó. Mỗi coroutine được đại diện bởi một đối tượng công việc. 
Đó là kết quả của việc khởi chạy coroutine builder và đó là những gì thực sự bị hủy bỏ khi chúng tôi gọi `CoroutineScope.cancel`

Một lớp công việc thông thường truyền bá các lỗi ở cả cấp dưới và cấp trên trong hệ thống phân cấp để hủy bỏ cả cấp độ con và cấp độ gốc.

Nếu chúng tôi thay đổi nó thành `SupervisorJob`, chúng tôi sẽ nói rằng **bây giờ chúng tôi sẽ điều khiển cancellation theo cách thủ công.**

Lỗi từ công việc con sẽ không ảnh hưởng đến công việc cha mẹ nữa và do đó sẽ không hủy các công việc con khác của cha mẹ đó,
trong khi vẫn hủy bỏ mọi thứ thuộc về đứa trẻ thất bại.

```kotlin
suspend fun loadScreenInSupervisedScope() = supervisorScope {
    val job1 = launch { loadImage("image_1") }
    val job2 = launch { loadImage("image_2") }
    val job3 = launch { throw Exception("Fail optional job") }
}
```

`supervisorScope` là một trình tạo phạm vi khác, nó bổ sung `SupervisorJob` thay vì `Job` thông thường vào bối cảnh và giờ đây lỗi trong `job3` sẽ không ảnh hưởng đến `job1` và `job2` nữa (chúng ta cũng có thể tạo một phạm vi như thế theo cách thủ công cho việc sử dụng sau này với cuộc gọi `CoroutineScope(SupervisorJob())`).

## Trạng thái thực thi

Giao diện công việc có rất nhiều thuộc tính tiện dụng để **kiểm tra** trạng thái thực thi hiện tại, **bắt đầu** nó nếu nó chưa chạy hoặc **hủy** nó khi không cần thiết nữa.
Nó cũng cho phép **chờ** công việc kết thúc: `job1.join()` sẽ tạm dừng cho đến khi `job1` hoàn thành.

Vì vậy chúng ta có thể chờ đợi các nhiệm vụ như sau:

```kotlin
job1.join()
job2.join()
```

Mã này trước tiên sẽ đợi `job1`, sau đó là `job2`; nếu chúng ta muốn đợi tất cả các công việc bất kể thứ tự của chúng, thì có một trình trợ giúp hữu ích `joinAll`:

```kotlin
joinAll(job1, job2)
```





