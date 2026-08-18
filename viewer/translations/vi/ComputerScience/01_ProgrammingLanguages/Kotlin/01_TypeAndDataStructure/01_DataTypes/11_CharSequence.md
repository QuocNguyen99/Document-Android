#CharSequence

CharSequence trong Kotlin là interface đại diện cho một chuỗi ký tự. Nó được thiết kế để có tên **immutable**. điều đó có nghĩa là nội dung của nó không thể thay đổi sau khi nó được tạo.


một số phương pháp có sẵn cho `CharSequence`:

- `charAt()` trả về ký tự tại chỉ mục đã chỉ định (trong trường hợp này là ký tự đầu tiên).

- `subSequence()` trả về một `CharSequence` mới đại diện cho một dải ký tự từ `CharSequence` ban đầu (trong trường hợp này là các ký tự từ chỉ số 1 đến 4).

- `contains()` kiểm tra xem một ký tự hoặc chuỗi ký tự được chỉ định có xuất hiện trong CharSequence hay không (trong trường hợp này, kiểm tra xem "amp", không phân biệt chữ hoa chữ thường, có trong CharSequence hay không).

## CharSequence so với Chuỗi (sự khác biệt)

Sự khác biệt đáng kể nhất giữa `CharSequence` và `String` là `CharSequence` là một interface, trong khi `String` là một lớp cụ thể trong Kotlin.

`CharSequence` có thể được coi là một interface tổng quát hơn mà String triển khai. Bất kỳ `String` nào cũng là `CharSequence`, nhưng không phải mọi `CharSequence` đều là một Chuỗi.

Một điểm khác biệt giữa `CharSequence` và `String` là phân biệt chữ hoa chữ thường. `CharSequence` phân biệt chữ hoa chữ thường, trong khi `String` không phân biệt chữ hoa chữ thường

```kotlin
fun main() {
    val string: String = "Hello, World!"
    val charSequence: CharSequence = string

    println(string.uppercase()) // prints "HELLO, WORLD!"
    // The following line won't compile because CharSequence doesn't have an uppercase() function
    // println(charSequence.toUpperCase())
}
```

Tóm lại, `String` là một lớp cụ thể triển khai interface `CharSequence` và cung cấp chức năng bổ sung, trong khi `CharSequence` là một interface xác định một chuỗi ký tự có thể được các lớp khác nhau triển khai.

## Cách sử dụng CharSequence (khi nào nên sử dụng, cách chuyển sang String)

`CharSequence` có thể được sử dụng trong các tình huống mà chúng ta cần biểu diễn một chuỗi ký tự nhưng không biết trước cách triển khai chính xác của chuỗi đó.

Ví dụ: nếu chúng ta muốn đọc một tệp lớn vào bộ nhớ, chúng ta có thể không biết chính xác độ dài của tệp, vì vậy chúng ta có thể sử dụng `CharSequence` để thể hiện nội dung của tệp.

Để chuyển đổi `CharSequence` thành Chuỗi, chúng ta chỉ cần sử dụng phương thức `toString()`.

Lưu ý rằng bất kỳ đối tượng `String` nào cũng có thể được sử dụng làm đối tượng `CharSequence`, vì `String` triển khai interface `CharSequence`.