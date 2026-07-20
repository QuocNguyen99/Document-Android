# Chú thích

Chú thích cung cấp cách cung cấp hướng dẫn và siêu dữ liệu (dữ liệu về dữ liệu) cho compiler, IDE hoặc framework để xử lý một số tác vụ phức tạp và giúp cuộc sống của bạn dễ dàng hơn.

> [!NOTE]
> Siêu dữ liệu là thông tin về dữ liệu làm cho dữ liệu này có ý nghĩa hơn, vì vậy trong trường hợp của chúng tôi, compiler hoặc các khung sẽ có thông tin hữu ích về mã của chúng tôi để thực hiện các tác vụ phức tạp.

Trường hợp phổ biến nhất là sử dụng các thư viện như **Room** hoặc **Retrofit** khi bạn phát triển các ứng dụng hoặc khung Android như **Spring** hoặc **Spring Boot**. 
Các khung này đi kèm với nhiều chú thích tích hợp và thông qua chúng, các khung sẽ biết bạn muốn làm gì và sẽ làm điều đó cho bạn mà không cho bạn thấy cách triển khai phức tạp. 

Bạn có thể coi chú thích là một điều kỳ diệu - một từ có thể làm được rất nhiều việc ở chế độ nền.
Bạn có thể thêm bao nhiêu chú thích tùy thích vào một mục tiêu

## Loại bỏ chú thích

`@Suppress("name of warning")` là chú thích yêu cầu compiler chặn một cảnh báo cụ thể, cảnh báo này được chuyển trong dấu ngoặc kép trong ngoặc đơn.

## Mục tiêu chú thích

Mục tiêu chú thích là tất cả các loại phần tử được chú thích, chẳng hạn như lớp, hàm, thuộc tính và biểu thức.

Một số chú thích có thể hoạt động với các phần tử cụ thể và một số có thể hoạt động với tất cả các phần tử, vì vậy điều quan trọng là phải biết mục tiêu nếu bạn đang tạo chú thích tùy chỉnh hoặc sử dụng chúng.

Ví dụ :

```kotlin
fun main() {
    @Suppress("CanBeVal") 
    var number = 45       // Warning will disappear from here
    var anotherNumber = 5 // Warning will still appear here
    println(number)
    println(anotherNumber)
}
```

Chúng ta cũng có thể nhắm mục tiêu toàn bộ chức năng. Hãy xem xét ví dụ dưới đây:

```kotlin
// no warning at all!
@Suppress("CanBeVal")
fun main() {
    var number = 45
    var anotherNumber = 5
    println(number)
    println(anotherNumber)
}
```

Ngoài ra, chúng ta có thể nhắm mục tiêu cả lớp, như trong ví dụ bên dưới.

```kotlin
@Suppress("unused")
class MyClass {
    fun printNumber() {
        /*..*/
    }

    fun sumNumber() {
        /*..*/
    }
}
```
Cuối cùng nhưng không kém phần quan trọng, chúng ta có thể nhắm mục tiêu toàn bộ tệp bằng cách viết `@file:NameOfAnnotation()` ở đầu tệp.

```kotlin
@file:Suppress("unused")

class MyClass {
    fun printNumber() {
        /*..*/
    }

    fun sumNumber() {
        /*..*/
    }
}

class AnotherClass {
    fun printNumber() {
        /*..*/
    }

    fun sumNumber() {
        /*..*/
    }
}
```