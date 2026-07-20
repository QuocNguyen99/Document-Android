# Hiển thị các lớp, gói và mô-đun

## Xác định mức độ hiển thị của lớp

Trong Kotlin, mức độ hiển thị của lớp được xác định bởi các công cụ sửa đổi mức độ hiển thị, chỉ định mã nào có thể truy cập vào lớp. Có bốn công cụ sửa đổi khả năng hiển thị:

- **public**: Lớp này có thể truy cập được từ bất kỳ mã nào.
- **internal**: Lớp này chỉ có thể truy cập được trong mô-đun.
- **được bảo vệ**: Lớp chỉ có thể truy cập được trong lớp và các lớp con của nó.
- **riêng tư**: Lớp chỉ có thể truy cập được trong tệp được khai báo.
## Inheritance và khả năng hiển thị

Trong Kotlin, nếu một lớp kế thừa một lớp khác, **lớp đó có thể truy cập các thành viên nội bộ và được bảo vệ của lớp đó.**

## Mô-đun và khả năng hiển thị nội bộ

Một mô-đun là một tập hợp các tệp nguồn được biên dịch cùng nhau.

Trong Kotlin, một mô-đun có thể là dự án IntelliJ IDEA, dự án Gradle hoặc Maven hoặc một đơn vị biên dịch khác.

Công cụ sửa đổi `internal` được sử dụng để chỉ ra rằng một thành phần mã nhất định chỉ có thể truy cập được trong một mô-đun duy nhất. Điều này hữu ích khi bạn muốn hạn chế quyền truy cập vào các phần của mã chỉ có sẵn trong mô-đun và không được hiển thị bên ngoài mô-đun.


```kotlin
// In the file mymodule/MyInternalClass.kt
package mymodule

internal class MyInternalClass {
    val value = 42
}
```

```kotlin
// In another file within the same module
import mymodule.MyInternalClass

fun main() {
    val instance = MyInternalClass() // Allowed, as MyInternalClass is part of the same module
    println(instance.value)
}
```