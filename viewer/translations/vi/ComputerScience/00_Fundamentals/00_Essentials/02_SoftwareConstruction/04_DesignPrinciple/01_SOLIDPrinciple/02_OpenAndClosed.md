# Nguyên tắc đóng/mở


Nguyên tắc Đóng-Mở yêu cầu **các lớp phải được mở để mở rộng và đóng để sửa đổi.**

Vậy điều mà nguyên tắc này muốn nói là:
Chúng ta có thể thêm chức năng mới mà không cần chạm vào mã hiện có của lớp.
Điều này là do bất cứ khi nào chúng tôi sửa đổi mã hiện có, chúng tôi đều có nguy cơ tạo ra các lỗi tiềm ẩn. Vì vậy, chúng ta nên tránh chạm vào mã sản xuất (hầu hết) đã được kiểm tra và đáng tin cậy nếu có thể.


Nhưng bạn có thể hỏi làm cách nào để thêm chức năng mới mà không cần chạm vào lớp. Nó thường được thực hiện với sự trợ giúp của **giao diện và các lớp trừu tượng**.

## Ví dụ:

Giả sử sếp của chúng tôi đến gặp chúng tôi và nói rằng họ muốn lưu hóa đơn vào cơ sở dữ liệu để chúng tôi có thể tìm kiếm dễ dàng. Chúng tôi nghĩ được thôi, việc này dễ thôi ông chủ, hãy đợi tôi một giây!

```java
public class InvoicePersistence {
    Invoice invoice;

    public InvoicePersistence(Invoice invoice) {
        this.invoice = invoice;
    }

    public void saveToFile(String filename) {
        // Creates a file with given name and writes the invoice
    }

    public void saveToDatabase() {
        // Saves the invoice to database
    }
}
```

Thật không may, chúng tôi, với tư cách là nhà phát triển lười biếng của cửa hàng sách, đã không thiết kế các lớp để có thể dễ dàng mở rộng trong tương lai. Vì vậy, để thêm tính năng này, chúng tôi đã sửa đổi lớp `InvoicePersistence`.

Nếu thiết kế lớp của chúng ta tuân theo nguyên tắc Mở-Đóng thì chúng ta sẽ không cần thay đổi lớp này.

Vì vậy, với tư cách là nhà phát triển lười biếng nhưng thông minh cho cửa hàng sách, chúng tôi nhìn thấy vấn đề trong thiết kế và quyết định cấu trúc lại mã để tuân thủ nguyên tắc.

```java
interface InvoicePersistence {

    public void save(Invoice invoice);
}
```

Chúng tôi thay đổi loại `InvoicePersistence` thành `Interface` và thêm phương thức `save`. Mỗi lớp kiên trì sẽ triển khai phương thức `save` này.

```kotlin
public class DatabasePersistence implements InvoicePersistence {

    @Override
    public void save(Invoice invoice) {
        // Save to DB
    }
}
```

```kotlin
public class FilePersistence implements InvoicePersistence {

    @Override
    public void save(Invoice invoice) {
        // Save to file
    }
}
```
Nhưng giả sử chúng tôi mở rộng ứng dụng của mình và có nhiều lớp kiên trì như `InvoicePersistence`, `BookPersistence` và chúng tôi tạo một lớp `PersistenceManager` để quản lý tất cả các lớp kiên trì:

```java
public class PersistenceManager {
    InvoicePersistence invoicePersistence;
    BookPersistence bookPersistence;

    public PersistenceManager(InvoicePersistence invoicePersistence,
                              BookPersistence bookPersistence) {
        this.invoicePersistence = invoicePersistence;
        this.bookPersistence = bookPersistence;
    }
}
```

Bây giờ chúng ta có thể chuyển bất kỳ lớp nào triển khai giao diện `InvoicePersistence` sang lớp này với sự trợ giúp của polymorphism. Đây là tính linh hoạt mà giao diện cung cấp.

## Tham khảo
- https://www.freecodecamp.org/news/solid-principles-explained-in-plain-english/



