#Chức năng Kotlin

Hàm là một chuỗi các lệnh, chúng ta có thể gọi nó từ một chương trình bằng cách gọi tên của nó. Hàm đại diện cho các chương trình con và chúng thực hiện một số hành động
Về cơ bản, nó chỉ là một hộp xử lý các đối số đầu vào (dữ liệu đầu vào) và tạo ra kết quả hữu ích hoặc không tạo ra kết quả nào.

## Đối số của hàm

Khi muốn sử dụng một hàm, chúng ta có thể gọi (hoặc gọi) hàm đó bằng tên của hàm đó, theo sau là dấu ngoặc đơn. 
Nếu một hàm có một hoặc nhiều đối số (dữ liệu đầu vào), chúng phải được chuyển vào dấu ngoặc đơn.
Hàm cũng có thể không có đối số nào cả.

## Kết quả hàm

Một số hàm không chỉ nhận đối số mà còn tạo ra (trả về) một số kết quả. Bạn cũng có thể gán nó cho một biến

## Cú pháp cơ bản

Một hàm có một tên để bạn có thể gọi nó khi cần.

Để khai báo một hàm mới, bạn cần chỉ ra từ khóa fun và tên hàm, danh sách các tham số trong ngoặc đơn và loại giá trị kết quả.

```kotlin
fun functionName(p1: Type1, p2: Type2, ...): ReturnType {
    // body
    return result
}
```

> [!NOTE]
> Các đối số của một hàm chỉ có thể được truy cập trong hàm đó. 
> Dòng sau câu lệnh return sẽ không được thực thi (gọi là mã không thể truy cập)


## Hàm biểu thức đơn

Nếu một hàm trả về một biểu thức đơn lẻ, bạn có thể viết nó mà không cần dấu ngoặc nhọn. Đó là một cách thành ngữ để tạo ra các hàm ngắn gọn

Bán tại: 

```kotlin
    fun sum(a: Int, b: Int): Int = a + b
    fun sayHello(): Unit = println("Hello")\
    fun isPositive(number: Int): Boolean = number > 0
```