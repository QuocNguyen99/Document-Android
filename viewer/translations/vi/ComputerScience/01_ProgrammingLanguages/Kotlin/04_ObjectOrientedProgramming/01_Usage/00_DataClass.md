

##Data Class 
data class là một cách thuận tiện để sắp xếp dữ liệu hoặc tạo DTO (Đối tượng truyền dữ liệu).

Ví dụ về đường dẫn đến giải pháp
chúng tôi cần một lớp, vì vậy đây là một lớp `Client` thú vị:

```kotlin
class Client(val name: String, val age: Int, val gender: String)
```

Hiện tại nó có 3 tài sản, cho đến nay rất tốt! Nhưng để so sánh chính xác các đối tượng (tức là theo thuộc tính của chúng), chúng ta cần triển khai các hàm `equals()` và `hashCode()`:

```kotlin
class Client(val name: String, val age: Int, val gender: String) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as Client

        if (name != other.name) return false
        if (age != other.age) return false
        if (gender != other.gender) return false

        return true
    }

    override fun hashCode(): Int {
        var result = name.hashCode()
        result = 31 * result + age
        result = 31 * result + gender.hashCode()
        return result
    }
}
```

Tại sao chúng ta cần một đoạn mã dài như vậy chỉ dành cho những thứ tiêu chuẩn? Đó là câu hỏi đúng vì với data class chúng ta có thể đơn giản hóa nó như thế này:

```kotlin
data class Client(val name: String, val age: Int, val gender: String)
```

Chờ đợi! Tất cả các chức năng của tôi bây giờ ở đâu? Thực ra với từ khóa `data` thì bạn không cần đến chúng nữa. 
**Nó sẽ hoạt động một cách kỳ diệu như thể bạn đã triển khai tất cả chúng**. 

Từ khóa này cũng sẽ cung cấp các hàm `toString()`, `copy()` và `componentN()` với hành vi mặc định (bằng và hashCode). 

Chúng ta sẽ xem xét `copy()` và `componentN()`a sau, nhưng ngay bây giờ bạn cần nhớ một số quy tắc tại đây:
1. Bạn chỉ có thể tin cậy vào các thuộc tính bên trong hàm tạo.
```kotlin
data class Client(val name: String, val age: Int, val gender: String) {
    var balance: Int = 0
}
```
Tất cả các hàm đó sẽ không xem xét trường số dư, **vì nó không nằm trong hàm tạo.**

2. Bạn có thể ghi đè tất cả các chức năng đó, ngoại trừ `copy()`:
3. Hàm tạo chính của data class phải có ít nhất một tham số và tất cả các tham số đó phải là `val` hoặc `var`.

### Sao chép và ComponentN

Thành thật mà nói, thực sự không có cách nào thuận tiện để sao chép một đối tượng trong Java, nhưng Kotlin thì khác.

chúng tôi vừa sử dụng hàm `copy()`, hàm này sẽ được cung cấp tự động với từ khóa `data`. 
```kotlin
fun main() {
    val bob = Client("Bob", 29, "Male")
    val john = bob.copy(name = "John")
    println(bob) // Client(name='Bob', age=29, gender='Male', balance=0)
    println(john) // Client(name='John', age=29, gender='Male', balance=0)
}
```

## Đặt tên đối số trong các hàm bị ghi đè

Các hàm thường có thể có một số đối số và để cải thiện khả năng đọc mã trong Kotlin, bạn có thể sử dụng các đối số được đặt tên khi gọi hàm.

```kotlin
    val shape: Shape = Circle()
    shape.draw(color = "red", strokeWidth = 3)
``` 

## Khai báo cấu trúc

### Phá hủy cơ bản

chúng ta có thể tách tất cả các biến khỏi lớp và làm việc với chúng như các đối tượng riêng biệt:

```kotlin
data class User(val name: String, val age: Int, val isAdmin: Boolean)

val anonym = User("Anonym", 999, false)
val (userName, userAge, isAdmin) = anonym

println(userName)  // prints Anonym
println(userAge)   // prints 999
println(isAdmin)   // prints false
```

Khai báo phá hủy sử dụng toán tử `componentN()`, trả về phần tử thứ n từ lớp. Đoạn mã trên được biên dịch thành đoạn mã sau:

```kotlin
val userName = anonym.component1()
val userAge = anonym.component2()
val isAdmin = anonym.component3()
```
### Phá hủy không có lớp dữ liệu

Việc hủy cấu trúc cũng có thể được sử dụng mà không cần các lớp dữ liệu. Chúng ta chỉ cần xác định **toán tử ** componentN theo cách thủ công.

```kotlin
class User(val name: String, val age: Int, val isAdmin: Boolean){
    operator fun component1(): String = name
    operator fun component2(): Int = age
    operator fun component3(): Boolean = isAdmin
}

// now we can use default destructuring syntax
fun checkIsAdmin(suspiciousUser: User) {
    // destructuring
    val (name, age, isAdmin) = suspiciousUser
}
```

> [!NOTE]
> Lưu ý rằng chúng tôi không thể ghi đè toán tử componentN trong các lớp dữ liệu vì Kotlin làm điều đó cho chúng tôi

### Phá hủy bằng danh sách và vòng lặp

Khai báo hủy cấu trúc cũng hoạt động với danh sách và vòng lặp vì `List` là lớp có toán tử `componentN` được triển khai.


```kotlin
fun processList(customerInfo: MutableList<String>) {
    val (firstName, lastName, city) = customerInfo
}
```

### Gạch dưới các biến

Khi chúng tôi bắt đầu sử dụng khai báo hủy, Kotlin compiler có thể cảnh báo chúng tôi về các biến không được sử dụng trong khai báo hủy. Giải pháp IDE mặc định là đổi tên các biến không sử dụng thành "_" (gạch dưới). nhưng hãy thử sao chép-dán một số mã từ nơi khác:

```kotlin
val usersData = mutableListOf<User>()
for ((_, _, isAdmin) in usersData) {
    // /~
}
```

toán tử `componentN` đã bỏ qua các thuộc tính `name` và `age`, vì vậy chúng không thể được sử dụng trong chu trình.

> [!TIP]
> Phá hủy trong Kotlin chỉ cần làm code rõ ràng. Vòng lặp truyền thống sẽ tốt hơn khi cần truy cập toàn bộ đối tượng hoặc ưu tiên hiệu suất và độ rõ ràng.