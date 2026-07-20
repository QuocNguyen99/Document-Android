# Phương thức trừu tượng đơn (SAM)

Giao diện chỉ có một hàm thành viên trừu tượng được gọi là giao diện chức năng hoặc giao diện **Phương thức trừu tượng đơn (SAM).**

Giao diện chức năng có thể có một số hàm thành viên không trừu tượng nhưng chỉ có một hàm thành viên trừu tượng.

bạn có thể sử dụng chuyển đổi SAM để giúp mã của bạn ngắn gọn và dễ đọc hơn bằng cách sử dụng biểu thức lambda.

Ví dụ: hãy xem xét giao diện chức năng Kotlin sau:

```kotlin
fun interface IntPredicate {
   fun accept(i: Int): Boolean
}
```

Nếu bạn không sử dụng chuyển đổi SAM, bạn sẽ cần viết mã như thế này:

```kotlin
// Creating an instance of a class
val isEven = object : IntPredicate {
   override fun accept(i: Int): Boolean {
       return i % 2 == 0
   }
}
```

Bằng cách tận dụng chuyển đổi SAM của Kotlin, bạn có thể viết mã tương đương sau:


```kotlin
// Creating an instance using lambda
val isEven = IntPredicate { it % 2 == 0 }
```