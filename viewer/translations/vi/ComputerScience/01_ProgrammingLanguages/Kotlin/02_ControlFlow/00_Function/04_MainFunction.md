# Hàm main()

- `fun` là từ khóa thể hiện `main()` là một hàm. Chỉ là một chức năng thông thường;

- `main` là tên hàm. Điều quan trọng cần biết là chúng ta không thể thay đổi nó: ví dụ: nếu chúng ta thay đổi nó thành `Main()`, chương trình sẽ biên dịch nhưng không bắt đầu;

- và cuối cùng, phần thân của hàm, như bạn đã biết, sẽ được đặt trong dấu ngoặc nhọn.

Vì vậy, bất cứ điều gì bạn có thể làm với chức năng thông thường, ngoại trừ việc đổi tên, đều có thể được thực hiện với `main()`.

## Đối số của hàm chính

Trên thực tế, hàm `main()` có thể có các tham số đầu vào.

Chúng nên được gọi là args và được lưu trữ trong một chuỗi các chuỗi. Và cú pháp của `main()` sẽ như thế này:

```kotlin
fun main(args: Array<String>) {}
```

nhưng nó dùng để làm gì?

Nói một cách đơn giản, các đối số của hàm `main()` **là các đối số của chương trình**. Bạn có thể đã tận dụng cơ hội thiết lập nó nhiều lần trong đời, chẳng hạn như khi bạn mở một tệp có "Mở bằng...": trong trường hợp này, vị trí tệp được chuyển bằng cách sử dụng các đối số của chương trình.

Vì vậy, bằng cách sử dụng các đối số `main()`, chúng tôi truyền một số dữ liệu bên ngoài bổ sung đến chính chương trình.

### Làm việc với các đối số trên dòng lệnh

Để gửi các đối số dòng lệnh đến ứng dụng của bạn, bạn cần có một chương trình được biên dịch trước.

Vì vậy, hãy xem xét cách bạn có thể chuyển các đối số qua bảng điều khiển: trước tiên, bạn cần một chương trình được biên dịch. Khi bạn có một cái, bạn gọi dòng lệnh. Sau đó, bạn chạy ứng dụng bằng lệnh sau:

```bash
 java -jar filename.jar args
```

### Có hoặc không có đối số?

sẽ không có lỗi khi tệp của bạn chứa cả hai phiên bản `main()` – có và không có đối số. Chương trình sẽ bắt đầu bằng cách thực thi `main(args: Array <String>) {}`:

```kotlin
fun main(args: Array<String>) {
    println(args[0]) // Love
    println(args[1]) // Kotlin!
}

fun main() {
    println("Hello, World!")
} // will not be called
```

> [!CAUTION]
> Còn kiểu kia, số kia và tên đối số khác thì sao? Tất nhiên, bạn có thể có hàm `main()` với các tham số đầu vào hoàn toàn khác nhau trong một tệp, ví dụ: nó có thể là `main(arg: Int)` hoặc `main(a: Double, b: String)`, **nhưng khi đó nó sẽ không còn là điểm vào** nữa. Nó sẽ chỉ là một chức năng phổ biến. Để chương trình bắt đầu, tệp chương trình phải chứa hàm có chữ ký `main()` hoặc `main(args: Array<String>)`.