# Lớp trừu tượng

lớp trừu tượng là lớp không thể được khởi tạo trực tiếp nhưng đóng vai trò là bản thiết kế chi tiết cho các lớp khác.
Nó hoạt động như một lớp được triển khai một phần, cung cấp cấu trúc và hành vi chung mà các lớp con có thể kế thừa và xây dựng dựa trên đó.

Một lớp trừu tượng có thể có cả thành viên trừu tượng và không trừu tượng (thuộc tính và phương thức).

Để khai báo một thành viên là trừu tượng, bạn phải sử dụng từ khóa `abstract` một cách rõ ràng. 
Lưu ý rằng một thành viên trừu tượng không có phần nội dung (phần triển khai) trong lớp của nó.

```kotlin
abstract class Animal(val id: Int) {
    val name: String // We get here a compile-time error: property must be initialized or be abstract
    
    abstract fun makeSound()

    fun isSleeping(): Boolean {
        ...
        return false
    }
}
```

> [!NOTE]
> Theo mặc định, các lớp trừu tượng trong Kotlin có thể được mở rộng và các phương thức cũng như thuộc tính trừu tượng của chúng có thể bị ghi đè.

## Triển khai

Khi một lớp mở rộng một lớp trừu tượng, nó phải cung cấp các triển khai cho tất cả các thành viên trừu tượng được khai báo trong lớp trừu tượng.

```kotlin
abstract class Animal {
    abstract fun move()
    abstract fun makeSound()

    fun eat(): Boolean = false
    fun sleep(): Boolean = false
}

class Cat : Animal() {
    override fun move() {
        // Implementation specific to how the cat moves
    }

    override fun makeSound() {
        // Implementation specific to what sound the cat makes
    }
}
```
##Inheritance

Một lớp trừu tượng cũng có thể đóng vai trò là lớp cơ sở cho các lớp trừu tượng khác. Trong những trường hợp như vậy, các lớp con chịu trách nhiệm triển khai bất kỳ phương thức trừu tượng nào được kế thừa từ cả siêu lớp và siêu lớp trừu tượng trực tiếp của nó.

```kotlin
abstract class Animal {
    abstract fun makeSound()
}

abstract class Mammal : Animal() {
    abstract fun eat()
}

class Cat : Mammal() {
    override fun makeSound() {
        println("Meow!")
    }

    override fun eat() {
        println("The cat is eating.")
    }
}
```

Trong Kotlin, cũng có thể tạo một lớp trừu tượng kế thừa từ một lớp mở trong khi ghi đè thành viên `open` không trừu tượng bằng một lớp trừu tượng bằng cách sử dụng hai từ khóa: `abstract override`.

```kotlin
open class Polygon {
    open fun draw() {
        // Some default polygon drawing method
    }
}

abstract class WildShape : Polygon() {
    // Classes that inherit WildShape need to provide their own draw method instead of using the default on Polygon
    abstract override fun draw()
}
```



## Lớp trừu tượng so với giao diện


| Tính năng | **Lớp học trừu tượng** | **Giao diện** |
|----------|----------------------|----------------|
| **Khởi tạo** | Chúng không thể được khởi tạo trực tiếp. Chúng được dùng làm cơ sở cho các lớp con kế thừa. | Chúng không thể được khởi tạo trực tiếp. Chúng xác định một hợp đồng về các phương thức và thuộc tính mà các lớp triển khai phải tuân thủ. |
| **Nhà xây dựng** | Chúng có thể có các hàm tạo, bao gồm cả hàm tạo chính và hàm tạo phụ. Các lớp con có trách nhiệm gọi hàm tạo của lớp cha thích hợp. | Họ không thể có nhà xây dựng. Họ chỉ khai báo các phương thức và thuộc tính mà không thực hiện bất kỳ thao tác nào. |
| **Tiểu bang** | Chúng có thể có các biến thành viên và các phương thức không trừu tượng với cách triển khai mặc định. Họ cũng có thể giữ trạng thái và duy trì dữ liệu nội bộ. | Họ không thể giữ trạng thái hoặc xác định các biến thành viên. Họ hoàn toàn tập trung vào việc tuyên bố hành vi. |
| **Inheritance** | Các lớp con chỉ có thể mở rộng một lớp trừu tượng. Trong Kotlin, lớp inheritance được giới hạn ở một lớp duy nhất và các lớp trừu tượng cung cấp cách thiết lập hệ thống phân cấp inheritance. | Các lớp triển khai có thể triển khai nhiều giao diện. Kotlin hỗ trợ nhiều inheritance thông qua các giao diện, cho phép các lớp triển khai nhiều giao diện cùng một lúc. |
| **Thành viên trừu tượng và không trừu tượng** | Chúng có thể có cả các phương thức và thuộc tính trừu tượng và không trừu tượng. Các lớp con phải cung cấp các triển khai cho các thành viên trừu tượng trong khi kế thừa các thành viên không trừu tượng. | Họ có thể khai báo các phương thức trừu tượng hoặc các phương thức có cài đặt mặc định. Cả hai loại phương thức đều có thể được ghi đè bằng cách triển khai các lớp. |


Khi quyết định giữa các lớp trừu tượng và giao diện, hãy xem xét các nguyên tắc sau:
- Sử dụng các lớp `abstract` khi bạn muốn **cung cấp cách triển khai mặc định** hoặc khi bạn cần **duy trì trạng thái nội bộ trong lớp cơ sở**.
- Sử dụng `interface` khi bạn muốn **xác định hợp đồng hành vi mà nhiều lớp không liên quan có thể thực hiện** hoặc **khi bạn cần đạt được nhiều inheritance**.