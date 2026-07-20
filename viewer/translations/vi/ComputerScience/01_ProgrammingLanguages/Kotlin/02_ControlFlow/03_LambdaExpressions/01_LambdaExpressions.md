# biểu thức Lambda

cơ hội tạo một hàm tại runtime và không có tên được xác định trước. Đó là lambda! Lambda là một trong những tính năng quan trọng nhất và được sử dụng nhiều trong lập trình hiện đại.

## Hàm không có tên

Để tạo một hàm Kotlin không bị ràng buộc với tên của nó, bạn có thể sử dụng **hàm ẩn danh** hoặc **lambda expression**:

- `fun(arguments): ReturnType { body }` – đây thường được gọi là **hàm ẩn danh**.
- `{ arguments -> body }` – thường được gọi là "lambda expression".

Ví dụ:

```kotlin
fun(a: Int, b: Int): Int {
    return a * b
} // normal function but no name 

{ a: Int, b: Int -> a * b } // we shifted the parameter or argument in the curly braces
```


Lưu ý rằng nếu muốn khai báo **lambda không có đối số**, bạn không cần phải viết "ký hiệu mũi tên". Một lambda không có định nghĩa đối số trông như thế này: `{ body }`.

## Vậy làm cách nào chúng ta có thể sử dụng một hàm mà không biết tên?.

1. Bạn có thể gán hàm cho một biến và sau đó gọi nó bằng cách gọi biến đó
```kotlin
val greet = { name: String -> println("Hello, $name!") }
greet("Alice") // Output: Hello, Alice!
```
2. Bạn có thể truyền một hàm như vậy làm đối số hoặc trả về một hàm như vậy từ một hàm khác.
```kotlin
fun execute(action: (Int) -> Int, number: Int) {
    println("Result: ${action(number)}")
}

val double = { x: Int -> x * 2 }
execute(double, 5) // Output: Result: 10

fun createMultiplier(factor: Int): (Int) -> Int {
    return { x: Int -> x * factor }
}

val triple = createMultiplier(3)
println(triple(4)) // Output: 12
```
3. Bạn có thể đặt dấu ngoặc đơn với các đối số mong muốn ngay sau định nghĩa hàm để gọi nó vào đúng vị trí.

```kotlin
({ x: Int, y: Int -> x + y })(3, 5) // Output: 8
```

> [!WARNING]
> Hơn nữa, có những lập trình viên không tuân theo quy tắc đặt tên chính thức của Kotlin và có thể nói "một hàm ẩn danh" thay vì "một lambda". Mặc dù thực tế là mọi người đều hiểu chúng nhưng chúng tôi khuyên bạn nên sử dụng cách đặt tên phù hợp.

## Tên ẩn của một tham số: it

Khi có một tham số duy nhất trong lambda, bạn có thể bỏ qua tham số đó. Tham số này có sẵn dưới tên `it`. Loại `it` được suy ra từ loại đối số được truyền tới lambda. 

Bạn có thể quay lại từ lambda expression trong Kotlin bằng cách sử dụng `return@label`, trong đó `label` là một thẻ, thường khớp với tên của **higher-order function** trong ngữ cảnh mà lambda được gọi. Việc quay lại với `return@label` cho phép thoát lambda expression mà không làm gián đoạn việc thực thi chức năng bên ngoài.
