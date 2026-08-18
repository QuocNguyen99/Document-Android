# Ngoại lệ và tài nguyên

Đôi khi, chúng tôi có thể cần phải làm việc với các tài nguyên khác nhau, như tệp, ổ cắm, kết nối cơ sở dữ liệu, v.v. và các trường hợp ngoại lệ cũng có thể xảy ra trong những trường hợp đó

## Làm việc với tài nguyên

Tài nguyên là dữ liệu mà ứng dụng có thể truy cập. **Kotlin là programming language ** độc lập với nền tảng và nó cho phép bạn chỉ kiểm soát trực tiếp các biến và đối tượng chứ không phải bộ nhớ máy tính và các đối tượng của nó, chẳng hạn như tệp, ổ cắm, cơ sở dữ liệu, v.v. Tuy nhiên, Kotlin cung cấp các phương thức để truy cập tài nguyên hệ điều hành thông qua JVM.

Ví dụ: khi chúng tôi làm việc với các tệp (đọc tệp, ghi vào tệp, v.v.), luồng IO sẽ được tạo.

JVM thông báo cho hệ điều hành (OS) về việc bắt đầu công việc với một tệp và nếu mọi thứ đều ổn, OS sẽ trả về bộ mô tả tệp, được sử dụng để truy cập tệp.

```kotlin
var reader = FileReader("somefile.txt")
val text = reader.readText()
reader.close()
```
Khi chúng tôi tạo một phiên bản `FileReader`, chúng tôi sẽ mở `input stream` để đọc dữ liệu từ một tệp.

Nếu bạn muốn viết nội dung nào đó vào tệp, bạn nên sử dụng `FileWriter`; bên dưới bạn có thể xem một ví dụ:

```kotlin
val writer = FileWriter("somefile.txt")
writer.write("hello!")
writer.close()
```

Phương thức `close()` được JVM sử dụng để giải phóng tài nguyên. Nếu chúng ta nói về các tệp, OS có thể cung cấp một số bộ mô tả tệp có giới hạn. Nếu chúng ta tiếp tục tạo tài nguyên mà không giải phóng chúng thì có thể xảy ra ngoại lệ do không đủ bộ nhớ. Đó là lý do tại sao các tài nguyên như `FileReader`, `BufferedReader`, `Socket`, v.v. phải được đóng khi chúng **không được sử dụng** nữa.

Tuy nhiên, có thể xảy ra sự cố sau khi khai báo một số tài nguyên nhất định và có thể đưa ra các ngoại lệ. Điều đó có nghĩa là `close()` không được gọi và tài nguyên hệ thống không được giải phóng.

### Làm quen với việc sử dụng()

May mắn thay, vấn đề trên về tài nguyên có thể được giải quyết bằng phương pháp `use()`, phương pháp quản lý tài nguyên một cách tự động.

```kotlin
val reader = FileReader("test.txt")
reader.use {
    reader.read()
}
```

Phương thức này nhận một biểu thức hàm, thực thi nó và bằng cách gọi `close()` trên biểu thức đó, giải phóng tài nguyên mỗi khi quá trình thực thi hoàn tất – **bất kể có hay không có ngoại lệ**.

### Có thể đóng so với AutoCloseable

Interface `Closeable` và `AutoCloseable` giới thiệu các đối tượng có thể chứa tài nguyên (chẳng hạn như các thẻ điều khiển tệp hoặc ổ cắm) cho đến khi tài nguyên bị đóng. Hàm `use()` được xác định trong cả hai interface và sau khi chúng tôi gọi nó, `close()` được gọi tự động khi thoát khỏi khối try-with-resources. `Closeable` là interface cũ hơn nhưng vẫn mở rộng `AutoCloseable` nhằm mục đích tương thích ngược.

Sự khác biệt chính giữa `Closeable` và `AutoCloseable` là `AutoCloseable` có loại ngoại lệ hạn chế – **nó chỉ có thể ném** `IOException` **và những người thừa kế của nó**. Trong khi đó, trong `AutoCloseable`, phạm vi ngoại lệ đã được mở rộng thành `Exception`.

Chúng ta có thể gọi hàm use trên bất kỳ đối tượng nào triển khai `AutoCloseable` hoặc `Closeable`, nhưng `AutoCloseable` mới hơn và linh hoạt hơn.










