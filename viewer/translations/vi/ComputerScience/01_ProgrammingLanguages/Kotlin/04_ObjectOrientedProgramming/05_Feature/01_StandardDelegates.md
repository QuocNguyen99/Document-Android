# Đại biểu tiêu chuẩn

Ngoài **đại biểu lớp**, Kotlin còn có một chức năng mạnh mẽ được gọi là **thuộc tính được ủy quyền**.

Tính năng này cho phép ủy quyền các phương thức getter và setter của một thuộc tính cho một đối tượng khác.

Khả năng này tỏ ra có giá trị khi sử dụng lại **hành vi thông thường**, **tách logic** hoặc **chỉ tính một giá trị một lần**

## thuộc tính được ủy quyền

Không giống như các thuộc tính truyền thống, các thuộc tính được ủy quyền không được hỗ trợ bởi trường lớp. Thay vào đó, họ **ủy quyền nhận và cài đặt cho một đoạn mã khác.**

Các thuộc tính được ủy quyền được sử dụng bằng cách khai báo thuộc tính và đại biểu mà nó sử dụng. Từ khóa `by` chỉ ra rằng thuộc tính được kiểm soát bởi đại biểu được cung cấp thay vì trường riêng của nó.

Ví dụ:

```kotlin
class Example {
    var p: String by Delegate()
}
```

Tóm lại, đại biểu có các phương thức `getValue()` và `setValue()`, tương ứng với các phương thức `get()` và `set()`, tương ứng với thuộc tính.

## Đại biểu tiêu chuẩn

Thư viện tiêu chuẩn Kotlin đi kèm với một bộ đại biểu tiêu chuẩn sẵn sàng sử dụng để tạo:

### 1. **Thuộc tính lười biếng**: 

Hàm lười biếng lấy một lambda và trả về một phiên bản `Lazy<T>`, đóng vai trò là đại biểu để triển khai thuộc tính lười biếng. 
Lệnh gọi đầu tiên tới `get()` thực thi lambda được chuyển tới `lazy()` và ghi nhớ kết quả. Các cuộc gọi tiếp theo tới `get()` chỉ cần trả về kết quả đã ghi nhớ (được lưu trong cache).

```kotlin
val lazyValue: String by lazy {
    print("Computed! ")
    "Hello"
}

fun main() {
    println(lazyValue) // Computed! Hello
    println(lazyValue) // Hello
}
```

### 2. **Thuộc tính có thể quan sát**: 
Đại biểu có thể quan sát **cho phép kích hoạt lambda bất cứ khi nào giá trị của thuộc tính thay đổi**, dẫn đến thông báo thay đổi hoặc cập nhật các thuộc tính liên quan khác.

```kotlin
import kotlin.properties.Delegates

class User {
    var rank: String by Delegates.observable("<no rank>") {
        prop, old, new -> println("${prop.name}: $old -> $new")
    }
}

fun main() {
    val user = User()
    user.rank = "first"  // rank: <no rank> -> first
    user.rank = "second" // rank: first -> second
}
```


### 3. **Tài sản có quyền phủ quyết**: 
Hàm lambda được gọi trước khi đặt một giá trị mới và cho phép hàm quyết định xem giá trị mới nên được chấp nhận hay từ chối.

```kotlin
import kotlin.properties.Delegates

var max: Int by Delegates.vetoable(0) { prop, old, new ->
    new > old
}

fun main() {
    println(max) // 0
    max = 10
    println(max) // 10
    max = 5
    println(max) // 10
}
```

### 4. **Thuộc tính NotNull**:

một đại biểu thuộc tính cho một thuộc tính không null phải được khởi tạo trước khi nó được truy cập.

```kotlin
import kotlin.properties.Delegates

class Person{
    var name: String by Delegates.notNull()
}

fun main() {
    val person = Person()
    person.name // Throws IllegalStateException:
                // Property name should be initialized before get.
    person.name = "Ahmed Omar"
    println(person.name) // Prints "Ahmed Omar"
}
```


### 5. **Lưu trữ thuộc tính trên bản đồ**: 

Các thuộc tính có thể được lưu trữ trong `MutableMap` hoặc `Map` để sao lưu các thuộc tính mutable hoặc immutable tương ứng.

```kotlin
class User(val map: MutableMap<String, Any?>) {
    var name: String by map
    var age: Int     by map
}

fun main() {
    val user = User(mutableMapOf(
        "name" to "Ahmed Omar",
        "age"  to 25
    ))

    println(user.name) // Prints "Ahmed Omar"
    println(user.age)  // Prints 25

    user.name = "Ahmed Omar"
    user.age = 30

    println(user.name) // Prints "Ahmed Omar"
    println(user.age)  // Prints 30
}
```

## Trường hợp sử dụng thực tế

Các thuộc tính được ủy quyền tiêu chuẩn trong Kotlin có thể được sử dụng trong nhiều tình huống thực tế khác nhau. 

Một số trong số đó bao gồm:

1. **Khởi tạo lười biếng**: Đại biểu `lazy` rất hữu ích cho các thuộc tính tốn nhiều chi phí tính toán hoặc có thể không cần thiết chút nào.

2. **Quan sát các thay đổi thuộc tính**: Đại biểu `observable` có thể được sử dụng để quan sát các thay đổi đối với thuộc tính và thực hiện các hành động khi thuộc tính bị thay đổi, chẳng hạn như cập nhật UI hoặc xác thực giá trị mới.

3. **Phủ quyết các thay đổi thuộc tính**: Đại biểu `vetoable` có thể được sử dụng để phủ quyết các thay đổi đối với một thuộc tính dựa trên logic tùy chỉnh, chẳng hạn như đảm bảo rằng một giá trị vẫn nằm trong một phạm vi nhất định hoặc đáp ứng các tiêu chí nhất định.

4. **Thuộc tính NotNull**: Điều này có thể hữu ích để đảm bảo rằng các điều kiện tiên quyết nhất định được đáp ứng trước khi sử dụng một đối tượng.

5. **Lưu trữ thuộc tính trên bản đồ**: Bản đồ và đại biểu `mutableMap` có thể được sử dụng để lưu trữ thuộc tính trong bản đồ thay vì các trường riêng biệt cho từng thuộc tính; chúng rất hữu ích cho các cấu trúc dữ liệu động hoặc cho các đối tượng tuần tự hóa và giải tuần tự hóa.









