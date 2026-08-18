# Collection và sự an toàn thread

## Collection cổ điển và multithreading


một số thread có thể truy cập đồng thời vào cùng một dữ liệu, điều này thường dẫn đến các vấn đề khác nhau trừ khi chúng tôi sử dụng một loại synchronization nào đó.

Các sự cố tương tự xảy ra khi nhiều thread truy cập collection:

- Hầu hết các collection cổ điển như `Array`, `List`, `Map` và `Set` đều không được đồng bộ hóa và do đó không cung cấp thread safety.
- Có một collection như `Hashtable`, `Vector` hoặc `Stack` (sẽ được thảo luận trong các chủ đề sau) hoàn toàn được đồng bộ hóa và thread-safe, **nhưng hiệu suất của chúng thấp**.
- Khi một thread đang lặp qua một collection được đồng bộ hóa hoàn toàn theo tiêu chuẩn và một thread khác cố gắng thêm một phần tử mới vào nó, thì chúng tôi nhận được một ngoại lệ runtime có tên là `ConcurrentModificationException`.

Chương trình sau đây minh họa race condition, xuất hiện khi hai thread thêm các phần tử vào cùng một collection.


```kotlin
import kotlin.concurrent.thread

fun addNumbers(target: MutableList<Int>) {
    for (i in 0 until 100_000) target += i
}

fun main() {
    val numbers = mutableListOf<Int>()

    val writer = thread(start = false, name = "Thread 1", block = {
        addNumbers(numbers)
    })
    writer.start()

    addNumbers(numbers) // add a number from the main thread

    writer.join() // wait for the writer thread

    println(numbers.size) // the result can vary
}
```

Kết quả mong đợi là `200000` (`100000` + `100000`), nhưng trên thực tế, nó thay đổi mỗi khi bạn chạy mã này. Một số thành phần danh sách bị mất.

Chúng tôi bắt đầu chương trình ba lần và nhận được kết quả như sau:

```bash
162527
140487
143736
```

Vì vậy, sẽ là một ý tưởng tồi khi sử dụng các collection tiêu chuẩn trong môi trường đa luồng mà không có synchronization rõ ràng. Tuy nhiên, một lần nữa, synchronization như vậy có thể dẫn đến hiệu suất kém và khó tìm ra lỗi trong các chương trình lớn.

## Collection đồng thời

Để tránh tất cả các vấn đề liên quan đến synchronization tùy chỉnh, Thư viện lớp Java cung cấp các triển khai collection thay thế được điều chỉnh cho các ứng dụng đa luồng và hoàn toàn an toàn với thread. Bạn có thể tìm thấy chúng trong gói `java.util.concurrent`, bao gồm các collection như `ConcurrentMap`, `ConcurrentLinkedQueue` và `CopyOnWriteArrayList`. Chúng giúp việc phát triển các ứng dụng Java hiện đại trở nên dễ dàng hơn.

Các collection đồng thời này cho phép bạn tránh được synchronization tùy chỉnh trong nhiều trường hợp và có hiệu suất cao – gần giống với các collection cổ điển

Các collection đồng thời không sử dụng chú thích `@Synchronized` mà dựa vào các nguyên hàm synchronization phức tạp hơn và thuật toán không khóa, cho phép chúng vừa an toàn vừa có hiệu suất cao với thread. **Tuy nhiên, nếu bạn không thực sự cần multithreading, hãy sử dụng các collection cổ điển vì chúng vẫn hiệu quả hơn các bộ sưu tập đồng thời.**

