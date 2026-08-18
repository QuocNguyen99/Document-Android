# Kỹ thuật & vấn đề của Asynchronous programming

## Callback


Một giải pháp là để một hàm gọi lại hàm khác khi hoàn thành. Chúng ta chuyển hàm tiếp tục cho hàm đầu tiên làm đối số. Đối số này được gọi là callback.

```kotlin
fun sendData() {
    /** first call inside `sendData` is the same,
     it executes `prepareRequest` immediately **/
    prepareRequest { data ->
        /** code inside this lambda by convention will be executed 
        by `prepareRequest` when it's done **/
        submitRequest(data) { result ->
            /** another lambda is nested inside `submitRequest` 
            and will be called when it's done **/
            processResult(result)
        }
    }
}
```

Lưu ý rằng mã khá đơn giản này đã được lồng sâu và chúng tôi thậm chí không xử lý lỗi tại chỗ.

Trong cuộc sống thực, điều này có xu hướng phát triển ngoài tầm kiểm soát khá nhanh. 

Chúng ta có thể chuyển các hàm callback làm tham số (lambda callback chỉ là tham số)

```kotlin
fun sendData() {
    prepareRequest { data ->
        /** `processResult` callback can be passed directly if the input arguments match,
         but we can't pass `submitRequest` the same way to `prepareRequest` 
         because it doesn't know which callback `submitRequest` should call when done;
         only the root function `sendData` knows that  **/
        submitRequest(::processResult)
    }
}
```

nhưng điều đó che khuất tính logic của mã và cũng trở nên lộn xộn khi thực hiện nhiều thao tác.

## Tiện ích mở rộng tương lai và phản ứng

Có nhiều thư viện và SDK thực hiện điều đó với cái gọi là [Tương lai và lời hứa](https://en.wikipedia.org/wiki/Futures_and_promises) 

**Tương lai và Lời hứa** là các khái niệm trong asynchronous programming: 

Promise được sử dụng để gán một giá trị sẽ có trong tương lai, trong khi Future là một đối tượng chờ nhận giá trị đó. 

Lời hứa thường được nhà sản xuất sử dụng để hoàn thành hoặc từ chối một nhiệm vụ và tương lai được người tiêu dùng sử dụng để theo dõi và xử lý kết quả khi nó sẵn sàng. 

Chúng giúp viết mã không đồng bộ rõ ràng hơn và tránh các callback lồng nhau sâu.

Một mã lời hứa điển hình sẽ trông như thế này:


```js
fun sendData() {
    prepareRequest()
        .thenCompose { data ->  // this line means "execute this lambda" when done without errors
            submitRequest(data)
        }
        .thenAccept { result -> // this is similar but also means it's the final operation
            processResult(result)
        }
}
```

Bây giờ `submitRequest` và `processResult` lại ở cùng cấp độ (ngay cả khi chúng tôi vẫn có một phần lồng bổ sung), nhưng giờ đây chúng tôi có thể thêm nhiều hơn sau đó thực hiện các bước ở giữa mà không cần đi sâu hơn.

Nó trông đẹp hơn, nhưng nó có vấn đề riêng:
Mặc dù mã trông sạch sẽ hơn nhưng nó vẫn đi kèm với những thách thức: việc xử lý lỗi rất phức tạp và các cấu trúc điều khiển truyền thống như if/else và vòng lặp không được hỗ trợ nguyên bản.

[Tiện ích mở rộng phản ứng](https://en.wikipedia.org/wiki/ReactiveX), chẳng hạn như 
Thư viện RX (`RxJava`, `RxJS`) giải quyết một phần vấn đề cuối cùng đó bằng cách xử lý từng kết quả dưới dạng một luồng giá trị và cung cấp
một tập hợp phong phú các hàm trợ giúp (được gọi là toán tử) để hoạt động với luồng đó, nhưng điều đó thậm chí còn làm tăng thêm độ phức tạp.

## Coroutines và chức năng treo

Đây là nơi coroutine phát huy tác dụng.
**Một coroutine** có thể được coi là một thread nhẹ thực hiện các phép tính **có thể treo**.
Điều đó có nghĩa là hàm có thể tạm dừng việc thực thi một số thao tác chặn và tiếp tục lại sau khi thao tác đó hoàn tất, giống như với callback.

```kotlin
suspend fun sendData() {
    val data = prepareRequest() // suspending function
    val result = submitRequest(data) // also suspending function
    processResult(result)
}
```

> [!CAUTION]
> Chỉ các chức năng tạm dừng mới có thể gọi các chức năng tạm dừng khác.

Hơn nữa, giải pháp này không phụ thuộc vào bất kỳ thư viện bên thứ 3 hoặc thậm chí nền tảng nào nữa (nó sẽ hoạt động ngay cả với phần phụ trợ JS, không có chủ đề),
và mô hình này rất giống với **goroutines** (Go) hoặc **async/await** (C# và các mô hình khác) nổi tiếng.

## Phần kết luận

Coroutine cung cấp một cách để thực hiện các thao tác không đồng bộ mà không thay đổi mô hình mệnh lệnh quen thuộc.
Mã vẫn có thể đọc được, trong khi tính chất nhẹ của coroutine cho phép chúng ta khởi động hàng nghìn coroutine khi cần mà không phải lo lắng về việc tiêu thụ bộ nhớ.




























