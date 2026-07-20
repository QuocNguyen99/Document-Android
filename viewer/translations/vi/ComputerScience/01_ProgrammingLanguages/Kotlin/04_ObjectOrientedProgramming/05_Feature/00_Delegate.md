# đại biểu

Ủy quyền là process sử dụng một đối tượng nhất định thay vì cung cấp triển khai

## Cú pháp ủy quyền

Giả sử chúng ta có mã khá đơn giản - một giao diện và cách triển khai:

```kotlin
interface MyInterface {
    fun print()
    val msg: String
}

class MyImplementation : MyInterface {
    override fun print() {
        println(msg)
    }

    override val msg: String = "MyImplementation sends regards!"
}
```

Bây giờ, giả sử rằng chúng ta cần tạo một lớp mới, lớp này sẽ 
1. có một số chức năng riêng
2. sẽ triển khai giao diện đã cho cùng một lúc

Chúng tôi tình cờ gặp phải việc sao chép-dán mã: chúng tôi đã triển khai giao diện này, nhưng chúng tôi cần một lớp khác, tuy nhiên, lớp này vẫn cần triển khai giao diện này.

Đó là nơi sự ủy quyền phát huy tác dụng. hóa ra là chúng ta có thể vui vẻ viết mã lớp mới của mình và khi cần sử dụng cách triển khai giao diện, chúng ta chỉ tham chiếu cách triển khai hiện có và Kotlin sẽ thực hiện phần còn lại. Giống như vậy:

```kotlin
class MyNewClass(  
        base: MyInterface) 
        // ^ Here we expect an implementation of MyInterface as a parameter (named "base")  
        : MyInterface by base { 
        // ^ And here we state that MyInterface is implemented by the previously obtained parameter, the one named "base"  
    override val msg = "Delegate sends regards."  
}

// We create an instance of class, implementing MyInterface
val delegate = MyImplementation()  

// Then we pass this implementation instance as a parameter
val delegatingObj = MyNewClass(delegate)  
println(delegatingObj.msg)
```

Về cơ bản, trong hàm tạo của lớp này, chúng tôi yêu cầu thứ gì đó triển khai giao diện `MyInterface` được đánh dấu bằng dấu hai chấm `:`, sau đó, bằng cách sử dụng từ khóa `by`, chúng tôi sẽ thông báo cho lớp dẫn xuất rằng bất cứ khi nào nó được yêu cầu thực hiện bất kỳ điều gì mà giao diện `MyInterface` "đã hứa", nó sẽ sử dụng đối tượng được cung cấp để làm như vậy.

## Ưu điểm của việc ủy ​​quyền lớp

- **Nó đơn giản hóa mã**: ủy quyền lớp tránh trùng lặp mã bằng cách ủy quyền triển khai giao diện hoặc chức năng cho lớp khác.
- **Nó cải thiện composition và tính mô-đun**: thay vì sử dụng inheritance, bạn có thể kết hợp các đối tượng khác nhau để tạo ra chức năng mới.
- **Nó ngăn ngừa nhiều sự cố inheritance**: không giống như inheritance, việc ủy ​​quyền không dẫn đến các sự cố liên quan đến nhiều inheritance, chẳng hạn như "sự cố kim cương".
- **Nó cung cấp sự linh hoạt để thay đổi hành vi của đối tượng**: bạn có thể dễ dàng thay thế một đại biểu để thay đổi hành vi của một đối tượng mà không cần thay đổi source code.

### Giải quyết các vấn đề phức tạp bằng cách ghi đè

Tuy nhiên, đôi khi, khi một lớp triển khai nhiều giao diện, chúng ta có thể gặp phải tình huống khi nó kế thừa nhiều cách triển khai của cùng một phương thức hoặc thuộc tính. Điều này dẫn đến xung đột.

Chính xác thì mã này sẽ làm gì?

```kotlin
val delegate = MyImplementation()
val delegatingObj = MyNewClass(delegate)

delegatingObj.print()
```

Mã này sẽ in dòng sau:
```bash
MyImplementation sends regards!
```

`MyNewClass` không có bất kỳ phương thức nào có tên `print()`. Nhưng nó có phiên bản `base`, đây là phiên bản triển khai của `MyInterface`, phiên bản này có hàm `print()` và hàm đó được gọi khi chúng ta viết `delegate.print()`. Vì vậy, lớp `MyNewClass` chỉ giao nhiệm vụ này cho `MyImplementation` (đại biểu). `MyImplementation` chứa `msg` bị ghi đè, có nội dung `MyImplementation` gửi lời chúc mừng!, vì vậy mã chỉ in `MyImplementation` gửi lời chúc mừng! đến bảng điều khiển.

> [!NOTE]
> Khi bạn sử dụng tính năng ủy quyền, hãy cẩn thận phân biệt giữa các thuộc tính/phương thức được ghi đè của lớp ủy nhiệm và những thuộc tính/phương thức sẽ chỉ sử dụng triển khai cơ sở và dữ liệu của nó.

Chúng ta hãy xem xét một trường hợp phức tạp hơn có không chỉ một mà là hai đại biểu!

```kotlin
// Defines the contract for callbacks
interface ICallbackReceiver {
    fun onBeforeAction()
    fun onAfterAction()
    fun action(function: () -> Unit) {
        onBeforeAction()
        function()
        onAfterAction()
    }
}

// Defines the contract for logging
interface ILogger {
    fun getStubDateTime() = "05.11.2022-14:31:04" // placeholder date and time

    val format: String
        get() = "[${getStubDateTime()}]: "

    fun print(s: String)
}

// Simple implementation of ILogger interface
class BasicLogger : ILogger {
    override fun print(s: String) = println(format + s)
}

// Implementation of ICallbackReceiver that uses BasicLogger for printing
class ConsoleNotifier(logger: ILogger) : ICallbackReceiver, ILogger by logger {
    val onBeforeStr = "OnBefore!"
    val onAfterStr = "OnAfter!"

    // "print" is delegated to "logger"
    override fun onBeforeAction() = print(onBeforeStr)
    override fun onAfterAction() = print(onAfterStr)
}

// Class implementing both interfaces by delegation
class ExampleParser(notifier: ConsoleNotifier, logger: BasicLogger) :
    ICallbackReceiver by notifier,
    ILogger by logger {

    fun start() = action { parseFiles() }

    fun parseFiles() {
        print("Parsing...")
        // do some file parsing
    }
}


fun main() {
    val loggerInstance = BasicLogger()
    val dateTimeNotifier = ConsoleNotifier(loggerInstance)

    val simpleParser = ExampleParser(dateTimeNotifier, loggerInstance)
    simpleParser.start()
}


```
đầu ra
```bash
[05.11.2022-14:31:04]: OnBefore!
[05.11.2022-14:31:04]: Parsing...
[05.11.2022-14:31:04]: OnAfter!
```

Hãy nhớ rằng có một cách khác để chỉ định các hàm tạo của lớp `ExampleParser`, để nó trở nên linh hoạt hơn và mong đợi mọi triển khai giao diện `ICallbackReceiver` và `ILogger`. Điều này có nghĩa là bạn có thể chuyển bất kỳ đối tượng nào triển khai các giao diện này, không chỉ `ConsoleNotifier` và `BasicLogger`. **Điều này cho phép linh hoạt hơn và nói chung là cách thực hành tốt hơn vì nó tuân theo nguyên tắc "lập trình cho giao diện chứ không phải triển khai", đây là nguyên tắc chính trong object-oriented programming.**
