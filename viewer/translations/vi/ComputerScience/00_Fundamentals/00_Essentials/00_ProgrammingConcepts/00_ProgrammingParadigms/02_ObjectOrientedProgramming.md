#Object-Oriented Programming (OOP)

## Nguyên tắc cốt lõi của OOP

### 1. **Encapsulation**

Encapsulation hạn chế quyền truy cập trực tiếp vào một số thành phần của đối tượng, tăng cường tính bảo mật và toàn vẹn dữ liệu. 

Ví dụ: trong Kotlin:

```kotlin
class BankAccount(private var balance: Double) {

    fun getBalance(): Double = balance

    fun deposit(amount: Double) {
        if (amount > 0) balance += amount
    }

    fun withdraw(amount: Double) {
        if (amount in 0.0..balance) balance -= amount
    }
}
```

### 2. **Tóm tắt**

Tính trừu tượng liên quan đến việc ẩn các chi tiết triển khai phức tạp và chỉ hiển thị các tính năng thiết yếu của đối tượng. Điều này giúp đơn giản hóa việc quản lý mã và tăng cường khả năng đọc. 

Trong Kotlin, tính trừu tượng có thể đạt được bằng cách sử dụng các lớp và giao diện trừu tượng:

```kotlin
abstract class Animal {
    abstract fun makeSound()
}

class Dog : Animal() {
    override fun makeSound() {
        println("Bark")
    }
}
```

### 3. **Inheritance**

Nguyên tắc này cho phép một lớp mới (lớp con hoặc lớp con) kế thừa các thuộc tính và phương thức từ một lớp hiện có (lớp cha hoặc lớp cha), 
thúc đẩy khả năng sử dụng lại mã và thiết lập mối quan hệ phân cấp giữa các lớp.


Ví dụ:

```kotlin
open class Vehicle(val brand: String) {
    open fun honk() {
        println("Beep beep!")
    }
}

class Car(brand: String, val model: String) : Vehicle(brand) {
    override fun honk() {
        println("Honk! I'm a $brand $model")
    }
}

```

### 4. **Polymorphism**

Polymorphism cho phép các đối tượng thuộc các lớp khác nhau phản hồi cùng một lệnh gọi phương thức theo những cách khác nhau, cho phép một giao diện duy nhất kiểm soát quyền truy cập vào nhiều loại dữ liệu khác nhau. Điều này tăng cường tính linh hoạt và tích hợp. 

Một ví dụ trong Kotlin:

```kotlin
open class Animal {
    open fun speak() = println("Some generic sound")
}

class Cat : Animal() {
    override fun speak() = println("Meow")
}

class Dog : Animal() {
    override fun speak() = println("Woof")
}

```

## Lợi ích của OOP

- **Tính mô-đun**: source code cho một đối tượng có thể được viết và duy trì độc lập với source code cho các đối tượng khác. Sau khi được tạo, một đối tượng có thể dễ dàng được truyền qua bên trong hệ thống.

- **Khả năng sử dụng lại**: Thông qua inheritance, lập trình viên có thể tạo các lớp mới được xây dựng dựa trên các lớp hiện có, thúc đẩy khả năng sử dụng lại mã và giảm sự dư thừa.

- **Khả năng mở rộng**: Hệ thống có thể dễ dàng mở rộng bằng cách thêm các đối tượng, thuộc tính và phương thức mới mà không cần sửa đổi mã hiện có.

- **Khả năng bảo trì**: Cấu trúc mô-đun của OOP giúp việc gỡ lỗi, kiểm tra và duy trì mã dễ dàng hơn.
