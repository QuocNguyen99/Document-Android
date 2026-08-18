#Kỹ thuật gỡ lỗi

những cách phổ biến nhất mà các lập trình viên sử dụng để gỡ lỗi chương trình:
- Ghi nhật ký
- Khẳng định
- Đính kèm trình gỡ lỗi

## Gỡ lỗi ứng dụng multithreading

Trước khi đi sâu vào sự phức tạp của việc gỡ lỗi các ứng dụng đa thread, điều quan trọng là phải hiểu các nguyên hàm concurrency của Kotlin. Kotlin hoạt động trên JVM và do đó cung cấp quyền truy cập vào các luồng Java, một đơn vị cơ bản của concurrency. Đây là cách bạn có thể bắt đầu một thread đơn giản trong Kotlin:

```kotlin
val thread = Thread {
    // Code to run in parallel
    println("This runs on a separate thread!")
}
thread.start()
```

Ngoài ra, Kotlin còn cung cấp một cách xử lý concurrency mạnh mẽ và linh hoạt hơn bằng coroutine - các thread nhẹ được quản lý bởi Kotlin runtime thay vì hệ điều hành. Sau đây là cách khởi chạy một coroutine:

```kotlin
import kotlinx.coroutines.*

GlobalScope.launch {
    // Code to run asynchronously
    println("This runs on a coroutine!")
}
```

Đối với synchronization, Kotlin cung cấp nhiều cơ chế khác nhau để đảm bảo thread safety. Chúng bao gồm chú thích `@Synchronized`, từ khóa `volatile` và các khóa rõ ràng như `ReentrantLock` hoặc `Mutex` trong coroutine.


```kotlin
var counter = 0

@Synchronized
fun increment() {
    counter++
}
```

### Thiết lập môi trường gỡ lỗi cho các ứng dụng Kotlin đa luồng

Để gỡ lỗi các ứng dụng Kotlin đa luồng một cách hiệu quả, bạn cần có Môi trường phát triển tích hợp (IDE) hỗ trợ Kotlin và các cấu trúc concurrency của nó, như IntelliJ IDEA.

1. **Điểm dừng**: Thiết lập điểm dừng bằng cách nhấp vào rãnh bên cạnh số dòng trong IntelliJ IDEA. Đối với multithreading, hãy sử dụng các điểm dừng có điều kiện chỉ kích hoạt trong các điều kiện cụ thể. Chiến lược này hữu ích khi xử lý các điều kiện chủng tộc hoặc các trạng thái thread cụ thể.

```kotlin
if (Thread.currentThread().name == "MyThread") {
    println("Breakpoint hit by specific thread")
}
```

2. **Kiểm tra trạng thái Thread**: IntelliJ IDEA cho phép bạn xem tất cả các thread đang chạy và trạng thái của chúng trong cửa sổ Gỡ lỗi. Bằng cách chuyển đổi giữa các thread, bạn có thể xem call stack và xác định xem thread có bị chặn hay đang chờ một điều kiện hay không.

3. **Trình gỡ lỗi Kotlin Coroutine**: Các coroutine của Kotlin đơn giản hóa asynchronous programming, nhưng việc hiểu trạng thái và cách thực thi gỡ lỗi của chúng đòi hỏi một cách tiếp cận chi tiết hơn. IntelliJ IDEA cung cấp trình gỡ lỗi coroutine giúp trực quan hóa và theo dõi quá trình thực thi coroutine. Để sử dụng nó, bạn cần kích hoạt tác nhân coroutine cho trình gỡ lỗi.

```kotlin
// Add to build.gradle (Kotlin DSL)
tasks.withType<org.jetbrains.kotlin.gradle.tasks.KotlinCompile> {
    kotlinOptions {
        freeCompilerArgs += "-Xdebug-agent"
    }
}

```

Sau khi bật, bạn có thể xem các coroutine đang hoạt động trong tab *Coroutines* trong phiên gỡ lỗi, kiểm tra dấu vết ngăn xếp quá trình tạo coroutine và hiểu mối quan hệ giữa coroutine và thread.

### Xác định các sự cố Multithreading phổ biến

Các ứng dụng đa luồng Kotlin có thể gặp phải một số sự cố concurrency, có thể khó gỡ lỗi. Dưới đây là một số vấn đề phổ biến và các kỹ thuật phát hiện dành riêng cho Kotlin:

- **Bế tắc**, Bế tắc xảy ra khi hai hoặc nhiều thread đang chờ nhau giải phóng tài nguyên. Chúng có thể được phát hiện bằng cách kiểm tra các bãi chứa thread để biết các điều kiện chờ vòng tròn. Trong Kotlin, bạn có thể tạo kết xuất thread bằng cách gửi tín hiệu SIGQUIT tới JVM hoặc sử dụng JConsole.

```kotlin
    // Example of a simple deadlock
    val resource1 = Any()
    val resource2 = Any()
    Thread {
        synchronized(resource1)
        {
            Thread.sleep(100) 
            synchronized (resource2)
            { println("Thread 1: Locked resource 2") }
        }
    }.start() 
    Thread { synchronized(resource2) { Thread.sleep(100) 
        synchronized (resource1) { println("Thread 2: Locked resource 1") } } }.start()
```

- **Điều kiện cuộc đua** Điều kiện cuộc đua xảy ra khi nhiều thread truy cập vào dữ liệu được chia sẻ và ít nhất một thread sửa đổi dữ liệu đó. Để phát hiện các điều kiện tương tranh, hãy sử dụng các công cụ như `ThreadSanitizer` có thể được tích hợp với Kotlin/Trình biên dịch gốc process.

- **Thread Chết đói** Thread chết đói xảy ra khi thread liên tục bị từ chối quyền truy cập vào tài nguyên hoặc thời gian CPU vì các thread khác đang độc quyền chúng. Điều này có thể được phát hiện bằng cách lập hồ sơ ứng dụng và kiểm tra các thread có thời gian chờ cao. Các coroutine Kotlin cung cấp structured concurrency có thể giúp quản lý việc sử dụng thread hiệu quả hơn.

### Áp dụng các phương pháp hay nhất để gỡ lỗi đa luồng

Việc gỡ lỗi các ứng dụng đa luồng có thể gặp khó khăn do tính chất thực thi đồng thời. Dưới đây là các chiến lược để tách biệt và giải quyết các vấn đề concurrency trong Kotlin:

1. **Viết Mã an toàn Thread**:
Đảm bảo rằng mã của bạn an toàn để gọi từ nhiều thread. Bảo vệ các phần quan trọng bằng các khối được đồng bộ hóa hoặc ReentrantLock.

```kotlin
val lock = ReentrantLock()
fun threadSafeFunction() {
    lock.lock()
    try {
        // Critical section
    } finally {
        lock.unlock()
    }
}
```

2. **Tránh trạng thái Mutable được chia sẻ**

Giảm thiểu trạng thái được chia sẻ giữa các thread hoặc đặt thành immutable.
Trong Kotlin, bạn có thể sử dụng `val` cho các biến immutable và `ImmutableList` cho các collection không thể sửa đổi sau khi tạo.

```kotlin
val immutableList = listOf(1, 2, 3) // ImmutableList
```

3. Sử dụng Công cụ Concurrency của Kotlin:

Kotlin có hỗ trợ tích hợp cho concurrency, chẳng hạn như Coroutines.
Chúng đơn giản hóa việc viết mã không đồng bộ và quản lý các thread.

```kotlin 
GlobalScope.launch {
    // Coroutine that runs on a separate thread
}
```
4. Giam giữ Thread
Giới hạn dữ liệu mutable trong một thread bằng cách sử dụng bộ lưu trữ cục bộ thread hoặc đảm bảo rằng mỗi lần chỉ một thread có thể truy cập dữ liệu.


```kotlin 
val threadLocal = ThreadLocal<String>()
```

Khi gỡ lỗi các sự cố concurrency, điều quan trọng là phải tái tạo sự cố một cách nhất quán. 
Thực hiện việc này bằng cách đơn giản hóa kịch bản, giảm parallelism và sử dụng tính năng ghi nhật ký để theo dõi chuỗi sự kiện. 
Hãy nhớ rằng, các phương pháp viết và gỡ lỗi mã đa luồng có kỷ luật và mạnh mẽ là chìa khóa để tạo ra các ứng dụng đáng tin cậy, có thể bảo trì.


### Tận dụng các công cụ và kỹ thuật nâng cao cho Multithreading

1. **Trình hồ sơ**

Các công cụ như trình tạo hồ sơ IntelliJ IDEA hoặc VisualVM cho phép bạn giám sát hiệu suất ứng dụng trong thời gian thực. 
Bạn có thể theo dõi việc sử dụng CPU, mức tiêu thụ bộ nhớ và hoạt động thread. 
Ví dụ: để xác định nút thắt cổ chai trong ứng dụng Kotlin, bạn có thể sử dụng đoạn mã như thế này:

```kotlin 
fun main() {
    // Start profiling session here
    val problematicCode = Thread {
        // Simulate complex operation
        Thread.sleep(1000)
    }
    problematicCode.start()
    problematicCode.join()
    // End profiling session and analyze results
}
```

Mặc dù đoạn mã trên rất đơn giản nhưng trong quá trình lập hồ sơ, bạn sẽ tìm kiếm các thread có vẻ bị kẹt hoặc đang tiêu tốn quá nhiều tài nguyên.

2. **Máy phân tích kết xuất Thread**

Một công cụ thiết yếu khác là máy phân tích kết xuất thread. 
Nó giúp bạn hiểu trạng thái của chủ đề tại một thời điểm cụ thể. 
Kết xuất thread cung cấp ảnh chụp nhanh của tất cả các ngăn xếp cuộc gọi thread và có thể được tạo trong Kotlin bằng cách sử dụng như sau:

```kotlin 
val threadMXBean = ManagementFactory.getThreadMXBean()
val threadInfos = threadMXBean.dumpAllThreads(true, true)
threadInfos.forEach { println(it) }
```

## Trình gỡ lỗi dưới mui xe

### Tìm hiểu Kiến trúc trình gỡ lỗi Kotlin

Về cốt lõi, kiến ​​trúc trình gỡ lỗi dựa trên Java Virtual Machine (JVM) để thực thi mã Kotlin vì Kotlin là ngôn ngữ được nhắm mục tiêu JVM-.


Khi ứng dụng Kotlin chạy ở chế độ gỡ lỗi, JVM sử dụng Protocol dây gỡ lỗi Java (JDWP) để liên lạc với trình gỡ lỗi.
Protocol này cho phép truyền thông tin gỡ lỗi giữa JVM và interface trình gỡ lỗi.

Đây là một cái nhìn đơn giản về sự tương tác:

```kotlin
fun main() {
    val message = "Debugging in Kotlin"
    println(message) // A breakpoint is set here
}
```

Khi đạt đến điểm dừng, JVM sẽ báo hiệu cho trình gỡ lỗi, sau đó trình gỡ lỗi sẽ kiểm soát việc thực thi chương trình. 
Sau đó, trình gỡ lỗi có thể **kiểm tra các biến**, **đánh giá các biểu thức** và duyệt qua mã.


JVM đóng một vai trò quan trọng trong process này bằng cách cung cấp các hook và API cần thiết cho trình gỡ lỗi để kiểm soát luồng ứng dụng.
Ví dụ: JVM (Interface công cụ) của JVM cung cấp các tính năng như đặt điểm dừng, duyệt qua mã và truy cập call stack.

Nhìn chung, kiến ​​trúc trình gỡ lỗi Kotlin được xây dựng dựa trên khả năng gỡ lỗi của JVM. Nó sử dụng JDWP để giao tiếp với Kotlin runtime


### Điểm dừng và Thực thi Flow

Khi bạn chạy chương trình ở chế độ gỡ lỗi và đến dòng này, quá trình thực thi sẽ tạm dừng, cho bạn cơ hội kiểm tra trạng thái của chương trình. 
Việc kiểm tra này bao gồm việc kiểm tra các giá trị của các biến, như thông báo trong ví dụ trên hoặc đánh giá các biểu thức khi đang di chuyển.

Hầu hết các IDE đều cung cấp một số tùy chọn:

- **Bước qua**: Thực thi dòng mã tiếp theo mà không cần đi sâu vào các phương thức.

- **Bước vào**: Nếu dòng tiếp theo chứa lệnh gọi phương thức, nó sẽ đi vào bên trong phương thức để tiếp tục gỡ lỗi từng dòng một.

- **Step Out**: Hoàn thành phương thức hiện tại và quay lại phương thức gọi.

- **Chạy tới con trỏ**: Tiếp tục thực thi cho đến dòng chứa con trỏ.

### Tính năng gỡ lỗi nâng cao trong Kotlin

#### Điểm dừng có điều kiện

Điểm ngắt có điều kiện chỉ tạm dừng thực thi khi điều kiện đã chỉ định là đúng. Chúng rất hữu ích khi dừng các vòng lặp hoặc các lệnh gọi phương thức thường xuyên.

```kotlin
for (i in 1..100) {
    // Set a conditional breakpoint with the condition (i == 50)
    println(i)
}
```

#### Điểm dừng ngoại lệ

Điểm dừng ngoại lệ tạm dừng thực thi bất cứ khi nào một ngoại lệ được chỉ định được ném ra, điều này rất hữu ích cho việc phát hiện và chẩn đoán lỗi.

```kotlin
try {
    // Code that might throw an exception
} catch (e: Exception) {
    // Set an exception breakpoint on this line for Exception
}
```

#### Ghi nhật ký điểm dừng

Điểm dừng ghi nhật ký cho phép bạn ghi nhật ký thông báo vào bảng điều khiển mà không cần dừng chương trình. Nó rất hữu ích để theo dõi mà không làm gián đoạn dòng chảy.


### Hiệu suất và hạn chế

Việc gỡ lỗi có thể tác động đáng kể đến hiệu suất của ứng dụng Kotlin do chi phí giám sát và nắm bắt trạng thái của chương trình tăng thêm. 
Khi đính kèm trình gỡ lỗi, ứng dụng Kotlin chạy chậm hơn vì nó thường tắt một số tối ưu hóa nhất định và duy trì thông tin bổ sung.

Để giảm thiểu tác động này, nhà phát triển có thể sử dụng các kỹ thuật như:

- **Điểm dừng có điều kiện**: Đặt điểm dừng chỉ được kích hoạt khi một điều kiện cụ thể đúng, để tránh các điểm dừng không cần thiết.
- **Trình phân tích mẫu**: Các công cụ này chụp nhanh trạng thái của ứng dụng theo từng khoảng thời gian, làm giảm mức độ ảnh hưởng đến hiệu suất so với các trình phân tích thiết bị.
- **Proxy gỡ lỗi**: Trong Kotlin, proxy gỡ lỗi, trong ngữ cảnh của các ứng dụng đa luồng, là một kỹ thuật được sử dụng để tách process gỡ lỗi thành một thread duy nhất.

Tuy nhiên, trình gỡ lỗi Kotlin có một số hạn chế:

- **Dự án đa nền tảng**: Mặc dù Kotlin hướng tới mục tiêu đa nền tảng, nhưng việc hỗ trợ gỡ lỗi cho các nền tảng khác ngoài JVM có thể không mạnh mẽ bằng.
- **Hàm nội tuyến**: Các hàm `inline` của Kotlin có thể khó gỡ lỗi hơn vì chúng được mở rộng tại thời gian biên dịch, điều đó có nghĩa là trình gỡ lỗi có thể không thể hiện chính xác call stack.
- **Coroutine**: Việc gỡ lỗi mã không đồng bộ bằng coroutine có thể gặp khó khăn do luồng thực thi phi tuyến tính.

