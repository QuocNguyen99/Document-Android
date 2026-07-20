# Lambda với receiver

**Định nghĩa Receiver**

Trong ngữ cảnh của các hàm mở rộng, receiver là một phiên bản đối tượng mở rộng chức năng của nó theo hàm.  Bạn có thể bỏ qua người nhận để cấp cho bạn quyền truy cập trực tiếp vào các thành viên của receiver.
## Làm việc với lambda bằng bộ thu

- **lambda có receiver** là một cách để xác định hành vi tương tự như một hàm mở rộng và nó sử dụng biểu thức lambda để hoạt động với một số đối tượng.

- Với **lambda có bộ thu**, bạn cho biết cách giải quyết các phương thức trong nội dung lambda. receiver là loại chức năng mở rộng.

- Nó **cho phép truy cập vào các phương thức và thuộc tính hiển thị của receiver của lambda** trong phần nội dung của nó mà không cần bất kỳ hạn định bổ sung nào.

Ví dụ :

```kotlin
val sum: Int.(Int) -> Int = { a -> this + a }

fun main() {
    println(sum(1, 2)) // 3
    println(1.sum(2)) // 3
}
```

Các loại hàm có thể tùy ý có một loại receiver bổ sung, được chỉ định trước dấu chấm trong ký hiệu: ` A.(B) -> C { body }` **đại diện cho các hàm có thể được gọi trên đối tượng receiver A với tham số B, trả về giá trị C và thực hiện bất kỳ hành động nào trong nội dung.**

> [!WARNING]
> Lambda với Receiver không thể truy cập trực tiếp vào thành viên riêng tư của receiver


