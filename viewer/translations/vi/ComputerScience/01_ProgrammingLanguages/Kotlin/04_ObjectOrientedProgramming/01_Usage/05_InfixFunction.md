# Hàm infix

## Ký hiệu trung tố

Ký hiệu trung tố được sử dụng trong mã số học và logic.
Nó được đặc trưng bởi vị trí của các toán tử giữa các toán hạng: ví dụ: `2 + 3`, trong đó `+` là toán tử trung tố.

Để xác định infix function, bạn phải đáp ứng các yêu cầu sau.

- Phải là hàm thành viên hoặc hàm mở rộng.
- Chúng phải có một tham số duy nhất.
- Tham số không được chấp nhận số lượng đối số thay đổi và không được có giá trị mặc định.

Để xác định các hàm của riêng bạn bằng ký hiệu trung tố, chỉ cần thêm từ khóa trung tố vào định nghĩa hàm của bạn.

```kotlin
infix fun Int.add(x: Int): Int = this + x

fun main() {
    println(1.add(2)) // result is 3 as extension function
    println(1 add 2)  // result is 3 as infix function
}
```

Bạn có thể tạo các hàm infix bất cứ khi nào bạn muốn: ví dụ: để cải thiện khả năng đọc mã của bạn hoặc tạo DSL (Ngôn ngữ cụ thể của miền).

> [!WARNING]
> Nhưng hãy nhớ, các lệnh gọi infix function có mức độ ưu tiên thấp hơn các toán tử số học hoặc các phần tử khác được xác định trong ngôn ngữ, chẳng hạn như các kiểu ép kiểu và toán tử `rangeTo`.

Mặt khác, mức độ ưu tiên cuộc gọi của infix function cao hơn mức ưu tiên của các toán tử boolean `&&` và `||`, `is` và `in` và một số toán tử khác.

> [!NOTE]
> Cũng hãy nhớ rằng các hàm infix luôn yêu cầu cả receiver và tham số phải được chỉ định và bạn phải sử dụng từ khóa `this` để tham chiếu receiver hiện tại.

## Ví dụ thực tế


```kotlin
// String concatenation
infix fun String.concat(other: String): String = this + other
val greeting = "Hello" concat "World"  // HelloWorld

// Map creation
infix fun <K, V> K.to(value: V): Pair<K, V> = Pair(this, value)
val map = mapOf(1 to "One", 2 to "Two")

// Custom class with infix function
class Person(val name: String) {
    infix fun likes(thing: String): String = "$name likes $thing"
}

val john = Person("John")
println(john likes "coding")  // John likes coding
```


