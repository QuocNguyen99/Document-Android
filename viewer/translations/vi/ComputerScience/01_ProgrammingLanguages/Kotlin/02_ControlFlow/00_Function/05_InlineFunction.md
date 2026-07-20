# Hàm nội tuyến và kiểu thống nhất trong Kotlin

## Định nghĩa hàm nội tuyến

Hàm `inline` là hàm trong đó phần thân của nó được sao chép và dán trực tiếp vào mã gọi.

Theo mặc định, tất cả các hàm trong Kotlin là `non-inline`, nghĩa là chúng được thực thi dưới dạng các lệnh gọi hàm riêng biệt. 

Tuy nhiên, khi chúng tôi đánh dấu một hàm là `inline`, **compiler sẽ thay thế lệnh gọi hàm bằng nội dung của hàm**. Điều này làm giảm chi phí của lệnh gọi hàm cũng như việc tạo ra các đối tượng không cần thiết.


Hãy xem một ví dụ và tìm hiểu điều gì đang xảy ra:

```kotlin
inline fun measureTimeMillis(block: () -> Unit): Long {
    val startTime = System.currentTimeMillis()
    block()
    return System.currentTimeMillis() - startTime
}

fun main() {
    val time = measureTimeMillis {
        // do some time-consuming operation
        Thread.sleep(1000)
    }
    println("Time taken: $time milliseconds")
}
```

Bằng cách đánh dấu hàm `measureTimeMillis` là `inline`, Kotlin compiler sẽ thay thế bất kỳ lệnh gọi nào đến hàm này bằng mã thực tế bên trong thân hàm tại thời điểm biên dịch.

Trong Kotlin, các hàm được lưu trữ trong bộ nhớ giống như mọi đối tượng khác. Khi một hàm được xác định trong mã, nó sẽ được biên dịch thành mã byte và sau đó có thể được tải vào bộ nhớ trong khi thực hiện chương trình.

Khi hàm được gọi, mã của nó sẽ được tải vào bộ nhớ và bộ xử lý bắt đầu thực thi mã này. Giống như các đối tượng khác, các hàm được lưu trữ trong heap, một vùng bộ nhớ được phân bổ để lưu trữ các đối tượng trong quá trình thực thi chương trình. Khi bạn tạo một hàm trong heap, đủ bộ nhớ sẽ được phân bổ để lưu trữ hàm đó, bao gồm mã hàm và mọi biến hoặc đối tượng cần thiết để chạy hàm đó.

> [!IMPORTANT]
> Điều quan trọng là phải hiểu rằng mỗi khi một hàm được gọi, một phiên bản mới của hàm sẽ được tạo trong bộ nhớ. Điều này có nghĩa là nếu một hàm được gọi lặp đi lặp lại thì nhiều phiên bản của hàm đó sẽ được tạo trong bộ nhớ.

Nhìn chung, **các hàm nội tuyến có thể là một công cụ mạnh mẽ trong Kotlin để tối ưu hóa mã quan trọng về hiệu năng bằng cách loại bỏ chi phí gọi hàm.**

> [!CAUTION]
> Tuy nhiên, bạn nên sử dụng chúng một cách cẩn thận, vì nội tuyến quá nhiều mã có thể dẫn đến kích thước nhị phân tăng lên và thời gian biên dịch lâu hơn.

## Lợi ích của hàm nội tuyến

- **Cải thiện hiệu suất**: vì mã của hàm nội tuyến được chèn trực tiếp vào mã gọi nên không cần tạo đối tượng hàm bổ sung, điều này giúp giảm chi phí hoạt động của lệnh gọi hàm.

- **Giảm mức sử dụng bộ nhớ**: hàm nội tuyến tránh việc tạo đối tượng hàm và đối tượng đóng của nó, điều này dẫn đến sử dụng ít bộ nhớ hơn.

- **Tối ưu hóa Higher-order function**: các hàm nội tuyến cho phép chúng ta sử dụng các hàm bậc cao hơn mà không cần gọi hàm, giúp mã nhanh hơn và hiệu quả hơn.


## Khi nào chúng ta sử dụng các hàm nội tuyến?

- **Các hàm được sử dụng làm đối số cho các hàm khác**: nội tuyến một hàm được sử dụng làm đối số cho một hàm khác sẽ loại bỏ chi phí hoạt động của các lệnh gọi hàm và cải thiện hiệu suất của mã.

- **Các hàm được sử dụng thường xuyên**: nếu một hàm được gọi thường xuyên, việc đánh dấu hàm đó là `inline` có thể cải thiện đáng kể hiệu suất của mã bằng cách giảm chi phí của các lệnh gọi hàm.

- **Các hàm trả về biểu thức lambda**: nếu một hàm trả về lambda expression thì việc đánh dấu hàm đó là `inline` có thể giúp giảm chi phí của lệnh gọi hàm khi lambda expression được gọi.

- **Hàm nhỏ**: nội tuyến các hàm nhỏ có thể giúp giảm chi phí hoạt động của lệnh gọi hàm và cải thiện hiệu suất của mã.

## Hàm nội tuyến cũng có một số hạn chế mà chúng ta cần lưu ý:

- **Sao chép mã**: các hàm nội tuyến có thể dẫn đến trùng lặp mã, điều này có thể làm tăng kích thước của mã được biên dịch.

- **Hàm lớn**: nội tuyến các hàm lớn có thể dẫn đến tăng kích thước mã vì toàn bộ nội dung hàm được sao chép và dán vào mã gọi.

- **Hàm đệ quy**: các hàm nội tuyến không thể đệ quy, vì việc nội tuyến hàm đệ quy có thể dẫn đến một vòng lặp vô hạn.

## Tham số loại được thống nhất

Trong phần thân của một hàm phổ quát, bạn không thể truy cập loại `T` vì nó chỉ khả dụng tại thời điểm biên dịch nhưng bị xóa tại runtime. Vì vậy, nếu bạn muốn sử dụng một kiểu chung làm một lớp thông thường trong phần nội dung của hàm, bạn cần truyền lớp đó một cách rõ ràng dưới dạng một tham số, như sau:

```kotlin
fun <T> myFun(c: Class<T>)
```

Tham số loại được thống nhất là một tính năng khác của Kotlin có thể được sử dụng cùng với các hàm nội tuyến để cung cấp thông tin loại bổ sung tại runtime


`reified` là một từ khóa trong Kotlin được sử dụng để đánh dấu một tham số loại là có sẵn tại runtime. Nói cách khác, tham số loại `reified` là những tham số không bị xóa bởi compiler mà thay vào đó, giữ lại thông tin loại của chúng tại runtime. Bằng cách đánh dấu một tham số loại là `reified`, có thể sử dụng nó như một đối tượng lớp thông thường, với tất cả thông tin về loại của nó có sẵn tại runtime

```kotlin
inline fun <reified T> printType() {
    println(T::class.qualifiedName)
}
```
Hàm in tên đủ điều kiện của lớp được biểu thị bằng tham số loại thống nhất. Lợi ích chính của việc sử dụng tham số loại được thống nhất trong các hàm nội tuyến là **nó cho phép kiểm tra và truyền kiểu linh hoạt và mạnh mẽ hơn tại runtime. Điều này có thể đặc biệt hữu ích trong trường hợp cần thông tin loại của các tham số loại chung tại runtime.**

