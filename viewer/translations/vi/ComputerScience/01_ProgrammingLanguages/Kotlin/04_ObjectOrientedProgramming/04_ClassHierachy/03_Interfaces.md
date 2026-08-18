# Interface trong Kotlin

Chúng ta không thể tạo một thể hiện của một interface, nhưng chúng ta có thể tạo một thể hiện của lớp triển khai interface đó.

Interface được triển khai tương tự như kế thừa từ một lớp khác:

```kotlin
interface Animal {
    val numberOfLimbs: Int
    fun move()
    fun communicate(): String
}

class MyAnimalClass : Animal {
	/* ... */    
}
```

Khi đó, mỗi **trường** hoặc **phương thức** được khai báo trong interface, cần được khai báo trong lớp với từ khóa `override`.

## Thêm triển khai mặc định

Vì interface không thể duy trì trạng thái nên chúng tôi không thể sử dụng công cụ khởi tạo thuộc tính để xác định giá trị mặc định:

```kotlin
interface Animal {
    val age = 10 // Error: Property initializers are not allowed in interfaces
}
```

Tuy nhiên, chúng ta có thể sử dụng getters để đạt được kết quả tương tự (tuy nhiên, bạn không thể sử dụng setters vì không có phiên bản nào để gán bất cứ thứ gì cho):

```kotlin
interface Animal {
    val age: Int
        get() = 10
}
```

Vì các phương thức đại diện cho một loại chuỗi hành động hoặc một hành vi nhất định nên việc triển khai mặc định cũng áp dụng cho chúng:

```kotlin
interface Animal {
    val numberOfLimbs: Int
    // Default implementation of a method
    fun printNumberOfLimbs() {
        print(numberOfLimbs)
    }
}
```

> [!NOTE]
> Việc triển khai mặc định cho phép bạn bỏ qua việc ghi đè các thuộc tính hoặc phương thức nhất định trong lớp dẫn xuất, ngoại trừ các trường hợp khi chức năng mặc định không đủ.

## Interface inheritance

Các lớp trong Kotlin không thể mở rộng nhiều hơn một lớp cơ sở, nhưng chúng có thể triển khai một số interface (các lớp có thể mở rộng lớp cơ sở, mở rộng một lớp khác, nhưng điều đó không hoàn toàn giống với ý tưởng chung của nhiều inheritance).

Cú pháp cho lớp và interface inheritance giống nhau: tên của interface mới đặt trước dấu hai chấm `:` và sau từ khóa `interface`; sau dấu hai chấm là tên của interface cơ sở - interface có thuộc tính mà giao diện mới kế thừa:

```kotlin
interface Animal {
    val amountOfLimbs: Int
    fun move()
    fun communicate()
}

interface Bird : Animal {
    val canFly: Boolean
    val flyingSpeed: Int
    fun buildNest()
}
```
### Triển khai interface dẫn xuất
Nguyên tắc chính của việc triển khai các interface dẫn xuất là lớp phải triển khai các phương thức và thuộc tính từ cả interface cơ sở và giao diện dẫn xuất:

```kotlin
class Parrot : Bird // : Animal
{
    // These properties are inherited from the Animal interface...
    override val numberOfLimbs: Int = 2

    override fun move() {
        fly()
    }

    override fun communicate() {
        speak()
    }

    // ...while these ones are specifically from the Bird interface

    override val canFly: Boolean = true

    override val flyingSpeed: Int = 20

    override fun buildNest() {
        collectMaterials()
        findGoodPlace()
        buildSmallNest()
    }
}
```

### Nhiều Inheritance

Chúng tôi cũng có thể sử dụng nhiều inheritance: một lớp thực hiện một số interface khác nhau.

```kotlin
interface Bird : Animal {
    fun buildNest()
}

interface Flying {
    val flyingSpeed: Int
    val flyingManeuverability: Int
}

class Owl : Bird, Flying {

    // Flying interface
    override val flyingSpeed: Int = 100
    override val flyingManeuverability: Int = 95

    // Bird interface
    override fun buildNest() {
        buildSmallNest()
    }

    // Animal Interface
    override val numberOfLimbs: Int = 2

    override fun move() {
        fly()
    }

    override fun communicate() {
        coo()
    }

}
```

### Inheritance từ nhiều interface

Giống như các lớp có thể triển khai một số interface, một interface có thể được bắt nguồn từ một số giao diện khác.

```kotlin
interface FlyingBird : Bird, Flying  
{  
    /* ... */  
}
```

