# Loại diễn viên và diễn viên thông minh

## toán tử is và !is

Các toán tử `is` và `!is` trong Kotlin được sử dụng để kiểm tra loại. Chúng cho phép các nhà phát triển kiểm tra xem một đối tượng có thuộc một loại dữ liệu cụ thể hay không. 

## Diễn viên thông minh

Kotlin còn có một tính năng được gọi là **diễn viên thông minh**. Truyền thông minh được dùng để đơn giản hóa mã khi làm việc với **các loại có giá trị rỗng**. Khi loại có thể rỗng được kiểm tra bằng toán tử is, Kotlin sẽ tự động chuyển đối tượng thành loại không thể rỗng.

Bán tại

```kotlin
fun printLength(obj: Any) {
   if (obj is String) {
      println(obj.length)
   }
}
```

Trong đoạn mã trên, chúng tôi kiểm tra xem biến `obj` có phải là `String` hay không bằng cách sử dụng toán tử `is`. Nếu đó là `String`, chúng tôi sẽ in độ dài của nó. Vì Kotlin tự động chuyển biến `obj` thành loại không thể rỗng, nên chúng ta không cần sử dụng bất kỳ toán tử truyền kiểu nào.

## Toán tử truyền "Không an toàn"

Kotlin có toán tử truyền không an toàn, được biểu thị bằng từ khóa `as`. Từ khóa `as` được sử dụng để chuyển một đối tượng thành **loại không thể rỗng**. Nếu đối tượng không thể được truyền sang loại đã chỉ định, toán tử as sẽ ném `ClassCastException`.

Bán tại

```kotlin
val obj: Any = "Hello, Kotlin"
val str: String = obj as String // Unsafe cast operator
println(str.uppercase())
```

## Toán tử truyền "An toàn" (nullable)

Kotlin cũng có toán tử truyền an toàn, được biểu thị bằng từ khóa `as?`. Toán tử `as?` được sử dụng để chuyển một đối tượng thành loại nullable. Nếu đối tượng không thể được truyền sang loại đã chỉ định, toán tử `as?` trả về `null`.


```kotlin
fun main() {
    val obj: Any = 123
    val str: String? = obj as? String // Safe (nullable) cast operator
    if (str != null) {
        println(str.uppercase())
    }
}
```
