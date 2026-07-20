## Loại ký tự

Một ký tự có thể được biểu thị bằng mã thập lục phân Unicode, bắt đầu bằng `\u`:

```kotlin
val ch = '\u0040' // '@'
println(ch) // @
```

Mã đại diện chính xác cho một ký tự.

### Trình tự thoát

Các ký tự đặc biệt bắt đầu bằng `\` được gọi là **chuỗi thoát**:

- `\n`: dòng mới
- `\t`: tab
- `\r`: trả lại vận chuyển
- `\\`: dấu gạch chéo ngược
- `\'`: trích dẫn đơn
- `\"`: trích dẫn kép

### Các phép toán quan hệ với ký tự

Các ký tự có thể được so sánh bằng cách sử dụng các toán tử quan hệ (`==`, `<`, `>`, `<=`, `>=`, `!=`) dựa trên vị trí Unicode của chúng.

Để kiểm tra xem một ký tự có phải là chữ số hay không (mã `\u0030` đến `\u0039`):

```kotlin
fun main() {
    val ch = readln().first()
    val isDigit = ch in '\u0030'..'\u0039'
    println(isDigit)
}
```

