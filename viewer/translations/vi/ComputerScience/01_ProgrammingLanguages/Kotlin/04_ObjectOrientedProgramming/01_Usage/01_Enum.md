# Enum

"Làm cách nào tôi có thể lưu trữ nhiều hằng số ở một nơi và xử lý tất cả chúng cùng một lúc?" Chà, đối với câu hỏi này Kotlin có câu trả lời và chúng tôi gọi câu trả lời đó là **Enums**. 


Về cơ bản, **Enums** đại diện cho một tập hợp các hằng số logic và chúng làm cho mã của chúng ta rõ ràng và dễ đọc hơn. Chúng ta hãy xem xét kỹ hơn về họ.


`enum` là một từ khóa, cho phép chúng ta tạo bảng liệt kê của riêng mình (từ mà `enum` đại diện) chỉ từ một lớp thông thường:

Theo Quy ước mã hóa Kotlin, bạn có thể sử dụng các tên được phân tách bằng chữ in hoa (như các hằng số Kotlin thông thường là `RED_COLOR`)


Bán tại:

```kotlin
enum class Status {
    OPEN, PENDING, IN_PROGRESS, RESOLVED, REJECTED, CLOSED
}


enum class Rainbow(val color: String, val rgb: String) {
    RED("Red", "#FF0000"),
    ORANGE("Orange", "#FF7F00"),
    YELLOW("Yellow", "#FFFF00"),
    GREEN("Green", "#00FF00"),
    BLUE("Blue", "#0000FF"),
    INDIGO("Indigo", "#4B0082"),
    VIOLET("Violet", "#8B00FF")
}

```

`Enum` vẫn là một lớp tùy chỉnh, vì vậy chúng ta có thể thêm vào đó các phương thức của riêng mình.
Hãy thêm một phương thức sẽ in thông tin đầy đủ về một phiên bản của Lớp của chúng tôi:

```kotlin
enum class Rainbow(val color: String, val rgb: String) {
    RED("Red", "#FF0000"),
    ORANGE("Orange", "#FF7F00"),
    YELLOW("Yellow", "#FFFF00"),
    GREEN("Green", "#00FF00"),
    BLUE("Blue", "#0000FF"),
    INDIGO("Indigo", "#4B0082"),
    VIOLET("Violet", "#8B00FF");

    fun printFullInfo() {
        println("Color - $color, rgb - $rgb")
    }
}
```

## Phương thức và thuộc tính Enum

1. `name` cho phép bạn lấy tên phiên bản của Enum

2. `ordinal` chứa vị trí của instance của Enum

3. Thuộc tính `entries` trả về một mảng gồm tất cả các phiên bản của `Enum`. Nó có thể hữu ích nếu bạn muốn lặp qua các phiên bản `Enum`. Bây giờ chúng ta có thể kiểm tra xem có màu cụ thể nào là một phần của Đối tượng hay không.

4. `valueOf()` trả về một thể hiện của Enum theo tên của nó với kiểu String và phân biệt chữ hoa chữ thường

Nếu không có phiên bản Enum thích hợp nào thì `IllegalArgumentException` sẽ bị ném ra. Xin lưu ý rằng phương pháp này phân biệt chữ hoa chữ thường.

```kotlin
enum class Color(val hex: String) {
    RED("#FF0000"),
    GREEN("#00FF00"),
    BLUE("#0000FF")
}

fun main() {
    // name - Get the name of Enum instance
    val colorName = Color.RED.name
    println("Color name: $colorName")  // Output: Color name: RED

    // ordinal - Get the position of Enum instance
    val colorOrdinal = Color.RED.ordinal
    println("Color ordinal: $colorOrdinal")  // Output: Color ordinal: 0

    // entries - Get all instances of Enum
    val allColors = Color.entries
    println("All colors: ${allColors.joinToString(", ") { it.name }}")  
    // Output: All colors: RED, GREEN, BLUE

    // valueOf() - Get an instance by name (case-sensitive)
    try {
        val greenColor = Color.valueOf("GREEN")
        println("Color found: $greenColor")  // Output: Color found: GREEN
    } catch (e: IllegalArgumentException) {
        println("Error: ${e.message}")
    }
}
```