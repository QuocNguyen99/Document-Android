# Null và bộ sưu tập

Chúng ta có bốn trường hợp:

```kotlin
val list = listOf<String>() //non-null collection

var nullableList: List<Int>? = listOf<Int>(1, 2, 4, 6) //nullable collection with non-nullable element

val listWithNullableElements: List<Int?> = listOf<Int?>(1, 2, 4, null, null) // collection  is non-nullable type, but the elements inside are nullable.

var absolutelyNullableList: List<Int?>? = listOf<Int?>(1, 2, 4, null, null) //  nullable collection with nullable element type
```
 
**Nguyên tắc cơ bản là**: nếu chúng ta có thể trả về một collection trống — thì tốt hơn là trả về giá trị rỗng và sử dụng các loại giá trị rỗng.

## Tạo bộ sưu tập không null từ các chuỗi có phần tử null

Đôi khi bạn có các chuỗi phần tử có `null` và bạn cần sử dụng chúng để tạo collection không có `null`. Trong trường hợp đó, bạn có thể sử dụng các chức năng đặc biệt `listOfNotNull()` và `setOfNotNull()`

```kotlin
val list = listOfNotNull(1, null, 50, 404, 42, null, 42, 404) // [1, 50, 404, 42, 42, 404]
val set = setOfNotNull(1, null, 50, 404, 42, null, 42, 404) // [1, 50, 404, 42]
```
## Hàm cho bộ sưu tập có thể rỗng

Kotlin có một số công cụ tiện lợi cho các bộ sưu tập có phần tử null:

- Hàm `isNullOrEmpty()` trả về true nếu collection trống hoặc bằng `null`. Trong tất cả các trường hợp khác, nó trả về `false`.

- Hàm `getOrNull()` trả về một phần tử của danh sách hoặc mảng, nhưng nếu phần tử này không tồn tại thì trả về `null` (không hoạt động với `Set`).

- `randomOrNull()` hoạt động giống như phiên bản trước: nó trả về null nếu collection trống và là phần tử ngẫu nhiên trong tất cả các trường hợp khác.