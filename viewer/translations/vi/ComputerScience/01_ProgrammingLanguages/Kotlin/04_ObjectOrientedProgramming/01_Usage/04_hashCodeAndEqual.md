# hashCode và bằng

Một trong những vấn đề thường gặp nhất là kiểm tra sự bằng nhau của hai đối tượng. Đối với nhiệm vụ này, chúng ta có thể sử dụng hai phương pháp cơ bản: `hashCode()` và `equals()`.


### Phương thức hashCode()

hash function là một chức năng đặc biệt có thể được sử dụng để ánh xạ dữ liệu có kích thước bất kỳ thành các giá trị có kích thước cố định.

Một trong những đặc tính cơ bản của hàm băm là chúng luôn trả về cùng một giá trị cho cùng một nội dung hoặc thông tin đầu vào, nghĩa là nếu chúng ta chuyển cho chúng cùng một giá trị nội dung thì chúng sẽ luôn trả về cùng một mã băm.

Thuộc tính này có thể được sử dụng để kiểm tra xem hai đối tượng có bằng nhau hay không dựa trên nội dung và hàm băm của chúng. **Nếu nội dung của hai đối tượng, tức là trạng thái của chúng giống nhau thì mã băm của chúng phải giống nhau.**

Để lấy mã băm cho trạng thái của một đối tượng, chúng ta có thể sử dụng các hàm `hashCode()` cho các loại hoặc các lớp đơn giản Kotlin đã được tính toán trước: `Int`, `Long`, `String`, v.v.

```kotlin
    val intValue = 32
    val intValue2 = 64
    val intValue3 = 32

    println(intValue.hashCode()) // 32
    println(intValue2.hashCode()) // 64
    println(intValue3.hashCode()) // 32

    println(intValue.hashCode() == intValue2.hashCode()) // false
    println(intValue.hashCode() == intValue3.hashCode()) // true
```

Để lấy mã băm cho trạng thái của lớp chúng ta, **chúng ta phải ghi đè** `hashCode()` mặc định (được kế thừa từ `Any`) theo các thuộc tính của lớp chúng ta. Bằng cách này, chúng ta có thể có được phương thức `hashCode()` thích hợp để thể hiện trạng thái của đối tượng.

```kotlin
class Person(val name: String, val age: Int) {
    override fun hashCode(): Int {
        var result = name.hashCode()
        result = 31 * result + age.hashCode()
        return result
    }
}

fun main() {
    val person1 = Person("John", 32)
    val person2 = Person("John", 32)
    val person3 = Person("John", 64)

    println(person1.hashCode()) // 71750741
    println(person2.hashCode()) // 71750741
    println(person3.hashCode()) // 71750773

    println(person1.hashCode() == person2.hashCode()) // true
    println(person1.hashCode() == person3.hashCode()) // false
}
```
### Công thức chuẩn
```kotlin
override fun hashCode(): Int {
    var result = field1?.hashCode() ?: 0
    result = 31 * result + (field2?.hashCode() ?: 0)
    // Repeat for other fields...
    return result
}
```


> [!NOTE]
> Giá trị `31` được chọn vì đây là số nguyên tố lẻ. 
> Nếu nó là số chẵn và phép nhân bị tràn thì thông tin sẽ bị mất vì phép nhân với `2` tương đương với việc dịch chuyển. 
> Ưu điểm của việc sử dụng số nguyên tố chưa rõ ràng nhưng nó mang tính truyền thống.
> Một đặc tính hay của `31` là phép nhân có thể được thay thế bằng phép dịch và phép trừ để có hiệu suất tốt hơn: `31 * i == (i << 5) - i`.
> Máy ảo hiện đại tự động thực hiện loại tối ưu hóa này.

### Phương thức bằng

Phương pháp `equals` là gì? Phương thức đặc biệt này so sánh hai đối tượng và trả về true nếu chúng **bằng**. Phương thức này tồn tại theo mặc định cho tất cả các đối tượng và được xác định trong `Any`, **vì vậy chúng ta phải ghi đè nó để điều chỉnh nó cho phù hợp với bản chất và định nghĩa của các lớp của chúng ta**.

chúng ta có thể sử dụng phương thức bằng đã tồn tại được triển khai trong các loại hoặc lớp Kotlin cơ bản: `Int`, `Long`, `String`, v.v. chúng ta có thể gọi nó hoặc sử dụng toán tử ==.


```kotlin
fun main() {
    val intValue = 32
    val intValue2 = 64
    val intValue3 = 32

    println(intValue.equals(intValue2)) // false
    println(intValue.equals(intValue3)) // true
    println(intValue == intValue2) // false
    println(intValue == intValue3) // true

    val stringValue = "Hello"
    val stringValue2 = "Hello"
    val stringValue3 = "Hello World"

    println(stringValue.equals(stringValue2)) // true
    println(stringValue.equals(stringValue3)) // false
    println(stringValue == stringValue2) // true
    println(stringValue == stringValue3) // false
}
```

Để thực hiện đúng thao tác `equals` cho trạng thái của lớp chúng ta, chúng ta phải ghi đè `equals()` mặc định

```kotlin
class Person(val name: String, val age: Int) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is Person) return false

        if (name != other.name) return false
        return age == other.age
    }
}

fun main() {
    println(person1.equals(person2)) // true
    println(person1.equals(person3)) // false
    println(person1 == person2) // true
    println(person1 == person3) // false
}
```

### bằng và mối quan hệ hashCode

Thông thường, phương thức `hashCode()` bị ghi đè để nó hoạt động theo cách `equals()` thực hiện: nghĩa là, nếu hai đối tượng bằng nhau thì chúng phải có cùng giá trị băm. Vì vậy, nếu hai đối tượng bằng nhau, `hashCode()` sẽ tạo ra kết quả số nguyên giống nhau. Do đó, `equals()` trả về true nếu `hashCode()` bằng, nếu không nó trả về false. Điều này rất quan trọng, vì `equals()` và `hashCode()` phải nhất quán và dựa trên cùng các thuộc tính đối tượng để tính toán.

```kotlin
class Person(val name: String, val age: Int) {
    override fun hashCode(): Int {
        var result = name.hashCode()
        result = 31 * result + age.hashCode()
        return result
    }

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is Person) return false

        if (name != other.name) return false
        return age == other.age
    }
}

fun main() {
    println(person1.hashCode() == person2.hashCode()) // true
    println(person1.hashCode() == person3.hashCode()) // false
    println(person1 == person2) // true
    println(person1 == person3) // false
}
```
### bằng và hashCode trong các lớp dữ liệu

Khi chúng tôi đang làm việc với các lớp dữ liệu, các phương thức `equals()` và `hashCode()` được triển khai và xác định tự động dựa trên trạng thái của các thuộc tính xác định data class của chúng tôi trong hàm tạo.

