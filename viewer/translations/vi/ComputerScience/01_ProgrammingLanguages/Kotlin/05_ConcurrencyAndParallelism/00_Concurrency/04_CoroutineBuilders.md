#Nhà xây dựng Coroutine

Như bạn nhớ, một máy không phải suspending function thông thường không thể gọi trực tiếp suspending function.
Đồng thời, nhiều loại ứng dụng bắt đầu bằng các hàm thông thường, vậy làm cách nào chúng ta có thể sử dụng coroutine?

Giải pháp cho vấn đề này là **trình tạo coroutine**.

coroutine builder là một hàm lấy suspending function làm tham số và lên lịch thực hiện.

Trình xây dựng có thể được gọi từ mã thông thường, đóng vai trò là cầu nối giữa các mặt phẳng treo và không treo.

## Đợi mã tạm dừng: `runBlocking`

`runBlocking` là một hàm thông thường lấy chính xác một suspending function, thực thi nó, đợi cho đến khi nó kết thúc và trả về kết quả của nó. Đây chính xác là những gì chúng ta cần trong hoàn cảnh của mình! Hãy thử xem:

```kotlin
import kotlinx.coroutines.delay
import kotlinx.coroutines.runBlocking

suspend fun doLotsOfWorkWithFile(file: String) = delay(5_000)

fun main() {
    runBlocking {                      // this lambda is our root suspending function
        println("Starting coroutine.") // it can contain regular functions
        doLotsOfWorkWithFile("a")      // and suspending functions as well
    }
    println("Work is done!")
}
```

Như bạn có thể thấy, chức năng chính của chúng tôi không tạm dừng mà bây giờ nó biên dịch và chạy đúng cách: độ trễ giữa hai đầu ra là 5 giây.
Có thể nói rằng chúng ta đang chờ coroutine hoàn thành trong mã thông thường.

Trên thực tế, đây là cách tiếp cận phổ biến cho các ứng dụng hoặc thử nghiệm đơn giản.
Nhưng nếu chúng ta cần thực hiện nhiều thao tác độc lập, chẳng hạn như nhận hai file từ hai máy chủ khác nhau thì sao? Chúng tôi vẫn có thể chạy chúng bằng cách chặn:

```kotlin
fun main() = runBlocking {
    println("Starting coroutine")
    doLotsOfWorkWithFile("a")   // there is no limit on how many suspending 
    doLotsOfWorkWithFile("b")   // functions a suspending function can call
    println("Work is done!")
}
```

Các hàm tạm dừng được thực thi tuần tự và chúng ta đang đợi toàn bộ coroutine kết thúc. Sẽ mất khoảng 10 giây. **Để khởi chạy các hoạt động khác nhau có thể bị tạm dừng độc lập, chúng tôi có thể sử dụng một trình tạo khác** — `launch`.

## Cháy và quên: `launch`

`launch` tương tự `runBlocking` về cú pháp nhưng có mục đích khác:
nó không đợi coroutine kết thúc mà ngay lập tức trả về một trình xử lý đặc biệt cho coroutine đã khởi chạy có tên là `Job`.

Bản thân coroutine vẫn tiếp tục hoạt động, nhưng chúng ta có thể kiểm tra trạng thái hoặc thậm chí hủy nó thông qua đối tượng `Job`.

Chúng ta sẽ nói về phạm vi sau, hiện tại chúng tôi đang sử dụng `GlobalScope` chỉ cho mục đích ví dụ.

```kotlin
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

fun main() {
    println("Starting")
    val importantJob = GlobalScope.launch {
        doLotsOfWorkWithFile("important_file") // waits for 5s
        println("Important file processed")    // will only print after 5s
    }
    val notImportantJob = GlobalScope.launch {
        doLotsOfWorkWithFile("optional_file")  // also waits 
        println("Optional file processed")
    }
    println("Finishing")
}       
```

Mã này sẽ không in `Important file processed` hoặc `Optional file processed` vì `main` không đợi coroutine được khởi chạy và trả về ngay lập tức. Đầu ra sẽ là:


```bash
Starting
Finishing
```

Để chờ kết quả, chúng ta vẫn cần chặn chức năng chính:

```kotlin
fun main() {
    println("Starting")
    val importantJob = GlobalScope.launch {
        doLotsOfWorkWithFile("important_file")
        println("Important file processed")
    }
    val notImportantJob = GlobalScope.launch {
        doLotsOfWorkWithFile("optional_file")
        println("Optional file processed")
    }
    // we still have to use runBlocking because join() is a suspending function
    runBlocking {
        importantJob.join()  // join() suspends until the job is done
    }
    notImportantJob.cancel() // cancel non important job if it's not done yet
    println("Finishing")
}
```


















    