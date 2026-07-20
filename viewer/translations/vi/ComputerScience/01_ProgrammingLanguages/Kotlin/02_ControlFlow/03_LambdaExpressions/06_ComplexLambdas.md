# Biểu thức lambda nâng cao

## Lambda phức tạp

dòng cuối cùng bên trong lambda được coi là giá trị trả về lambda.

Trong Kotlin, "trả về sớm hơn" đề cập đến khả năng chấm dứt việc thực thi lambda expression hoặc một hàm trước khi đến cuối khối của nó bằng cách sử dụng từ khóa `return`.

Các kết quả trả về trước đó phải được viết bằng cách sử dụng **cú pháp trả về đủ điều kiện**. Điều này có nghĩa là sau từ khóa `return`, chúng ta cần viết ký hiệu `@` và tên nhãn. Tên nhãn thường là tên của hàm mà lambda được truyền vào.

Ví dụ:

```kotlin
fun processNumbers(numbers: List<Int>, action: (Int) -> Unit) {
    numbers.forEach label@{ number ->
        if (number < 0) return@label // Using qualified return to skip negative numbers
        println("Processing: $number")
        action(number) // Calling the lambda function
    }
    println("Processing completed!") // This line still executes because return only exits the lambda
}

fun main() {
    val numbers = listOf(5, -3, 8, -1, 10)

    processNumbers(numbers) { num ->
        val result = num * 2 // Last line in lambda -> implicitly returned value
        println("Doubled: $result")
    }
}
```

## Ghi lại các biến

Việc thu thập các biến còn được gọi là sử dụng giá trị đã thu thập, đề cập đến process của việc đặt một biến trong lambda expression hoặc hàm ẩn danh để có thể sử dụng biến đó bên trong phần nội dung của hàm.

> [!NOTE]
> Khi bạn nắm bắt một biến trong một bao đóng, về cơ bản bạn đang tạo một bản sao của biến đó và cung cấp biến đó cho hàm ngay cả khi biến ban đầu nằm ngoài phạm vi hoặc không thể truy cập được nữa. Điều đó cho phép bạn viết các hàm phụ thuộc vào các biến từ môi trường xung quanh chúng mà không cần phải chuyển các biến đó làm đối số cho hàm.

Bây giờ hãy thảo luận về lợi thế của việc tạo các hàm tại runtime. Vấn đề là tất cả các biến và giá trị hiển thị ở nơi lambda được tạo cũng hiển thị bên trong lambda.

**Nếu lambda sử dụng một biến được khai báo bên ngoài lambda thì chúng ta nói rằng lambda sẽ nắm bắt biến đó**.

Điều đó hoạt động trực quan. Trong trường hợp giá trị được ghi lại, lambda chỉ có thể đọc nó. Nếu một biến được ghi lại, lambda và mã bên ngoài có thể thay đổi biến đó và những thay đổi này sẽ hiển thị cả trong lambda lẫn mã bên ngoài.

Hãy xem ví dụ dưới đây:

```kotlin
var count = 0

val changeAndPrint = {
    ++count
    println(count)
}

println(count)    // 0
changeAndPrint()  // 1
count += 10
changeAndPrint()  // 12
println(count)    // 12
```
