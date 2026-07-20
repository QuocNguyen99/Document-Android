# Phạm vi

Mỗi biến có một phạm vi đặc biệt mà nó có thể được sử dụng. 
**Phạm vi của một biến là vùng mã được phân tách bằng cú pháp trong đó biến hoặc mã định danh này, sau khi được khai báo, có thể được sử dụng theo cách này hay cách khác.**
Đó là, nó có thể nhìn thấy được. Ví dụ: phạm vi có thể là toàn bộ chương trình, hàm hoặc tệp.


Trong những trường hợp đơn giản nhất, phạm vi được xác định theo vị trí khai báo mã định danh. Ngoài phạm vi này, cùng một mã định danh có thể được liên kết với một biến khác hoặc hoàn toàn không được liên kết với bất kỳ biến nào.

Chúng ta hãy xem xét điều này chi tiết hơn dưới đây:

```kotlin
val outer = 10
if (outer > 0) {
    val inner = 10
    print(inner)
} else {
    // beyond the if block 
    print(outer)
    print(inner)  // Unresolved reference: inner
}
// beyond the if-else expression
print(outer)
print(inner)  // Unresolved reference: inner
```
vòng lặp

```kotlin
var outer = 5
while (outer < 10) {
    var inner = 10
    inner *= 2
    print(inner)
    outer++
}  // prints 2020202020

// outside the while loop
print(inner)  // Unresolved reference: inner
```
chức năng
```kotlin
fun localScope() {
    val identifier = "Variable in the function localScope()"
    println(identifier)  // prints "Variable in the function localScope()"
}

fun main() {
    val identifier = "Variable in fun main()"
    localScope()
    println(identifier)  // prints "Variable in fun main()"
}
```

##Tương tác giữa các phạm vi

Nói chung, phạm vi chương trình thường được phân lớp. Một số phạm vi được bao gồm trong các phạm vi khác và tất cả điều này tạo thành một hệ thống phân cấp.

Ví dụ: 

```kotlin
var id = 5  // id (outer scope) = 5
if (true) {
    id = 6  // id (outer scope) = 6
    var id = 10  // id (inner scope) = 10
    println(id)  // prints inner id
}
println(id)  // prints outer id
```

- Nếu phạm vi B được lồng trong phạm vi A thì các mã định danh từ phạm vi A có thể được sử dụng trong phạm vi B mà không cần khai báo bổ sung.
- Nếu bất kỳ mã định danh nào được xác định trong phạm vi B lồng nhau như vậy thì chúng sẽ không hiển thị trong phạm vi A.
- Mã định danh được gọi trước tiên được tìm kiếm trong phạm vi hiện tại và sau đó trong phạm vi phân cấp.

## Biến cấp cao nhất

Các biến trong chương trình, tùy thuộc vào phạm vi, có thể được chia thành biến cấp cao nhất và biến cục bộ.
**Biến cấp cao nhất được khai báo bên ngoài nội dung của bất kỳ lớp hoặc hàm nào và phạm vi của chúng là toàn bộ tệp**, trong khi các biến cục bộ được tạo khi bạn xác định chúng, chẳng hạn như trong nội dung của hàm.

Ví dụ:


```kotlin
val top = "Top-level variable"
fun localScope() {
    println(top) 
}

fun main() {
    println(top)  // prints "Top-level variable"
    localScope()  // prints "Top-level variable"
}
```

Như bạn có thể dễ dàng thấy, nó có thể truy cập được từ mọi nơi trong chương trình. Đây là cách để xác định hằng số.

```kotlin
const val CONSTANT = 0 // constant value definition

fun main() {
    // ...
}
```

Một quy tắc lịch sự phổ biến:
- Tốt hơn hết là sử dụng các biến cục bộ. 
- Sử dụng mã cấp cao nhất sẽ không tốt lắm: nó làm giảm khả năng đọc mã và dẫn đến lỗi, đôi khi rất khó tìm và sửa.