# Tuyên bố thử bắt

Kotlin có cơ chế exception handling. Sau khi một dòng mã đưa ra một ngoại lệ, Kotlin sẽ cố gắng tìm một handler phù hợp cho nó. Ngay sau khi tìm thấy và thực thi một handler phù hợp, ngoại lệ được coi là đã được xử lý và chương trình sẽ chạy bình thường.

```kotlin
try {
    // code that may throw an exception
} catch (e: SomeException) {
    // code for handling the exception
}
```
Khối `try` được sử dụng để bọc mã có thể đưa ra ngoại lệ. Khối này có thể bao gồm tất cả các dòng mã, kể cả các lệnh gọi phương thức. Khối `catch` là handler cho loại ngoại lệ được chỉ định và tất cả các kiểu con của nó.

Hãy chú ý! Các biến được công bố trong khối `try` sẽ chỉ khả dụng bên trong khối: bạn không thể làm việc với chúng ở bên ngoài hoặc trong khối `catch`.

> [!NOTE]
>Nếu kết quả thực thi khối thử ném ra một ngoại lệ không lường trước được trong biểu thức bắt, chương trình sẽ thất bại bất chấp mọi biện pháp phòng ngừa.

## Vị trí và cách xử lý ngoại lệ

Về mặt kỹ thuật, một ngoại lệ có thể được xử lý theo phương thức xảy ra hoặc trong phương thức gọi. Cách tiếp cận tốt nhất để xử lý một ngoại lệ là thực hiện nó theo một phương pháp có đủ thông tin để đưa ra quyết định chính xác dựa trên ngoại lệ này.

Vì vậy, tại sao chúng ta nên loại bỏ các loại ngoại lệ cụ thể khi có `Exception` chung bao gồm tất cả các trường hợp có thể xảy ra và luôn phù hợp? 
Chà, hãy nhớ rằng đồng nghiệp của bạn hoặc thậm chí có thể chính bạn trong vài tuần nữa có thể không thực sự biết điều gì đang diễn ra trong mã. Tốt nhất bạn nên cung cấp càng nhiều thông tin càng tốt. Điều này sẽ làm cho việc xử lý ngoại lệ dễ dàng hơn nhiều.

**Luôn cố gắng tìm loại ngoại lệ phù hợp nhất với sự kiện đặc biệt của bạn.**

Trên thực tế, có một khối khác có thể gọi là `finally`. Tất cả các câu lệnh có trong khối này sẽ luôn thực thi bất kể ngoại lệ có xảy ra trong khối `try` hay không.

> [!TIP]
> Bạn sẽ thấy `finally` hữu ích trong các tình huống khi bạn cần thực hiện một số hành động hoàn thiện bất kể có đưa ra ngoại lệ hay không. Cũng có thể viết `try` và `finally` mà không cần khối `catch`

## Thử với tài nguyên

Khi luồng đầu vào được tạo, JVM sẽ thông báo cho OS về ý định làm việc với một tệp.

Nếu JVM process có đủ quyền và mọi thứ đều ổn thì OS trả về một bộ mô tả tệp — một chỉ báo đặc biệt được process sử dụng để truy cập tệp. Vấn đề là số lượng bộ mô tả tập tin bị hạn chế.

Đây là lý do tại sao điều quan trọng là phải thông báo cho OS rằng công việc đã hoàn thành và bộ mô tả tệp được lưu giữ có thể được giải phóng để sử dụng lại. Trong các ví dụ trước, chúng tôi đã gọi phương thức `close` cho mục đích này. Sau khi được gọi, JVM sẽ giải phóng tất cả tài nguyên hệ thống được liên kết với luồng.

Việc giải phóng tài nguyên hoạt động nếu JVM gọi phương thức `close`, nhưng có thể phương thức đó sẽ không được gọi chút nào.

Nhìn vào ví dụ:

```kotlin
val reader: Reader = FileReader("file.txt")
// code which may throw an exception
reader.close()
```

Giả sử có sự cố xảy ra trước khi gọi `close` và một ngoại lệ được đưa ra. Nó dẫn đến tình huống trong đó phương thức sẽ không bao giờ được gọi và tài nguyên hệ thống sẽ không được giải phóng. Có thể giải quyết vấn đề bằng cách sử dụng cấu trúc **try-catch-finally**:

```kotlin
var reader: Reader? = null
try {
    reader = FileReader("file.txt")
    // code which may throw an exception
} finally {
    reader!!.close()
}
```

**Thật không may, giải pháp này vẫn còn một số vấn đề**. Nghĩa là, phương pháp `close` có khả năng tự đưa ra các ngoại lệ. Giả sử có hai trường hợp ngoại lệ: trường hợp đầu tiên được đưa ra bên trong phần `try` và trường hợp thứ hai được đưa ra bởi phần `finally`. 

### Giải pháp

Một cách đơn giản và đáng tin cậy được gọi là **try-with-resources** đã được giới thiệu trong Java 7. Trong Kotlin, không có triển khai try-with-resources, nhưng chúng ta có thể áp dụng phương thức mở rộng `use`:


```kotlin
FileReader("file.txt").use {
    reader ->
    // some code
}
```


Như bạn thấy, không có lệnh gọi rõ ràng nào của phương thức `close` cả. Nó được gọi ngầm cho tất cả các đối tượng được khai báo trong phần đầu tiên. Việc xây dựng đảm bảo đóng tất cả các tài nguyên một cách thích hợp.

> [!TIP]
> Chắc chắn, chúng tôi cố gắng hết sức để viết chương trình không có lỗi. Tuy nhiên, thật khó để thấy trước tất cả các vấn đề có thể xảy ra. best practice phải đặt bất kỳ mã nào liên quan đến tài nguyên hệ thống trong phương thức `use`.

### Tài nguyên có thể đóng

Chúng tôi đã xử lý luồng đầu vào tệp để minh họa cách sử dụng tài nguyên thử. Tuy nhiên, không chỉ các tài nguyên dựa trên các tập tin mới được phát hành.

Việc đóng cũng rất quan trọng đối với các nguồn bên ngoài khác, như kết nối web hoặc cơ sở dữ liệu. Các lớp xử lý chúng có phương thức `close` và do đó, có thể được bao bọc bởi câu lệnh try-with-resources.

Ví dụ: hãy xem xét `java.util.Scanner`. Trước đó, chúng tôi đã sử dụng `Scanner` để đọc dữ liệu từ đầu vào tiêu chuẩn nhưng nó cũng có thể đọc dữ liệu từ một tệp. `Scanner` có phương pháp `close` để giải phóng các nguồn bên ngoài.

```kotlin
Scanner(File("file.txt")).use { scanner ->
    val first: Int = scanner.nextInt()
    val second: Int = scanner.nextInt()
    println("arguments: $first $second")
}
```

### Có gì bên dưới mui xe?

Việc thực hiện sử dụng trông như thế này:

```kotlin
public inline fun <T : Closeable?, R> T.use(block: (T) -> R): R {
    contract {
        callsInPlace(block, InvocationKind.EXACTLY_ONCE)
    }
    var exception: Throwable? = null
    try {
        return block(this)
    } catch (e: Throwable) {
        exception = e
        throw e
    } finally {
        when {
            apiVersionIsAtLeast(1, 1, 0) -> this.closeFinally(exception)
            this == null -> {}
            exception == null -> close()
            else ->
                try {
                    close()
                } catch (closeException: Throwable) {
                    // cause.addSuppressed(closeException) // ignored here
                }
        }
    }
}
```

Hàm này được định nghĩa là phần mở rộng chung trên các loại all` Closeable?`. `Closeable` là interface của Java sử dụng tài nguyên dùng thử.

Nếu Kotlin không triển khai các chức năng mở rộng sử dụng, chúng ta sẽ cần viết thêm mã, hãy xem:

```kotlin
import java.io.Closeable

fun main() {
    val resource = CustomCloseable()
    resource.use {
        println("I am an example of some code!")
        it.exampleMethod()
    }
    println("End of program!")
}

class CustomCloseable : Closeable {
    override fun close() {
        println("Close resource")
    }

    fun exampleMethod() {
        println("Example of some method for the CustomCloseable class")
    }
}
```

## Không có gì

**Kotlin là ngôn ngữ được gõ tĩnh. Điều này có nghĩa là mọi biểu thức trong Kotlin đều có một loại đã biết tại thời điểm biên dịch**

Trong Kotlin, `Nothing` là loại duy nhất vì **nó không có phiên bản**. Bạn có thể hỏi khi nào điều này hữu ích. **Nó có thể được sử dụng khi một hàm không bao giờ trả về một giá trị, thậm chí cả Đơn vị.**

Về bản chất, `Nothing` là một kiểu con của mọi loại đã biết trong Kotlin. Nó có nghĩa là nó có thể đại diện cho một giá trị thuộc bất kỳ loại nào về mặt kiểm tra loại.

Ví dụ: hãy xem xét một tình huống trong đó loại Nothing đặc biệt hữu ích:

```kotlin
fun fail(): Nothing {
    throw RuntimeException("This function always throws an exception")
}

fun calculatePercentage(marks: Int, total: Int): Float {
    if (total == 0) {
        fail()  // 'fail()' is used where a Float is expected
    }
    return (marks/total.toFloat()) * 100
}
```

## Bắt siêu loại

Hãy tưởng tượng một tình huống mà bạn gặp phải các loại ngoại lệ khác nhau và muốn xử lý chúng theo cách khác. 


```kotlin
fun main() {
    val input = readln()
    try {
        println(100 / input.toInt())
    } catch (e: Exception) {
        println("What else can go wrong!")
    } catch (e: NumberFormatException) {
        println("You didn't type an INT number!")
    } catch (e: ArithmeticException) {
        println("You typed 0!")
    }
}
```

Bằng cách sắp xếp lại các khối bắt và đặt các ngoại lệ cụ thể hơn trước, chúng tôi đảm bảo rằng khối bắt tương ứng sẽ thực thi chính xác.

câu lệnh when có thể giúp chúng ta viết mã ngắn gọn hơn để bắt nhiều ngoại lệ trong một khối bắt duy nhất:

```kotlin
fun main() {
    val input = readln()
    try {
        println(100 / input.toInt())
    } catch (e: Exception) {
        when (e) {
            is NumberFormatException -> println("You didn't type an INT number!")
            is ArithmeticException -> println("You typed 0!")
            else -> println("What else can go wrong!")
        }
    }
}
```


