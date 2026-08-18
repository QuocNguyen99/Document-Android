# Bối cảnh và người điều phối

## Bối cảnh

Interface `CoroutineScope` chỉ có một thuộc tính – `coroutineContext`, chứa tất cả thông tin mà coroutine cần để thực thi.

Nó tương tự như **bản đồ hoặc từ điển** — tất cả các giá trị được lưu trữ ở đó cùng với khóa của chúng. Nếu lấy ví dụ trước với phạm vi được giám sát, chúng ta có thể thấy những gì bên trong ngữ cảnh.


```kotlin
fun main() {
    val supervisedScope = CoroutineScope(SupervisorJob())

    println(supervisedScope)
}
```


Nó sẽ in một cái gì đó như `CoroutineScope(coroutineContext=SupervisorJobImpl{Active}@4534b60d)`

Trong trường hợp của chúng tôi, ngữ cảnh chỉ chứa một giá trị - công việc mà chúng tôi có thể truy cập bằng cách sử dụng Khóa đồng hành của interface `Job` như thế:

`supervisedScope.coroutineContext[Job]`. Chúng ta có thể thêm nhiều thứ hơn vào ngữ cảnh - ví dụ: handler lỗi:

```kotlin
val handler = CoroutineExceptionHandler { _, exception ->
    println("Caught ${exception.message}")
}

fun main() {
    val supervisedScope = CoroutineScope(SupervisorJob() + handler)

    println(supervisedScope)
}
```

Đầu ra sẽ trông như thế này: `CoroutineScope(coroutineContext=[SupervisorJobImpl{Active}@7e32c033, MainKt$special$inlined$CoroutineExceptionHandler$1@7ab2bfe1])`. Bây giờ chúng ta có hai yếu tố trong ngữ cảnh.


Nhưng handler là gì và chúng ta có thể đặt gì khác vào đó?

## Việc làm, ExceptionHandlers, Người điều phối

**Các yếu tố quan trọng nhất mà chúng tôi có thể thêm vào ngữ cảnh** là `Job`, `ExceptionHandler`, `Dispatcher`và các yếu tố khác (`CoroutineName`...).

- **Công việc** đại diện cho chính công việc đó, bao gồm cả thứ bậc công việc con. Nó có trạng thái (Đang hoạt động/Đã hoàn thành/Đã hủy) và xác định cách lỗi hoặc cancellation truyền đến công việc cha và con.

- **ExceptionHandler** xử lý các trường hợp ngoại lệ chưa được phát hiện trong một coroutine hoặc các coroutine con của nó. **Nó có thể rất hữu ích cho việc ghi nhật ký, nhưng lưu ý rằng nó không cung cấp cách bắt ngoại lệ**, vì vậy nó không thể được sử dụng để khôi phục sau lỗi – chúng tôi có `try/catch` cho việc đó. Ngoài ra, nó chỉ phải được cài đặt trên coroutine gốc vì các phần tử con sẽ tự động truyền các lỗi chưa được phát hiện đến phần gốc cho đến tận phần gốc.

- **Dispatcher** xác định thread hoặc thread nào sẽ được sử dụng để chạy mã coroutine.

### Quan trọng

- Điều quan trọng cần lưu ý là mặc dù chúng ta có thể thêm nhiều công việc, handler hoặc trình điều phối vào coroutine builder, **một coroutine chỉ có thể có một phần tử của mỗi loại, vì vậy phần tử cuối cùng luôn ghi đè tất cả các phần tử trước đó**. Ví dụ: `CoroutineScope(SupervisorJob() + handler1 + handler2)` sẽ sử dụng `handler2`.

- **Một thực tế quan trọng khác là nếu chúng tôi không cung cấp phần tử của từng loại thì phần tử mặc định sẽ được sử dụng.** Có một handler lỗi mặc định và một trình điều phối mặc định cho mỗi nền tảng. còn công việc nếu không được cung cấp thì sẽ tạo công việc mới cho chúng ta. Không thể có một công việc mặc định duy nhất vì mỗi công việc đại diện cho một coroutine riêng.

## Thông tin thêm về Người điều phối

Dispatcher chỉ là một interface và chúng ta có thể tự triển khai nếu cần.

Trên thực tế, hầu hết các nền tảng (như JS, JVM/Android, Native), đều có bộ điều phối cụ thể của riêng chúng ngoài ba bộ điều phối tiêu chuẩn có sẵn ở mọi nơi.

- `Dispatchers.Default` – đúng như tên gọi, bộ điều phối này sẽ được sử dụng nếu không có bộ điều phối nào được chỉ định rõ ràng. **Nó lên lịch thực thi coroutine trong background thread từ thread pool được chia sẻ**. Đó là một lựa chọn tốt cho tất cả các loại tính toán sử dụng CPU.
- `Dispatchers.IO` – nó sử dụng một thread pool được chia sẻ khác và được thiết kế để xử lý tải I/O với nhiều thao tác có thể chặn việc chờ dữ liệu. Sử dụng nó để đọc/ghi đĩa và network request.
- `Dispatchers.Unconfined` — nó bắt đầu thực thi một coroutine trong thread hiện tại và chạy cho đến lần tạm ngưng đầu tiên; sau đó, nó sẽ tiếp tục ở thread phù hợp khác. Thông thường, bộ điều phối này **không nên được sử dụng**.


Trong trường hợp chúng ta cần sử dụng nhóm một hoặc nhiều thread của riêng mình, thì có các hàm trợ giúp `newSingleThreadContext()` và `newFixedThreadPoolContext()`, đảm nhiệm việc tạo thread pool và bộ điều phối sử dụng nó để thực thi.
**Chúng có thể hữu ích nếu chúng ta cần chạy một số lượng công việc nền chạy dài cố định.**

Tuy nhiên, để chỉ giới hạn số lượng thread song song được phép thực thi, **coroutines v1.6** cung cấp tùy chọn tốt hơn — `limitedParallelism()`.
Chức năng này có thể được áp dụng cho bất kỳ bộ điều phối đa luồng nào để đảm bảo rằng không quá N coroutine sẽ chạy song song.

Chẳng hạn, `Dispatchers.IO.limitedParallelism(2)` sử dụng cùng một nhóm IO được chia sẻ nhưng chỉ cho phép sử dụng hai thread.
Ví dụ: sẽ hữu ích nếu chúng tôi chỉ được phép mở một số lượng kết nối DB có giới hạn. Bất kỳ số lượng lượt xem parallelism giới hạn nào cũng có thể được tạo trên đầu bộ điều phối.

## Bối cảnh inheritance

Khi một coroutine được tạo, nó sẽ kế thừa hầu hết các phần của ngữ cảnh gốc, ngoại trừ Công việc. Điều này có nghĩa là:

- Nếu không có gì bị ghi đè rõ ràng, coroutine con sẽ sử dụng cùng một `Dispatcher`, `CoroutineExceptionHandler`, v.v., làm coroutine mẹ.

- Nếu một coroutine con ghi đè `Dispatcher` thì thay đổi sẽ chỉ áp dụng cho chính nó và các coroutine con của chính nó.

```kotlin
val handler = CoroutineExceptionHandler { _, exception ->
    println("Caught ${exception.message}")
}

fun main(): Unit = runBlocking(handler) {
    println("root              : ${this.coroutineContext}")
    launch { // uses context of the parent, creates a new job
        println("first             : ${this.coroutineContext}")

        launch { // still same context, another new job
            println("first->same       : ${this.coroutineContext}")
        }

        launch(Dispatchers.Default) { // overrides the dispatcher
            println("first->default    : ${this.coroutineContext}")

            launch(Dispatchers.IO) { // overrides the dispatcher once more
                println("first->default->IO: ${this.coroutineContext}")
            }
        }
    }
}
```

đầu ra:

```bash
root              : [MainKt$special$$inlined$CoroutineExceptionHandler$1@73a8dfcc, BlockingCoroutine{Active}@1c655221, BlockingEventLoop@58d25a40]
first             : [MainKt$special$$inlined$CoroutineExceptionHandler$1@73a8dfcc, StandaloneCoroutine{Active}@626b2d4a, BlockingEventLoop@58d25a40]
first->same       : [MainKt$special$$inlined$CoroutineExceptionHandler$1@73a8dfcc, StandaloneCoroutine{Active}@14899482, BlockingEventLoop@58d25a40]
first->default    : [MainKt$special$$inlined$CoroutineExceptionHandler$1@73a8dfcc, StandaloneCoroutine{Active}@1c1817d6, Dispatchers.Default]
first->default->IO: [MainKt$special$$inlined$CoroutineExceptionHandler$1@73a8dfcc, StandaloneCoroutine{Active}@6809a6a3, Dispatchers.IO]
```

1. `CoroutineExceptionHandler` xử lý lỗi. Nó được gán cho runBlocking, nghĩa là coroutine gốc có thể xử lý các ngoại lệ và các phần tử con của nó sẽ kế thừa hành vi này.
2. `runBlocking` đóng vai trò là coroutine gốc và chứa `handler`.
3. Tạo coroutine con đầu tiên: Coroutine này kế thừa toàn bộ **bối cảnh** của `runBlocking`, bao gồm `handler` và `BlockingEventLoop`.
4. Tuy nhiên, nó tạo ra một `Job` mới, vì mỗi lần khởi chạy luôn bắt đầu bằng một `Job` riêng biệt.
5. Trước tiên, tạo một coroutine lồng nhau bên trong: Kế thừa toàn bộ ngữ cảnh của `first`, bao gồm `handler` và `BlockingEventLoop`. Vẫn nhận được một `Job` riêng biệt.
6. Ghi đè `Dispatcher` thành `Default`: Vẫn kế thừa `handler`, nhưng thay đổi Dispatcher từ `BlockingEventLoop` thành `Dispatchers.Default`.
7. Ghi đè thêm Dispatcher thành `IO`: Vẫn kế thừa `handler` nhưng thay đổi Dispatcher từ `Default` thành `IO`.

## Chuyển ngữ cảnh

Ví dụ trên cho thấy cách chạy nhiều công việc đồng thời trong các bối cảnh khác nhau, nhưng trong cuộc sống thực, chúng ta thường cần một thứ đơn giản hơn nhiều.


Ví dụ: hãy xem xét một ứng dụng UI cần tải một số dữ liệu từ đĩa để hiển thị, việc này có thể mất một chút thời gian và do đó không thể được thực thi trong main thread mà không đóng băng UI.

Kotlin đưa ra giải pháp cho vấn đề đó. Nó được gọi là `withContext`. Đúng như tên gọi, nó thực thi một khối mã với ngữ cảnh mới.
Như được hiển thị trước đó, nó kế thừa bối cảnh và nếu bộ điều phối được chỉ định, sẽ chuyển việc thực thi sang thread mới. **Nhưng bây giờ thứ tự thực hiện là tuần tự.**


## Parallelism trong coroutine

Trong khi `withContext` thực thi tác vụ một cách tuần tự, Trong trường hợp Chạy đa nhiệm, chúng ta phải sử dụng:

### 1. `async` + `await`

- Dùng để chạy nhiều coroutine cùng lúc.
- Trả về kết quả `Deferred` có thể được **chờ**.
- Hữu ích khi bạn muốn chạy song song các tác vụ và kết hợp kết quả của chúng.

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking {
    val task1 = async { performTask1() }
    val task2 = async { performTask2() }

    // Await results of all tasks
    val result1 = task1.await()
    val result2 = task2.await()

    println("Results: $result1, $result2")
}

suspend fun performTask1(): String {
    println("Starting task 1")
    delay(1000) // Simulate a long-running task
    return "Task 1 Completed"
}

suspend fun performTask2(): String {
      println("Starting task 2")
    delay(1000) // Simulate a long-running task
    return "Task 2 Completed"
}
```

### 2. `launch`

- Mỗi `launch` tạo một coroutine mới chạy độc lập.
- Vì các coroutine này được tạo trong cùng một coroutineScope nên chúng thực thi đồng thời (song song).

```kotlin
suspend fun loadScreenInOwnScope(): Unit = coroutineScope {
    launch { loadImage("image_1") }
    launch { loadImage("image_2") }
    launch { preCache("image_3") } 
}
```

### Trường hợp sử dụng
- Nếu bạn muốn thu thập kết quả từ mỗi tác vụ, bạn sẽ sử dụng async thay vì `launch`
- `launch` được sử dụng khi bạn muốn kích hoạt và quên một coroutine. Bạn không cần kết quả từ coroutine và bạn chỉ muốn thực hiện một số công việc đồng thời.







