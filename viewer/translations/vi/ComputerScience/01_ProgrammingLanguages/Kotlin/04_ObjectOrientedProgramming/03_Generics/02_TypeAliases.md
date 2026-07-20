# Gõ bí danh

## Cách sử dụng bí danh loại

Bí danh loại cung cấp tên thay thế cho các loại hiện có – cả loại tiêu chuẩn và loại tùy chỉnh. Nếu tên loại quá dài, bạn nên giới thiệu một tên khác ngắn hơn và sử dụng tên mới thay thế.

```kotlin
class ClassWithVeryLongName{}
typealias SomeClass = ClassWithVeryLongName
```

Ngoài ra, bí danh loại có thể được sử dụng nếu bạn muốn nhấn mạnh loại, ví dụ:

```kotlin
typealias Password = String
val myPassword: Password = "hyperskill"
```
> [!CAUTION]
> Hãy nhớ rằng bí danh loại phải ở cấp cao nhất! Bạn không thể đặt chúng bên trong các lớp học.

Một cách thay thế cho bí danh loại là **nhập bí danh**.  Nếu bạn đang làm việc với một tên lớp dài (đặc biệt, nếu bạn có tên gói trong tên lớp), bạn có thể sử dụng bí danh nhập để rút ngắn nó:

```kotlin
import Pet.Kitten as Kitten
```

> [!NOTE]
> Bạn không cần phải lo lắng rằng việc sử dụng bí danh loại có thể dẫn đến một số lỗi trong runtime: việc kiểm tra thời gian biên dịch sẽ giải quyết vấn đề đó.

### Cách sử dụng với thuốc generic

Trong generic programming, bí danh loại có thể hữu ích trong việc rút ngắn các loại chung dài. Ví dụ:

```kotlin
typealias DessertBox<T> = BoxForSomeDessert<T>

class BoxForSomeDessert<T>(var dessert: T) {
    fun getDessertFromBox(): T {
        return dessert
    }
}

class Tart(var name: String) {}

fun main() {
    var tartBox = DessertBox(Tart("tastytart"))
    println(tartBox.getDessertFromBox().name) // tastytart
}
```

### Đặt tên bí danh loại

Cố gắng xác định các bí danh loại có thể đọc được và có ý nghĩa để các lập trình viên khác có thể hiểu được mã của bạn.

```kotlin
/* bad example */
typealias SomeClass = HashMap<Int, List<String>>

/* good example */
typealias FileTable = MutableMap<Int, MutableList<File>>
```